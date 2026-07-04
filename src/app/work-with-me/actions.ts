'use server'

import { createClient } from '@/lib/supabase/server'

export type BookingState = { ok: boolean; message: string; waitlisted?: boolean } | null

const FIELDS = ['full_name', 'email', 'company', 'project_type', 'challenge', 'details', 'budget', 'heard', 'preferred_date', 'preferred_time', 'timezone'] as const

const WINDOW_DAYS = 7
const DEFAULT_CAP = Number(process.env.DISCOVERY_WEEKLY_CAP) || 3

const MSG_OK = 'Request received! Erwin will email you within 24\u201348 hours to confirm a time. No payment needed \u2014 this is just a conversation.'
const MSG_WAITLIST = 'Erwin\u2019s discovery calls are fully booked for this week, so you\u2019re on the waitlist \u2014 he\u2019ll reach out as soon as a slot opens. No payment needed, and there\u2019s nothing else you need to do.'
const MSG_DUPLICATE = 'Looks like you already have a request in \u2014 Erwin will be in touch soon, so no need to send another.'

function composeMessage(f: Record<string, string>) {
  const parts: string[] = [`Challenge / goal:\n${f.challenge}`]
  if (f.details) parts.push(`Project details:\n${f.details}`)
  if (f.budget) parts.push(`Budget range: ${f.budget}`)
  if (f.heard) parts.push(`Heard about Erwin via: ${f.heard}`)
  return parts.join('\n\n')
}

// Editable weekly cap, read from the settings table (jsonb), with a safe fallback.
async function weeklyCap(supabase: Awaited<ReturnType<typeof createClient>>): Promise<number> {
  try {
    const { data } = await supabase.from('settings').select('value').eq('key', 'discovery_weekly_cap').maybeSingle()
    const v: unknown = data?.value
    const n = typeof v === 'number' ? v : parseInt(String(v), 10)
    if (Number.isFinite(n) && n > 0) return n
  } catch { /* fall back */ }
  return DEFAULT_CAP
}

// Sends Erwin a heads-up email so he knows what to expect before the call.
// No-op (logs a note) until RESEND_API_KEY and BOOKING_NOTIFY_EMAIL are set.
async function notifyErwin(f: Record<string, string>, composed: string) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.BOOKING_NOTIFY_EMAIL
  const from = process.env.BOOKING_FROM_EMAIL || 'Erwin Natividad <onboarding@resend.dev>'
  if (!key || !to) {
    console.warn('[work-with-me] Email notification skipped \u2014 set RESEND_API_KEY and BOOKING_NOTIFY_EMAIL to enable.')
    return
  }
  const when = [f.preferred_date, f.preferred_time, f.timezone].filter(Boolean).join(' \u00b7 ') || 'No preference given'
  const body =
`New discovery call request

Name:       ${f.full_name}
Email:      ${f.email}
Company:    ${f.company || '\u2014'}
Looking for:${f.project_type ? ' ' + f.project_type : ' \u2014'}
Preferred:  ${when}

${composed}

\u2014 Sent from the Work With Me form. Reply directly to reach ${f.full_name}.`
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: f.email, subject: `Discovery call request \u2014 ${f.full_name}`, text: body }),
    })
    if (!res.ok) console.error('[work-with-me] Resend responded', res.status, await res.text())
  } catch (e) {
    console.error('[work-with-me] Email send failed', e)
  }
}

export async function submitBooking(_prev: BookingState, formData: FormData): Promise<BookingState> {
  // Honeypot: a hidden field real users never see. Bots fill it; we silently
  // accept (so the bot moves on) but never store or notify.
  if (String(formData.get('company_url') ?? '').trim()) {
    return { ok: true, message: MSG_OK }
  }

  const f: Record<string, string> = {}
  for (const k of FIELDS) f[k] = String(formData.get(k) ?? '').trim()

  if (!f.full_name || !f.email || !f.challenge) {
    return { ok: false, message: 'Please add your name, email, and a sentence about your goal.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }

  const composed = composeMessage(f)

  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    return { ok: false, message: 'Something went wrong. Please try again, or email Erwin directly.' }
  }

  // Duplicate guard: if this email already has an open request, don't pile on.
  try {
    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('referral_source', 'discovery_call')
      .eq('email', f.email)
      .in('status', ['new', 'contacted', 'confirmed'])
      .limit(1)
    if (existing && existing.length > 0) {
      return { ok: true, message: MSG_DUPLICATE }
    }
  } catch { /* fail open \u2014 better to accept than to block a real client */ }

  // Capacity gate: count active (non-waitlisted, non-cancelled) discovery
  // requests in the rolling window. At or over the cap \u2192 this one waits.
  let waitlisted = false
  try {
    const cap = await weeklyCap(supabase)
    const since = new Date(Date.now() - WINDOW_DAYS * 86400000).toISOString()
    const { count } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('referral_source', 'discovery_call')
      .eq('waitlisted', false)
      .neq('status', 'cancelled')
      .gte('created_at', since)
    if ((count ?? 0) >= cap) waitlisted = true
  } catch { /* fail open \u2014 treat as capacity available */ }

  try {
    const { error } = await supabase.from('bookings').insert({
      full_name: f.full_name,
      email: f.email,
      company: f.company || null,
      service_interest: f.project_type || null,
      preferred_date: f.preferred_date || null,
      preferred_time: f.preferred_time || null,
      timezone: f.timezone || null,
      message: composed,
      referral_source: 'discovery_call',
      waitlisted,
    })
    if (error) {
      console.error('[work-with-me] insert failed:', error)
      return { ok: false, message: 'Something went wrong sending your request. Please try again, or email Erwin directly.' }
    }
  } catch (e) {
    console.error('[work-with-me] unexpected error:', e)
    return { ok: false, message: 'Something went wrong. Please try again, or email Erwin directly.' }
  }

  // Only ping Erwin for live requests \u2014 waitlisted ones sit quietly until he
  // has room, so a surge never floods his inbox.
  if (!waitlisted) await notifyErwin(f, composed)

  return { ok: true, message: waitlisted ? MSG_WAITLIST : MSG_OK, waitlisted }
}