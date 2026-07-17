'use client'
import { usePathname } from 'next/navigation'
import { SiteHeader, type HeaderBranding } from './site-header'
import { SiteFooter } from './site-footer'
import { PodcastPlayerProvider } from './podcast-player-provider'
import { PodcastMiniPlayer } from './podcast-mini-player'

const BARE_PREFIXES = [
  '/admin',
  '/account',
  '/members',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/auth',
]

export function SiteChrome({ branding, children }: { branding: HeaderBranding; children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (bare) return <>{children}</>

  // PodcastPlayerProvider wraps the whole public tree so the <audio> element
  // and playback state survive navigating between /podcasts pages (and even
  // away from /podcasts entirely — mirrors Apple Podcasts' "keep playing
  // while you browse elsewhere" behavior).
  return (
    <PodcastPlayerProvider>
      <SiteHeader branding={branding} />
      {children}
      <SiteFooter />
      <PodcastMiniPlayer />
    </PodcastPlayerProvider>
  )
}