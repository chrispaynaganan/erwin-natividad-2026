// Shared blog catalog — used by /blog (listing) and /blog/[slug] (post).
// Rewritten to read live from `blog_posts` instead of the static placeholder
// array, mirroring the /work rewiring in §14: same public function names,
// cookie-free client so generateStaticParams can run at build time.
import { createPublicClient } from '@/lib/supabase/public'
// ⚠️ Export name/path assumed by symmetry with createAdminClient in
// lib/supabase/admin — not yet confirmed against the actual public.ts.

export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readMinutes: number
  category: string
  body: string[]
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
}

// No read_minutes column exists — estimated from word count (~200 wpm).
function estimateReadMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

// §23 left "is body markdown or HTML?" as an open question. Treating it as
// plain text, paragraphs split on blank lines — keeps the existing one-<p>-
// per-array-item rendering unchanged. Revisit if real posts need links/bold/lists.
function toParagraphs(body: string | null): string[] {
  if (!body) return []
  return body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// category_id isn't joined to a name — no categories table has been shared
// yet and §23 deferred that admin surface. Static label until that exists.
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
  }
}

export async function getPosts(): Promise<Post[]> {
  const db = createPublicClient()
  const { data, error } = await db
    .from('blog_posts')
    .select('id, title, slug, excerpt, body, cover_url, category_id, status, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(toPost)
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const db = createPublicClient()
  const { data, error } = await db
    .from('blog_posts')
    .select('id, title, slug, excerpt, body, cover_url, category_id, status, published_at, created_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? toPost(data) : undefined
}