import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { BookingsManager } from './bookings-manager'
import type { BookingRow } from './types'

export const metadata = { title: 'Bookings' }

// Always fresh — new submissions (contact form) and Calendly-synced
// discovery calls (via the webhook) should appear on every visit/refresh.
export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  // Editors and above manage bookings.
  await requireRole('editor')

  const supabase = await createClient()
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)

  return <BookingsManager initial={(bookings ?? []) as BookingRow[]} />
}