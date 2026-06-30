'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'

const nav = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

// Theme-aware logo (knocked-out PNGs in /public). Light logo on light bg, dark on dark.
function Logo() {
  return (
    <Link href="/" aria-label="Erwin Natividad — home" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <img src="/logo-light.png" alt="Erwin Natividad" className="themeLogo logoLight" />
      <img src="/logo-dark.png" alt="" aria-hidden="true" className="themeLogo logoDark" />
    </Link>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)

  // Sliding active-nav indicator
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })
  const [animate, setAnimate] = useState(false)

  // Position the indicator under the active item; fade it out when none is active.
  useEffect(() => {
    const place = () => {
      const idx = nav.findIndex((i) => isActive(i.href))
      const el = idx >= 0 ? itemRefs.current[idx] : null
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 })
      else setIndicator((prev) => ({ ...prev, opacity: 0 }))
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Skip the transition on first paint (so it doesn't slide in on load).
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Frosted-glass background once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`enHeader ${scrolled ? 'enScrolled' : ''}`} style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, gap: 16 }}>
        <Logo />

        {/* Desktop nav — borderless segmented container with a sliding indicator */}
        <nav className="enNavDesktop" style={{ display: 'none', position: 'relative', gap: 2, padding: 3, borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)' }}>
          <span aria-hidden className="enNavIndicator" style={{
            left: indicator.left, width: indicator.width, opacity: indicator.opacity,
            transition: animate ? 'left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease' : 'none',
          }} />
          {nav.map((i, idx) => (
            <Link key={i.href} href={i.href} ref={(el) => { itemRefs.current[idx] = el }}
              style={{ position: 'relative', zIndex: 1, padding: '6px 14px', borderRadius: 6, fontSize: '0.875rem',
                transition: 'color 0.3s ease',
                color: isActive(i.href) ? 'var(--nav-active-fg)' : 'var(--text)' }}>
              {i.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle />
          <Link href="/contact" className="btn btnSolid enHideMobile enCta">Work With Me</Link>
          <button aria-label="Menu" onClick={() => setOpen((o) => !o)} className="enMenuBtn"
            style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--surface-2)', color: 'var(--text)', cursor: 'pointer', fontSize: 16 }}>
            {'\u2630'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="container" style={{ paddingBottom: 16, display: 'grid', gap: 4 }}>
          {nav.map((i) => (
            <Link key={i.href} href={i.href} onClick={() => setOpen(false)}
              style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                background: isActive(i.href) ? 'var(--nav-active-bg)' : 'var(--surface-2)',
                color: isActive(i.href) ? 'var(--nav-active-fg)' : 'var(--text)' }}>
              {i.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="btn btnSolid" style={{ marginTop: 4 }}>Work With Me</Link>
        </div>
      )}

      <style>{`
        .enHeader .enCta { padding: 7px 16px; font-size: 0.8rem; }
        .enNavIndicator {
          position: absolute; top: 3px; bottom: 3px;
          border-radius: 6px; background: var(--nav-active-bg); z-index: 0; pointer-events: none;
        }
        .enHeader {
          background: var(--bg);
          transition: background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
        }
        .enHeader.enScrolled {
          background: rgba(252, 252, 251, 0.7);
          backdrop-filter: blur(14px) saturate(180%);
          -webkit-backdrop-filter: blur(14px) saturate(180%);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.06);
        }
        [data-theme="dark"] .enHeader.enScrolled {
          background: rgba(14, 14, 13, 0.7);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
        }
        @media (min-width: 900px) {
          .enNavDesktop { display: flex !important; }
          .enMenuBtn { display: none !important; }
        }
        @media (max-width: 899px) { .enHideMobile { display: none !important; } }
        @media (prefers-reduced-motion: reduce) {
          .enHeader, .enNavIndicator, .enNavDesktop a { transition: none !important; }
        }
      `}</style>
    </header>
  )
}