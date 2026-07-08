'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export type SaveState = { ok: boolean; message: string; id?: string } | null

export type EpisodeInput = {
  id?: string
  show_id: string
  title: string
  slug: string
  description: string
  show_notes: string
  transcript: string
  audio_path: string | null
  duration_secs: number | null
  episode_number: number | null
  season: number | null
  cover_url: string
  is_premium: boolean
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  published_at: string | null
}

export async function saveEpisode(input: EpisodeInput): Promise<SaveState> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to edit episodes.' }
  }

  if (!input.title.trim()) return { ok: false, message: 'Title is required.' }
  if (!input.slug.trim()) return { ok: false, message: 'Slug is required.' }
  if (!input.show_id) return { ok: false, message: 'Choose a show first.' }

  try {
    const db = createAdminClient()
    const row = {
      show_id: input.show_id,
      title: input.title.trim(),
      slug: input.slug.trim(),
      description: input.description || null,
      show_notes: input.show_notes || null,
      transcript: input.transcript || null,
      audio_path: input.audio_path,
      duration_secs: input.duration_secs,
      episode_number: input.episode_number,
      season: input.season,
      cover_url: input.cover_url || null,
      is_premium: input.is_premium,
      status: input.status,
      published_at: input.status === 'published' ? (input.published_at ?? new Date().toISOString()) : input.published_at,
    }

    const { data, error } = input.id
      ? await db.from('episodes').update(row).eq('id', input.id).select('id').single()
      : await db.from('episodes').insert(row).select('id').single()

    if (error) {
      // Unique violation on (show_id, slug) is the most likely real-world case.
      if (error.code === '23505') return { ok: false, message: 'That slug is already used by another episode in this show.' }
      return { ok: false, message: 'Could not save: ' + error.message }
    }

    revalidatePath('/admin/episodes')
    revalidatePath(`/admin/episodes/${data.id}`)
    return { ok: true, message: 'Episode saved.', id: data.id }
  } catch (e) {
    console.error('[saveEpisode] unexpected error:', e)
    return { ok: false, message: 'Unexpected error while saving: ' + (e instanceof Error ? e.message : String(e)) }
  }
}

export async function deleteEpisode(id: string): Promise<SaveState> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to delete episodes.' }
  }
  const db = createAdminClient()
  const { error } = await db.from('episodes').delete().eq('id', id)
  if (error) return { ok: false, message: 'Could not delete: ' + error.message }
  revalidatePath('/admin/episodes')
  return { ok: true, message: 'Episode deleted.' }
}