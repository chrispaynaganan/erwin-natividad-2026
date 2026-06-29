import { createClient } from '@supabase/supabase-js'

// SERVICE ROLE client — bypasses RLS. Use ONLY in trusted server contexts
// (e.g. the Stripe webhook). Never import this into client code.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
