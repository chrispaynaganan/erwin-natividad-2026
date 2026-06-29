'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'

const nav = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

// Placeholder "en" monogram — replace with Erwin's real logo SVG in /public.
function Logo() {
  return (
    <Link href="/" aria-label="Erwin Natividad — home"
      style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', color: 'var(--btn-fg)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, letterSpacing: '-0.04em' }}>
      en
    </Link>
  )
}

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72, gap: 16 }}>
        <Logo />

        {/* Desktop nav — segmented pill container */}
        <nav style={{ display: 'none', gap: 4, padding: 4, borderRadius: 999, background: 'var(--surface-2)', border: '1px solid var(--border)' }} className="enNavDesktop">
          {nav.map((i) => (
            <Link key={i.href} href={i.href} style={{ padding: '8px 18px', borderRadius: 999, fontSize: '0.95rem', color: 'var(--text)' }}>
              {i.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle />
          <Link href="/contact" className="btn btnSolid enHideMobile">Work With Me</Link>
          <button aria-label="Menu" onClick={() => setOpen((o) => !o)} className="enMenuBtn"
            style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', cursor: 'pointer', fontSize: 18 }}>
            {'\u2630'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="container" style={{ paddingBottom: 16, display: 'grid', gap: 4 }}>
          {nav.map((i) => (
            <Link key={i.href} href={i.href} onClick={() => setOpen(false)}
              style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--surface-2)', color: 'var(--text)' }}>
              {i.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="btn btnSolid" style={{ marginTop: 4 }}>Work With Me</Link>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .enNavDesktop { display: flex !important; }
          .enMenuBtn { display: none !important; }
        }
        @media (max-width: 899px) { .enHideMobile { display: none !important; } }
      `}</style>
    </header>
  )
}