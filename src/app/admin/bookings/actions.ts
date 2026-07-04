'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { BOOKING_STATUSES, type BookingRow, type BookingStatus } from './types'

export type ActionResult = { ok: boolean; message: string }

// ---------------------------------------------------------------------
// Status pipeline: new → contacted → confirmed → completed / cancelled
// Editors and above. RLS ("bookings: editor manage") is the backstop.
// ---------------------------------------------------------------------
export async function setBookingStatus(id: string, status: BookingStatus): Promise<ActionResult> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to manage bookings.' }
  }
  if (!BOOKING_STATUSES.includes(status)) {
    return { ok: false, message: 'Invalid status.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
  if (error) return { ok: false, message: 'Could not update status: ' + error.message }

  revalidatePath('/admin/bookings')
  return { ok: true, message: 'Status updated.' }
}

// ---------------------------------------------------------------------
// Promote from waitlist: flips the flag and fires the same Resend
// heads-up email the live form sends — waitlisted requests never
// notified Erwin, so this is the moment his inbox learns about it.
// ---------------------------------------------------------------------
export async function promoteFromWaitlist(id: string): Promise<ActionResult> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to manage bookings.' }
  }

  const supabase = await createClient()
  const { data: row, error: readErr } = await supabase
    .from('bookings').select('*').eq('id', id).single<BookingRow>()
  if (readErr || !row) return { ok: false, message: 'Booking not found.' }
  if (!row.waitlisted) return { ok: false, message: 'This request is already in the active queue.' }

  const { error } = await supabase.from('bookings').update({ waitlisted: false }).eq('id', id)
  if (error) return { ok: false, message: 'Could not promote: ' + error.message }

  await notifyPromotion(row)

  revalidatePath('/admin/bookings')
  return { ok: true, message: `${row.full_name} moved to the active queue.` }
}

// Mirrors notifyErwin() in work-with-me/actions.ts. No-op until
// RESEND_API_KEY and BOOKING_NOTIFY_EMAIL are set.
async function notifyPromotion(row: BookingRow) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.BOOKING_NOTIFY_EMAIL
  const from = process.env.BOOKING_FROM_EMAIL || 'Erwin Natividad <onboarding@resend.dev>'
  if (!key || !to) {
    console.warn('[bookings] Promotion email skipped \u2014 set RESEND_API_KEY and BOOKING_NOTIFY_EMAIL to enable.')
    return
  }
  const when = [row.preferred_date, row.preferred_time, row.timezone].filter(Boolean).join(' \u00b7 ') || 'No preference given'
  const body =
`Waitlisted discovery request promoted to the active queue

Name:       ${row.full_name}
Email:      ${row.email}
Company:    ${row.company || '\u2014'}
Looking for: ${row.service_interest || '\u2014'}
Preferred:  ${when}
Received:   ${new Date(row.created_at).toLocaleString('en-US')}

${row.message || ''}

\u2014 Promoted from the admin panel. Reply directly to reach ${row.full_name}.`
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: row.email, subject: `Waitlist promoted \u2014 ${row.full_name}`, text: body }),
    })
    if (!res.ok) console.error('[bookings] Resend responded', res.status, await res.text())
  } catch (e) {
    console.error('[bookings] Promotion email failed', e)
  }
}

// ---------------------------------------------------------------------
// Weekly discovery-call cap (settings.discovery_weekly_cap).
// Admin and above — matches the "settings: admin write" RLS policy.
// ---------------------------------------------------------------------
export async function setWeeklyCap(cap: number): Promise<ActionResult> {
  try {
    await requireRole('admin')
  } catch {
    return { ok: false, message: 'Only admins can change the weekly cap.' }
  }
  const n = Math.floor(cap)
  if (!Number.isFinite(n) || n < 1 || n > 100) {
    return { ok: false, message: 'The cap must be a number between 1 and 100.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('settings').upsert(
    { key: 'discovery_weekly_cap', value: n, is_public: false },
    { onConflict: 'key' },
  )
  if (error) return { ok: false, message: 'Could not save the cap: ' + error.message }

  revalidatePath('/admin/bookings')
  return { ok: true, message: `Weekly cap set to ${n}.` }
}