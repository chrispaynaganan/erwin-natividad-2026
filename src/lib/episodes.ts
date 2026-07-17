import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export type PublicEpisode = {
  id: string
  showId: string
  title: string
  slug: string
  description: string | null
  durationSecs: number | null
  episodeNumber: number | null
  season: number | null
  coverUrl: string | null
  isPremium: boolean
  publishedAt: string | null
}

const COLUMNS = 'id, show_id, title, slug, description, duration_secs, episode_number, season, cover_url, is_premium, published_at'

function toEpisode(row: any): PublicEpisode {
  return {
    id: row.id, showId: row.show_id, title: row.title, slug: row.slug,
    description: row.description, durationSecs: row.duration_secs,
    episodeNumber: row.episode_number, season: row.season, coverUrl: row.cover_url,
    isPremium: row.is_premium, publishedAt: row.published_at,
  }
}

// DELIBERATE EXCEPTION — uses the service-role client, not the public one.
// Per doc 02 §4, the `episodes` RLS policy hides premium rows ENTIRELY from
// non-members (published AND (non-premium OR active member)). That's the
// right call for raw audio, but it means an anonymous visitor's anon-client
// query would silently return zero rows for premium episodes — no locked
// teaser, no "Members Only" card, just nothing. That's not the Apple
// Podcasts-style browsing experience being asked for here.
//
// So: this file explicitly bypasses that row-hiding for METADATA ONLY
// (title/description/duration — nothing sensitive), while `audio_path` is
// never selected or returned here at all. Actual audio access still goes
// exclusively through /api/audio/[episodeId], which independently re-checks
// membership before minting a signed URL. The premium gate lives in exactly
// one place — this file just controls what's browsable, not what's playable.
export async function getEpisodesForShow(showId: string): Promise<PublicEpisode[]> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('episodes')
    .select(COLUMNS)
    .eq('show_id', showId)
    .eq('status', 'published')
    .order('season', { ascending: false, nullsFirst: false })
    .order('episode_number', { ascending: false, nullsFirst: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toEpisode)
}

export async function getEpisode(id: string): Promise<PublicEpisode | null> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('episodes')
    .select(COLUMNS)
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? toEpisode(data) : null
}