// Full replacement for src/app/admin/routes/actions.ts
// Fixed: requireRole comes from '@/lib/auth' (per your actual saveProject), not '@/lib/auth/roles'.

'use server'

import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export type SaveState = { ok: boolean; message: string } | null

export async function savePageRoute(id: string, slug: string): Promise<SaveState> {
  try {
    await requireRole('editor')
  } catch {
    return { ok: false, message: 'You don\u2019t have permission to edit page URLs.' }
  }

  const cleanSlug = slug.toLowerCase().trim().replace(/^\/+|\/+$/g, '')
  if (!cleanSlug) return { ok: false, message: 'URL cannot be empty' }

  try {
    const db = createAdminClient()
    const { error } = await db
      .from('page_routes')
      .update({ slug: cleanSlug, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      if (error.code === '23505') {
        return { ok: false, message: `"${cleanSlug}" is already used by another page.` }
      }
      return { ok: false, message: error.message }
    }

    // Links site-wide may reference this page — revalidate broadly.
    revalidatePath('/', 'layout')
    return { ok: true, message: 'Saved' }
  } catch (e) {
    return { ok: false, message: 'Unexpected error while saving: ' + (e instanceof Error ? e.message : String(e)) }
  }
}