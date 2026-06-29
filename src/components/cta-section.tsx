import Link from 'next/link'

// Shared "Ready to Find Your Voice?" call-to-action (home + services).
export function CtaSection() {
  return (
    <section className="container" style={{ padding: '72px 0' }}>
      <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.5rem)' }}>
        Ready to Find <span className="gold">Your Voice?</span>
      </h2>
      <p style={{ color: 'var(--text-muted)', marginTop: 10 }}>
        Let&rsquo;s work together to bring your project to life or unlock your full vocal potential.
      </p>
      <form style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24, maxWidth: 520 }}>
        <input type="email" placeholder="Email Address" aria-label="Email Address"
          style={{ flex: 1, minWidth: 220, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', font: 'inherit' }} />
        <Link href="/contact" className="btn btnSolid">Get in Touch</Link>
      </form>
    </section>
  )
}