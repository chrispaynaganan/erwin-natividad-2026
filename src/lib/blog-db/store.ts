import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export type BlogPostRow = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  cover_url: string | null
  author_id: string | null
  category_id: string | null
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  updated_at: string
  meta_title: string | null
  meta_description: string | null
}

// Admin-side reads: service-role, same rationale as episodes/shows/projects —
// gated by the /admin layout + explicit requireRole() in the mutating actions.
export async function listBlogPosts(): Promise<BlogPostRow[]> {
  const db = createAdminClient()
  const { data, error } = await db.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getBlogPostById(id: string): Promise<BlogPostRow | null> {
  const db = createAdminClient()
  const { data, error } = await db.from('blog_posts').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data
}