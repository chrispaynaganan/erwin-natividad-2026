'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { SITE_CONTENT_KEY } from '@/lib/content/store'
import type { SiteContent } from '@/lib/content/site-content'

export type SaveState = { ok: boolean; message: string } | null

// Every route that reads the content store; all get revalidated on save.
const CONTENT_PATHS = ['/', '/services', '/about', '/contact', '/faq', '/blog', '/work', '/work-with-me']

export async function saveSiteContent(content: SiteContent): Promise<SaveState> {
  // Only editors and above may change site content.
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to edit content.' }
  }

  try {
    const db = createAdminClient()
    const { error } = await db.from('settings').upsert(
      { key: SITE_CONTENT_KEY, value: content, is_public: true, updated_at: new Date().toISOString() },
      { onConflict: 'key' },
    )
    if (error) return { ok: false, message: 'Could not save: ' + error.message }

    // Push the change to every public page that reads this content.
    for (const p of CONTENT_PATHS) revalidatePath(p)
    revalidatePath('/', 'layout')
    return { ok: true, message: 'Saved \u2014 your changes are now live on the site.' }
  } catch {
    return {
      ok: false,
      message: 'Saving needs Supabase connected (and the migration run). Your edits are still here on screen \u2014 connect the database to make them stick.',
    }
  }
}