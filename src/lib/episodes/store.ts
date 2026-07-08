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

// Reads use the service-role client, same as lib/content/store.ts. These
// pages already sit behind the /admin layout's staff gate, so this mirrors
// the existing pattern rather than depending on `authenticated`'s table
// grants on `episodes`/`shows` — which we haven't separately verified, and
// today's whole debugging session was about exactly that kind of gap.
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