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
  featured_episode_id: string | null
  created_at: string
  updated_at: string
}

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