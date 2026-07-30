// Row shape of public.bookings — shared by the admin bookings page,
// server actions, and the client manager component.

export const BOOKING_STATUSES = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export type BookingRow = {
  id: string
  full_name: string
  email: string
  company: string | null
  phone: string | null
  website: string | null
  service_interest: string | null
  preferred_date: string | null   // 'YYYY-MM-DD'
  preferred_time: string | null
  timezone: string | null
  message: string | null
  referral_source: string | null  // 'discovery_call' | 'contact_form' | null
  status: BookingStatus
  waitlisted: boolean
  calendly_event_uri: string | null    // set only for rows synced in from Calendly
  calendly_invitee_uri: string | null  // set only for rows synced in from Calendly
  created_at: string
  updated_at: string
}