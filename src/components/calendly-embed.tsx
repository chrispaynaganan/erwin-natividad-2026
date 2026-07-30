'use client'

import { useEffect, useRef } from 'react'
import styles from './calendly-embed.module.css'

type CalendlyEmbedProps = {
  /** Full Calendly event-type URL, e.g. https://calendly.com/erwin/discovery-call.
   *  Defaults to NEXT_PUBLIC_CALENDLY_URL if not passed explicitly. */
  url?: string
}

const CALENDLY_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js'

// Matches the widget's own chrome to the site's brand accent. Calendly reads
// these as plain query params on the event URL — no separate config needed.
// NOTE: these are the *light-mode* brand values from globals.css. The widget
// doesn't re-theme itself live if the visitor later flips dark mode; that's a
// reasonable trade-off for now rather than reloading the widget on toggle.
function withBrandColors(url: string) {
  try {
    const u = new URL(url)
    u.searchParams.set('background_color', 'fcfcfb')
    u.searchParams.set('text_color', '161513')
    u.searchParams.set('primary_color', 'b48f19')
    u.searchParams.set('hide_gdpr_banner', '1')
    return u.toString()
  } catch {
    return url
  }
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void
    }
  }
}

export default function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const eventUrl = url ?? process.env.NEXT_PUBLIC_CALENDLY_URL

  useEffect(() => {
    if (!eventUrl || !containerRef.current) return

    function initWidget() {
      if (window.Calendly && containerRef.current) {
        containerRef.current.innerHTML = ''
        window.Calendly.initInlineWidget({
          url: withBrandColors(eventUrl!),
          parentElement: containerRef.current,
        })
      }
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_SCRIPT_SRC}"]`)
    if (existing) {
      // Script tag is already on the page (e.g. client-side navigation back
      // to this route) — it may already be loaded, or still loading.
      if (window.Calendly) initWidget()
      else existing.addEventListener('load', initWidget)
    } else {
      const script = document.createElement('script')
      script.src = CALENDLY_SCRIPT_SRC
      script.async = true
      script.addEventListener('load', initWidget)
      document.body.appendChild(script)
    }
  }, [eventUrl])

  if (!eventUrl) {
    return (
      <p className={styles.missing}>
        Calendly isn&rsquo;t configured yet — set <code>NEXT_PUBLIC_CALENDLY_URL</code> to your
        Discovery Call event link (e.g. https://calendly.com/your-handle/discovery-call).
      </p>
    )
  }

  return <div ref={containerRef} className={styles.frame} />
}