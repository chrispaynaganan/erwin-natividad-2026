'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { BOOKING_STATUSES, type BookingRow, type BookingStatus } from './types'

export type ActionResult = { ok: boolean; message: string }

// ---------------------------------------------------------------------
// Status pipeline: new → contacted → confirmed → completed / cancelled
// Editors and above. RLS ("bookings: editor manage") is the backstop.
//
// Note: rows synced in from Calendly (referral_source = 'discovery_call'
// with a calendly_invitee_uri set) start life already at 'confirmed' —
// Calendly only creates the invitee once a real slot is booked, so there's
// no "new" / awaiting-confirmation step for those anymore. Cancelling a
// call in Calendly also flips it to 'cancelled' here automatically via the
// webhook; changing status manually here does not cancel it on Calendly's
// side, so use Calendly itself to actually cancel/reschedule a call.
// ---------------------------------------------------------------------
export async function setBookingStatus(id: string, status: BookingStatus): Promise<ActionResult> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don’t have permission to manage bookings.' }
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
//
// Kept for any pre-Calendly waitlisted rows still sitting in the queue.
// New discovery-call bookings never get waitlisted going forward — if
// Calendly's weekly limit is reached, it simply stops offering slots, so
// there's nothing to promote later.
// ---------------------------------------------------------------------
export async function promoteFromWaitlist(id: string): Promise<ActionResult> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don’t have permission to manage bookings.' }
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
    console.warn('[bookings] Promotion email skipped — set RESEND_API_KEY and BOOKING_NOTIFY_EMAIL to enable.')
    return
  }
  const when = [row.preferred_date, row.preferred_time, row.timezone].filter(Boolean).join(' \u00b7 ') || 'No preference given'
  const body =
`Waitlisted discovery request promoted to the active queue

Name:       ${row.full_name}
Email:      ${row.email}
Company:    ${row.company || '—'}
Looking for: ${row.service_interest || '—'}
Preferred:  ${when}
Received:   ${new Date(row.created_at).toLocaleString('en-US')}

${row.message || ''}

— Promoted from the admin panel. Reply directly to reach ${row.full_name}.`
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: row.email, subject: `Waitlist promoted — ${row.full_name}`, text: body }),
    })
    if (!res.ok) console.error('[bookings] Resend responded', res.status, await res.text())
  } catch (e) {
    console.error('[bookings] Promotion email failed', e)
  }
}

// setWeeklyCap() has been removed — the weekly discovery-call limit is now
// set directly on the Discovery Call event type in Calendly (Availability →
// Limit the frequency of bookings), which is the thing actually enforcing
// it. Editing settings.discovery_weekly_cap here no longer affects how many
// calls Calendly will accept, so keeping a control for it in this admin
// panel would just create a second, disconnected "cap" that could drift out
// of sync with the real one.