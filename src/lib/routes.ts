// Drop this in as src/lib/routes.ts
//
// Anywhere in the app that needs to link to "Work With Me", "Work", etc. should call
// resolveHref('work-with-me') instead of hardcoding the string '/work-with-me'.
// That way, when Erwin renames the slug in admin, every link site-wide updates itself —
// there's only one place the actual path text lives.

import { createPublicClient } from '@/lib/supabase/public' // the cookie-free client from §14

export type PageRoute = { id: string; slug: string; label: string }

let cache: { data: PageRoute[]; ts: number } | null = null
const TTL_MS = 30_000

export async function getRouteMap(): Promise<PageRoute[]> {
  if (cache && Date.now() - cache.ts < TTL_MS) return cache.data

  const supabase = createPublicClient()
  const { data, error } = await supabase.from('page_routes').select('*')

  if (error || !data) return cache?.data ?? []

  cache = { data, ts: Date.now() }
  return data
}

/** Resolve a stable page id (e.g. 'work-with-me') to its CURRENT public href, or null if unknown. */
export async function resolveHref(pageId: string): Promise<string | null> {
  const routes = await getRouteMap()
  const match = routes.find((r) => r.id === pageId)
  return match ? `/${match.slug}` : null
}

/**
 * Drop-in replacement for any existing Content 2.0 href string, e.g. hero.ctaPrimary.href.
 * If the stored value matches a known page id, resolves to whatever slug is CURRENT —
 * so it keeps working even after Erwin renames the page. If it doesn't match anything
 * (external link, anchor, or a page not tracked in page_routes), falls back to the raw
 * value untouched. Zero admin/schema changes needed to start using this.
 */
export async function resolveLink(raw: string): Promise<string> {
  const id = raw.replace(/^\//, '')
  const resolved = await resolveHref(id)
  return resolved ?? raw
}