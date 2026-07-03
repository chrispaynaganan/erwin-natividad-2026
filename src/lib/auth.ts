import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AppRole = 'member' | 'viewer' | 'editor' | 'admin' | 'owner'

const RANK: Record<AppRole, number> = {
  member: 0, viewer: 1, editor: 2, admin: 3, owner: 4,
}

export type SessionProfile = {
  user: { id: string; email?: string }
  profile: { id: string; role: AppRole; full_name: string | null; avatar_url: string | null }
}

// Returns the signed-in user + their profile, or null.
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  console.log('[auth] getUser →', user ? `user ${user.email}` : 'NO USER', userError ? `error: ${userError.message}` : '')
  if (!user) return null

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role, full_name, avatar_url')
    .eq('id', user.id)
    .single()
  console.log('[auth] profile →', profile ?? 'NULL', profileError ? `error: ${profileError.message} (code ${profileError.code})` : '')

  if (!profile) return null
  return { user: { id: user.id, email: user.email }, profile: profile as SessionProfile['profile'] }
}

// Gate a Server Component / route on a minimum role. Redirects if unmet.
export async function requireRole(min: AppRole): Promise<SessionProfile> {
  const session = await getSessionProfile()
  if (!session) redirect('/login')
  if (RANK[session.profile.role] < RANK[min]) redirect('/')
  return session
}

export function hasMinRole(role: AppRole, min: AppRole): boolean {
  return RANK[role] >= RANK[min]
}