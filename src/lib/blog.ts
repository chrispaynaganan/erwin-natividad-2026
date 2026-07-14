// Shared blog catalog — used by /blog (listing) and /blog/[slug] (post).
// Rewritten to read live from `blog_posts` instead of the static placeholder
// array, mirroring the /work rewiring in §14: same public function names,
// cookie-free client so generateStaticParams can run at build time.
import { createPublicClient } from '@/lib/supabase/public'

export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readMinutes: number
  category: string
  body: string[]
  coverUrl: string | null
  metaTitle: string | null
  metaDescription: string | null
}

type BlogPostRow = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string | null
  cover_url: string | null
  category_id: string | null
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  published_at: string | null
  created_at: string
  meta_title: string | null
  meta_description: string | null
}

function estimateReadMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function toParagraphs(body: string | null): string[] {
  if (!body) return []
  return body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function resolveCategory(_categoryId: string | null): string {
  return 'Blog'
}

function toPost(row: BlogPostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    date: formatDate(row.published_at ?? row.created_at),
    readMinutes: estimateReadMinutes(row.body ?? ''),
    category: resolveCategory(row.category_id),
    body: toParagraphs(row.body),
    coverUrl: row.cover_url,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  }
}

export async function getPosts(): Promise<Post[]> {
  const db = createPublicClient()
  const { data, error } = await db
    .from('blog_posts')
    .select('id, title, slug, excerpt, body, cover_url, category_id, status, published_at, created_at, meta_title, meta_description')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toPost)
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const db = createPublicClient()
  const { data, error } = await db
    .from('blog_posts')
    .select('id, title, slug, excerpt, body, cover_url, category_id, status, published_at, created_at, meta_title, meta_description')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? toPost(data) : undefined
}