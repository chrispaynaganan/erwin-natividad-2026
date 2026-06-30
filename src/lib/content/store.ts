import 'server-only'
import { cache } from 'react'
import { createAdminClient } from '@/lib/supabase/admin'
import { defaultSiteContent, type SiteContent } from './site-content'

export const SITE_CONTENT_KEY = 'site_content'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

// Deep-merge saved values over the defaults. Objects merge key-by-key (so new
// fields added to the model always have a default); arrays are taken wholesale
// from the saved copy when present. This keeps the site resilient if the saved
// blob is partial or from an older shape.
function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T
  }
  if (isPlainObject(base)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    if (isPlainObject(override)) {
      for (const key of Object.keys(out)) {
        if (key in override) out[key] = deepMerge(out[key], override[key])
      }
    }
    return out as T
  }
  return (override === undefined ? base : override) as T
}

// Reads the live site content. Uses the service-role client (server-only) so
// it never trips RLS, and falls back to the bundled defaults whenever Supabase
// isn't connected yet or the row doesn't exist.
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const db = createAdminClient()
    const { data } = await db.from('settings').select('value').eq('key', SITE_CONTENT_KEY).maybeSingle()
    if (data?.value) return deepMerge(defaultSiteContent, data.value)
  } catch {
    // Supabase not configured / unreachable — use defaults.
  }
  return defaultSiteContent
})