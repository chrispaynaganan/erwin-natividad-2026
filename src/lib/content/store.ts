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

function randomId() {
  return Math.random().toString(36).slice(2, 10)
}

// NOTE (pricing-auto-compute): deepMerge's array handling takes the SAVED
// array wholesale when present, with no awareness of shape changes. Any
// site_content row saved before this change has services.pricing.items[].list
// as string[] and separate from/price strings — the new model expects
// list: {id,label,price}[] plus discountPercent/pricePrefix. Without this
// step, an old saved row would load with string list items, and the new
// pricing UI/page would break trying to read .label/.price off a string.
// This runs on every read and safely upgrades whatever shape it finds:
// existing plain-string inclusions become { label: <string>, price: 0 } —
// the 0 is a deliberate, visible flag that someone needs to fill in a real
// price for that item in admin. Already-correct rows pass through untouched.
function normalizePricing(content: SiteContent): SiteContent {
  const items = content.services?.pricing?.items
  if (!Array.isArray(items)) return content

  // Builds a NEW object rather than mutating `content` in place — important
  // because on the no-Supabase fallback path, `content` IS the module-level
  // `defaultSiteContent` singleton, and mutating it directly would leak
  // across every future request/reload rather than staying request-scoped.
  const newItems = items.map((tier: any) => {
    const list = Array.isArray(tier.list)
      ? tier.list.map((item: any) =>
          typeof item === 'string'
            ? { id: randomId(), label: item, price: 0 }
            : { id: item.id ?? randomId(), label: item.label ?? '', price: typeof item.price === 'number' ? item.price : 0 }
        )
      : []

    return {
      ...tier,
      list,
      discountPercent: typeof tier.discountPercent === 'number' ? tier.discountPercent : 0,
      pricePrefix: typeof tier.pricePrefix === 'string' ? tier.pricePrefix : (typeof tier.from === 'string' ? tier.from : 'From'),
    }
  })

  return {
    ...content,
    services: {
      ...content.services,
      pricing: {
        ...content.services.pricing,
        items: newItems,
      },
    },
  }
}

// Reads the live site content. Uses the service-role client (server-only) so
// it never trips RLS, and falls back to the bundled defaults whenever Supabase
// isn't connected yet or the row doesn't exist.
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  try {
    const db = createAdminClient()
    const { data } = await db.from('settings').select('value').eq('key', SITE_CONTENT_KEY).maybeSingle()
    if (data?.value) return normalizePricing(deepMerge(defaultSiteContent, data.value))
  } catch {
    // Supabase not configured / unreachable — use defaults.
  }
  return normalizePricing(defaultSiteContent)
})