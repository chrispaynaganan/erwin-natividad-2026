import { requireRole, hasMinRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { BookingsManager } from './bookings-manager'
import type { BookingRow } from './types'

export const metadata = { title: 'Bookings' }

// Always fresh — new submissions should appear on every visit/refresh.
export const dynamic = 'force-dynamic'

export default async function AdminBookingsPage() {
  // Editors and above manage bookings; the cap is editable by admin+.
  const session = await requireRole('editor')
  const canEditCap = hasMinRole(session.profile.role, 'admin')

  const supabase = await createClient()
  const [{ data: bookings }, { data: capRow }] = await Promise.all([
    supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(500),
    supabase.from('settings').select('value').eq('key', 'discovery_weekly_cap').maybeSingle(),
  ])

  const raw: unknown = capRow?.value
  const parsed = typeof raw === 'number' ? raw : parseInt(String(raw ?? ''), 10)
  const weeklyCap = Number.isFinite(parsed) && parsed > 0 ? parsed : 3

  return (
    <BookingsManager
      initial={(bookings ?? []) as BookingRow[]}
      weeklyCap={weeklyCap}
      canEditCap={canEditCap}
    />
  )
}