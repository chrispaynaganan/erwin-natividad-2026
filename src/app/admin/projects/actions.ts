// Full replacement for src/app/admin/projects/actions.ts

'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export type SaveState = { ok: boolean; message: string; id?: string } | null

export type ProjectInput = {
  id?: string
  title: string
  slug: string
  tags: string[]
  description: string
  paragraphs: string[]
  date_label: string
  audio_url: string | null
  duration_secs: number | null
  cover_url: string
  client: string
  studio: string
  length_label: string
  age_range: string
  voice_character: string
  genre: string
  deliverables: string
  is_featured: boolean
  is_hero: boolean
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  sort_order: number
}

export async function saveProject(input: ProjectInput): Promise<SaveState> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to edit projects.' }
  }

  if (!input.title.trim()) return { ok: false, message: 'Title is required.' }
  if (!input.slug.trim()) return { ok: false, message: 'Slug is required.' }

  try {
    const db = createAdminClient()
    const row = {
      title: input.title.trim(),
      slug: input.slug.trim(),
      tags: input.tags,
      description: input.description || null,
      paragraphs: input.paragraphs,
      date_label: input.date_label || null,
      audio_url: input.audio_url,
      duration_secs: input.duration_secs,
      cover_url: input.cover_url || null,
      client: input.client || null,
      studio: input.studio || null,
      length_label: input.length_label || null,
      age_range: input.age_range || null,
      voice_character: input.voice_character || null,
      genre: input.genre || null,
      deliverables: input.deliverables || null,
      is_featured: input.is_featured,
      status: input.status,
      sort_order: input.sort_order,
      // is_hero deliberately NOT set here — see below. Setting is_hero: true
      // in this same statement could race against the partial unique index
      // if another project currently holds it; the hero flag is always
      // written in its own follow-up step instead, atomically when turning on.
    }

    const { data, error } = input.id
      ? await db.from('projects').update(row).eq('id', input.id).select('id').single()
      : await db.from('projects').insert(row).select('id').single()

    if (error) {
      if (error.code === '23505') return { ok: false, message: 'That slug is already used by another project.' }
      return { ok: false, message: 'Could not save: ' + error.message }
    }

    // Hero spotlight: at most one project can hold this at a time (enforced by
    // a partial unique index — see 0009_hero_project.sql). Turning it ON goes
    // through set_hero_project(), which atomically clears whichever project
    // held it before and sets this one, all in a single transaction. Turning
    // it OFF is a plain field write — no conflict risk when unsetting.
    if (input.is_hero) {
      const { error: heroError } = await db.rpc('set_hero_project', { target_id: data.id })
      if (heroError) {
        return { ok: false, message: 'Project saved, but could not set as Hero spotlight: ' + heroError.message, id: data.id }
      }
    } else {
      const { error: unsetError } = await db.from('projects').update({ is_hero: false }).eq('id', data.id)
      if (unsetError) {
        return { ok: false, message: 'Project saved, but could not update Hero spotlight: ' + unsetError.message, id: data.id }
      }
    }

    revalidatePath('/admin/projects')
    revalidatePath(`/admin/projects/${data.id}`)
    revalidatePath('/work')
    revalidatePath('/')
    return { ok: true, message: 'Project saved.', id: data.id }
  } catch (e) {
    console.error('[saveProject] unexpected error:', e)
    return { ok: false, message: 'Unexpected error while saving: ' + (e instanceof Error ? e.message : String(e)) }
  }
}

export async function deleteProject(id: string): Promise<SaveState> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to delete projects.' }
  }
  try {
    const db = createAdminClient()
    const { error } = await db.from('projects').delete().eq('id', id)
    if (error) return { ok: false, message: 'Could not delete: ' + error.message }
    revalidatePath('/admin/projects')
    revalidatePath('/work')
    revalidatePath('/')
    return { ok: true, message: 'Project deleted.' }
  } catch (e) {
    return { ok: false, message: 'Unexpected error while deleting: ' + (e instanceof Error ? e.message : String(e)) }
  }
}