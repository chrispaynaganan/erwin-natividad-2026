'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export type SaveState = { ok: boolean; message: string; id?: string } | null

export type BlogPostInput = {
  id?: string
  title: string
  slug: string
  excerpt: string
  body: string
  cover_url: string
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  meta_title: string
  meta_description: string
}

export async function saveBlogPost(input: BlogPostInput): Promise<SaveState> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to edit blog posts.' }
  }

  if (!input.title.trim()) return { ok: false, message: 'Title is required.' }
  if (!input.slug.trim()) return { ok: false, message: 'Slug is required.' }

  try {
    const db = createAdminClient()

    let publishedAt: string | null | undefined = undefined
    if (input.status === 'published') {
      if (input.id) {
        const { data: existing } = await db.from('blog_posts').select('published_at').eq('id', input.id).maybeSingle()
        publishedAt = existing?.published_at ?? new Date().toISOString()
      } else {
        publishedAt = new Date().toISOString()
      }
    }

    const row: Record<string, unknown> = {
      title: input.title.trim(),
      slug: input.slug.trim(),
      excerpt: input.excerpt || null,
      body: input.body || null,
      cover_url: input.cover_url || null,
      status: input.status,
      meta_title: input.meta_title || null,
      meta_description: input.meta_description || null,
    }
    if (publishedAt !== undefined) row.published_at = publishedAt

    const { data, error } = input.id
      ? await db.from('blog_posts').update(row).eq('id', input.id).select('id').single()
      : await db.from('blog_posts').insert(row).select('id').single()

    if (error) {
      if (error.code === '23505') return { ok: false, message: 'That slug is already used by another post.' }
      return { ok: false, message: 'Could not save: ' + error.message }
    }

    revalidatePath('/admin/blog')
    revalidatePath(`/admin/blog/${data.id}`)
    revalidatePath('/blog')
    revalidatePath(`/blog/${input.slug}`)
    return { ok: true, message: 'Blog post saved.', id: data.id }
  } catch (e) {
    console.error('[saveBlogPost] unexpected error:', e)
    return { ok: false, message: 'Unexpected error while saving: ' + (e instanceof Error ? e.message : String(e)) }
  }
}

export async function deleteBlogPost(id: string): Promise<SaveState> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to delete blog posts.' }
  }
  try {
    const db = createAdminClient()
    const { error } = await db.from('blog_posts').delete().eq('id', id)
    if (error) return { ok: false, message: 'Could not delete: ' + error.message }
    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    return { ok: true, message: 'Blog post deleted.' }
  } catch (e) {
    return { ok: false, message: 'Unexpected error while deleting: ' + (e instanceof Error ? e.message : String(e)) }
  }
}