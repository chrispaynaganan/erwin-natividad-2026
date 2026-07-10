'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type SaveState = { ok: boolean; message: string } | null

export type ProfileInput = {
  full_name: string
  timezone: string
  date_format: string
  notify_new_booking: boolean
  notify_new_subscriber: boolean
  notify_new_contact: boolean
}

// Profile / notifications / defaults all write through the SESSION client
// (not service-role) — this is a user editing their own row, and the
// existing "profiles: update own" RLS policy already covers it (it only
// blocks changing your own `role`, which this never touches).
export async function saveProfile(input: ProfileInput): Promise<SaveState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, message: 'You must be signed in.' }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: input.full_name.trim() || null,
      timezone: input.timezone,
      date_format: input.date_format,
      notify_new_booking: input.notify_new_booking,
      notify_new_subscriber: input.notify_new_subscriber,
      notify_new_contact: input.notify_new_contact,
    })
    .eq('id', user.id)

  if (error) return { ok: false, message: 'Could not save: ' + error.message }

  revalidatePath('/admin/settings')
  return { ok: true, message: 'Settings saved.' }
}

// Supabase Auth sends a confirmation email to the NEW address before the
// change actually takes effect — this call succeeding just means that
// email was sent, not that the email has changed yet.
export async function updateEmail(newEmail: string): Promise<SaveState> {
  const trimmed = newEmail.trim()
  if (!trimmed) return { ok: false, message: 'Email cannot be empty.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ email: trimmed })
  if (error) return { ok: false, message: 'Could not update email: ' + error.message }
  return { ok: true, message: 'Check your new email inbox to confirm the change.' }
}

export async function updatePassword(newPassword: string): Promise<SaveState> {
  if (newPassword.length < 8) return { ok: false, message: 'Password must be at least 8 characters.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { ok: false, message: 'Could not update password: ' + error.message }
  return { ok: true, message: 'Password updated.' }
}