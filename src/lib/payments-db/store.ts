// src/lib/payments-db/store.ts
import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export type PaymentRow = {
  id: string
  user_id: string | null
  membership_id: string | null
  stripe_payment_intent_id: string
  amount_cents: number
  currency: string
  status: string
  description: string | null
  created_at: string
  profiles: { full_name: string | null } | null
}

export async function listPayments(): Promise<PaymentRow[]> {
  const db = createAdminClient()
  // Join assumption still unverified — flagged again below.
  const { data, error } = await db
    .from('payments')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}