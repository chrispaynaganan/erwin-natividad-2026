import type { Metadata } from 'next'
import './globals.css'
import { SiteChrome } from '@/components/site-chrome'
import { ToastProvider } from '@/components/toast-provider'
import { ConfirmDialogProvider } from '@/components/confirm-dialog'
import { getSiteContent } from '@/lib/content/store'
import type { ThemeMode } from '@/lib/content/site-content'

export const metadata: Metadata = {
  title: { default: 'Erwin Natividad — Voiceover Artist & Voice Coach', template: '%s · Erwin Natividad' },
  description: 'Voiceover artist and voice coach helping scripts come alive.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Erwin Natividad — Voiceover Artist & Voice Coach',
    description: 'Voiceover artist and voice coach helping scripts come alive.',
    type: 'website',
    siteName: 'Erwin Natividad',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Erwin Natividad — Voiceover Artist & Voice Coach',
    description: 'Voiceover artist and voice coach helping scripts come alive.',
  },
}

function buildThemeInit(mode: ThemeMode) {
  if (mode === 'light' || mode === 'dark') {
    // Forced mode — skip localStorage and system-preference checks entirely.
    return `document.documentElement.dataset.theme=${JSON.stringify(mode)};`
  }
  return `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { nav, themeMode } = await getSiteContent()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: buildThemeInit(themeMode) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Stack+Sans+Headline:wght@200..700&display=swap"
        />
      </head>
      <body>
        {/* ToastProvider / ConfirmDialogProvider wrap the actual page content
            (not SiteChrome itself) so every page — public and admin alike —
            can call useToast()/useConfirm() from anywhere in its component
            tree. Both render fixed-position overlays, so nesting here vs.
            outside <SiteChrome> has no visual effect either way; this way
            keeps them scoped to "the page", which is conceptually cleaner. */}
        <SiteChrome branding={nav} themeMode={themeMode}>
          <ToastProvider>
            <ConfirmDialogProvider>
              {children}
            </ConfirmDialogProvider>
          </ToastProvider>
        </SiteChrome>
      </body>
    </html>
  )
}