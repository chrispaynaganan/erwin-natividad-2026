'use client'
import { usePathname } from 'next/navigation'
import { SiteHeader, type HeaderBranding } from './site-header'
import { SiteFooter } from './site-footer'

// Routes that should render WITHOUT the public header/footer.
const BARE_PREFIXES = [
  '/admin',
  '/account',
  '/members',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/auth', // /auth/callback
]

// Wraps every page. Public routes get the site header + footer; the routes
// above render bare (the admin panel has its own shell). No files move —
// this replaces the unconditional header/footer in the root layout.
export function SiteChrome({ branding, children }: { branding: HeaderBranding; children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (bare) return <>{children}</>

  return (
    <>
      <SiteHeader branding={branding} />
      {children}
      <SiteFooter />
    </>
  )
}