import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export type Show = {
  id: string
  title: string
  slug: string
  description: string | null
  cover_url: string | null
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  sort_order: number
  created_at: string
  updated_at: string
}

// Same rationale as lib/episodes/store.ts: service-role reads, gated by the
// /admin layout + explicit requireRole() in the mutating actions, rather
// than depending on unverified `authenticated` grants on `shows`.
export async function listShowsFull(): Promise<Show[]> {
  const db = createAdminClient()
  const { data, error } = await db.from('shows').select('*').order('sort_order').order('title')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getShow(id: string): Promise<Show | null> {
  const db = createAdminClient()
  const { data, error } = await db.from('shows').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data
}