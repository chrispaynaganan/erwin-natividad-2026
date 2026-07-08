import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Cookie-free client for public, anonymous-safe reads (RLS already
// restricts these to published content). Safe to call from ANYWHERE,
// including generateStaticParams and other build-time contexts that run
// outside any HTTP request — unlike lib/supabase/server.ts's createClient(),
// which depends on cookies() and throws outside a request scope.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}