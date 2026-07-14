// src/lib/plans-db/store.ts
import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export type PlanRow = {
  id: string
  name: string
  description: string | null
  stripe_price_id: string
  amount_cents: number
  currency: string
  interval: string
  features: string[] | null // jsonb shape assumed — unconfirmed, see note below
  is_active: boolean
}

export async function listActivePlans(): Promise<PlanRow[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('plans')
    .select('id, name, description, stripe_price_id, amount_cents, currency, interval, features, is_active')
    .eq('is_active', true)
    .order('amount_cents', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}