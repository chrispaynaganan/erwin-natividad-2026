'use server'

import { createClient } from '@/lib/supabase/server'
import { ALL_WIDGET_KEYS, type DashboardLayout } from '@/lib/admin-dashboard-widgets'

export type ActionResult = { ok: boolean; message: string }

// Same pattern as saveProfile() in admin/settings/actions.ts: this is a user
// editing their own row, through the session client, covered by the existing
// "profiles: update own" RLS policy — no service-role client needed.
export async function saveDashboardLayout(layout: DashboardLayout): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, message: 'You must be signed in.' }

  // Defensive validation — this is user-editable client state round-tripping
  // back to the server, so don't trust it blindly even though it's only ever
  // writing to the user's own row.
  if (!Array.isArray(layout.visible) || !Array.isArray(layout.layout)) {
    return { ok: false, message: 'Invalid layout.' }
  }
  const validKeys = new Set(ALL_WIDGET_KEYS as readonly string[])
  const visibleOk = layout.visible.every((k) => validKeys.has(k))
  const layoutOk = layout.layout.every((item) =>
    validKeys.has(item.i) &&
    Number.isFinite(item.x) && Number.isFinite(item.y) &&
    Number.isFinite(item.w) && Number.isFinite(item.h),
  )
  if (!visibleOk || !layoutOk) {
    return { ok: false, message: 'Invalid layout.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ dashboard_layout: layout })
    .eq('id', user.id)

  if (error) return { ok: false, message: 'Could not save layout: ' + error.message }
  return { ok: true, message: 'Layout saved.' }
}