// src/app/actions/newsletter.ts
'use server'

import { createPublicClient } from '@/lib/supabase/public'
import { createAdminClient } from '@/lib/supabase/admin'

export type NewsletterState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const source = String(formData.get('source') ?? 'unknown')

  if (!email || !email.includes('@')) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  // Public client for the insert — doc 02 §1.5 grants anon INSERT on
  // newsletter_subscribers by design, same as bookings/contact.
  const publicDb = createPublicClient()
  const { error: dbError } = await publicDb
    .from('newsletter_subscribers')
    .insert({ email, source, status: 'pending' })

  if (dbError) {
    // citext unique constraint on email is likely — treat a repeat signup
    // as a soft success rather than surfacing it as an error.
    if (dbError.code === '23505') return { status: 'success' }
    console.error('newsletter insert failed:', dbError)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }

  if (process.env.MAILERLITE_API_KEY) {
    try {
      const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          groups: process.env.MAILERLITE_GROUP_ID ? [process.env.MAILERLITE_GROUP_ID] : undefined,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const mailerliteId = data?.data?.id
        if (mailerliteId) {
          // mailerlite_id write needs service-role — anon can INSERT but
          // shouldn't have UPDATE rights on this table (doc 02: "editor+ manage").
          const adminDb = createAdminClient()
          await adminDb.from('newsletter_subscribers').update({ mailerlite_id: String(mailerliteId) }).eq('email', email)
        }
      } else {
        console.error('MailerLite subscribe failed:', await res.text())
      }
    } catch (err) {
      console.error('MailerLite request error:', err)
    }
  } else {
    console.warn('MAILERLITE_API_KEY not set — subscriber saved locally only, no confirmation email sent.')
  }

  return { status: 'success' }
}