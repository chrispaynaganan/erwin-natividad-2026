// src/lib/subscribers-db/store.ts
import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export type SubscriberStatus = 'pending' | 'subscribed' | 'unsubscribed' | 'bounced'

export type SubscriberRow = {
  id: string
  email: string
  status: SubscriberStatus
  source: string | null
  mailerlite_id: string | null
  subscribed_at: string | null
  unsubscribed_at: string | null
  created_at: string
}

export async function listSubscribers(): Promise<SubscriberRow[]> {
  const db = createAdminClient()
  const { data, error } = await db.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function updateSubscriberStatus(id: string, status: SubscriberStatus) {
  const db = createAdminClient()
  const patch: Record<string, unknown> = { status }
  if (status === 'subscribed') patch.subscribed_at = new Date().toISOString()
  if (status === 'unsubscribed') patch.unsubscribed_at = new Date().toISOString()
  const { error } = await db.from('newsletter_subscribers').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteSubscriber(id: string) {
  const db = createAdminClient()
  const { error } = await db.from('newsletter_subscribers').delete().eq('id', id)
  if (error) throw new Error(error.message)
}