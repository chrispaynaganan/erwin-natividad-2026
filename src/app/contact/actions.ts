'use server'

import { createClient } from '@/lib/supabase/server'

export type ContactState = { ok: boolean; message: string } | null

// Inserts into public.bookings (RLS allows anonymous insert; staff read).
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const full_name = String(formData.get('full_name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const service_interest = String(formData.get('inquiry') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  if (!full_name || !email || !message) {
    return { ok: false, message: 'Please fill in your name, email, and message.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: 'Please enter a valid email address.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('bookings').insert({
      full_name, email, phone: phone || null, service_interest: service_interest || null, message,
      referral_source: 'contact_form',
    })
    if (error) return { ok: false, message: 'Something went wrong sending your message. Please try again or email directly.' }
    return { ok: true, message: 'Thanks! Your message is in — I\u2019ll get back to you within 24\u201348 hours.' }
  } catch {
    return { ok: false, message: 'Something went wrong. Please try again or email directly.' }
  }
}