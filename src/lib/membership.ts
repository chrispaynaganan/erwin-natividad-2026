import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

// Shared membership check — reused by the audio playback route AND the
// podcast pages (to decide whether to show a lock icon vs a play button).
// Single decision point, same principle as doc 02 §5: "policy and audio
// delivery can never drift apart."
//
// ASSUMPTION FLAGGED: memberships.status values aren't in any file I've
// seen — assuming Stripe's typical 'active' / 'trialing'. Worth a quick
// check against real data in the Payments/Subscribers admin before relying
// on this in production.
const ACTIVE_STATUSES = ['active', 'trialing']

export async function hasActiveMembership(userId: string): Promise<boolean> {
  const db = createAdminClient()
  const { data, error } = await db
    .from('memberships')
    .select('id')
    .eq('user_id', userId)
    .in('status', ACTIVE_STATUSES)
    .limit(1)
  if (error) throw new Error(error.message)
  return (data?.length ?? 0) > 0
}