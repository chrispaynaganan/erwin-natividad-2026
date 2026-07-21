import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export type Episode = {
  id: string
  show_id: string
  title: string
  slug: string
  description: string | null
  show_notes: string | null
  transcript: string | null
  audio_path: string | null
  duration_secs: number | null
  episode_number: number | null
  season: number | null
  cover_url: string | null
  is_premium: boolean
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
}

export type Show = { id: string; title: string; slug: string }

export async function listEpisodes(): Promise<Episode[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('episodes')
    .select('*')
    .order('season', { ascending: false, nullsFirst: false })
    .order('episode_number', { ascending: false, nullsFirst: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getEpisode(id: string): Promise<Episode | null> {
  const db = createAdminClient()
  const { data, error } = await db.from('episodes').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function listShows(): Promise<Show[]> {
  const db = createAdminClient()
  const { data, error } = await db.from('shows').select('id, title, slug').order('title')
  if (error) throw new Error(error.message)
  return data ?? []
}

// Used by the Show admin form's "Featured episode" picker — same ordering
// as listEpisodes so the dropdown reads newest-first.
export async function listEpisodesForShow(showId: string): Promise<Episode[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('episodes')
    .select('*')
    .eq('show_id', showId)
    .order('season', { ascending: false, nullsFirst: false })
    .order('episode_number', { ascending: false, nullsFirst: false })
  if (error) throw new Error(error.message)
  return data ?? []
}