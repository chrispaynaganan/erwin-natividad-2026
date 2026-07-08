'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export type SaveState = { ok: boolean; message: string; id?: string } | null

export type ShowInput = {
  id?: string
  title: string
  slug: string
  description: string
  cover_url: string
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  sort_order: number
}

export async function saveShow(input: ShowInput): Promise<SaveState> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to edit shows.' }
  }

  if (!input.title.trim()) return { ok: false, message: 'Title is required.' }
  if (!input.slug.trim()) return { ok: false, message: 'Slug is required.' }

  try {
    const db = createAdminClient()
    const row = {
      title: input.title.trim(),
      slug: input.slug.trim(),
      description: input.description || null,
      cover_url: input.cover_url || null,
      status: input.status,
      sort_order: input.sort_order,
    }

    const { data, error } = input.id
      ? await db.from('shows').update(row).eq('id', input.id).select('id').single()
      : await db.from('shows').insert(row).select('id').single()

    if (error) {
      if (error.code === '23505') return { ok: false, message: 'That slug is already used by another show.' }
      return { ok: false, message: 'Could not save: ' + error.message }
    }

    revalidatePath('/admin/shows')
    revalidatePath('/admin/episodes')
    revalidatePath(`/admin/shows/${data.id}`)
    return { ok: true, message: 'Show saved.', id: data.id }
  } catch (e) {
    console.error('[saveShow] unexpected error:', e)
    return { ok: false, message: 'Unexpected error while saving: ' + (e instanceof Error ? e.message : String(e)) }
  }
}

export async function deleteShow(id: string): Promise<SaveState> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to delete shows.' }
  }
  try {
    const db = createAdminClient()
    const { error } = await db.from('shows').delete().eq('id', id)
    if (error) {
      // shows.episodes has ON DELETE CASCADE — this is more likely a
      // permissions issue than an FK conflict, but surface it either way.
      return { ok: false, message: 'Could not delete: ' + error.message }
    }
    revalidatePath('/admin/shows')
    revalidatePath('/admin/episodes')
    return { ok: true, message: 'Show deleted.' }
  } catch (e) {
    return { ok: false, message: 'Unexpected error while deleting: ' + (e instanceof Error ? e.message : String(e)) }
  }
}