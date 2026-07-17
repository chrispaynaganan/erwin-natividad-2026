import 'server-only'
import { createPublicClient } from '@/lib/supabase/public'

export type PublicShow = {
  id: string
  title: string
  slug: string
  description: string | null
  coverUrl: string | null
}

const COLUMNS = 'id, title, slug, description, cover_url'

function toShow(row: any): PublicShow {
  return { id: row.id, title: row.title, slug: row.slug, description: row.description, coverUrl: row.cover_url }
}

// Cookie-free anon client, same rationale as lib/projects.ts — works at both
// build time and request time, and `shows` RLS already restricts to
// published rows for anon reads, so this is a straightforward public read.
export async function getShows(): Promise<PublicShow[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('shows')
    .select(COLUMNS)
    .eq('status', 'published')
    .order('sort_order')
    .order('title')
  if (error) throw new Error(error.message)
  return (data ?? []).map(toShow)
}

export async function getShow(slug: string): Promise<PublicShow | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('shows')
    .select(COLUMNS)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? toShow(data) : null
}