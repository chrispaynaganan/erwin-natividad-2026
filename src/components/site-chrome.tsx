'use client'
import { usePathname } from 'next/navigation'
import { SiteHeader, type HeaderBranding } from './site-header'
import { SiteFooter } from './site-footer'
import { PodcastPlayerProvider } from './podcast-player-provider'
import { PodcastMiniPlayer } from './podcast-mini-player'
import type { ThemeMode } from '@/lib/content/site-content'

const BARE_PREFIXES = [
  '/admin', '/account', '/members', '/login', '/forgot-password', '/reset-password', '/auth',
]

export function SiteChrome({
  branding,
  themeMode,
  children,
}: {
  branding: HeaderBranding
  themeMode: ThemeMode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const bare = BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (bare) return <>{children}</>

  return (
    <PodcastPlayerProvider>
      <SiteHeader branding={branding} themeMode={themeMode} />
      {children}
      <SiteFooter />
      <PodcastMiniPlayer />
    </PodcastPlayerProvider>
  )
}