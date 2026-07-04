import Link from 'next/link'
import { getSiteContent } from '@/lib/content/store'

// Shared call-to-action (services + blog pages). Reads the same editable
// content as the homepage CTA — edit it under Content → Home → Call to Action.
export async function CtaSection() {
  const { home } = await getSiteContent()
  const cta = home.cta
  return (
    <section className="container" style={{ padding: '72px 0' }}>
      <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.5rem)' }}>
        {cta.title} <span className="gold">{cta.titleGold}</span>
      </h2>
      <p style={{ color: 'var(--text-muted)', marginTop: 10 }}>{cta.sub}</p>
      <form style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24, maxWidth: 520 }}>
        <input type="email" placeholder={cta.emailPlaceholder} aria-label={cta.emailPlaceholder}
          style={{ flex: 1, minWidth: 220, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', font: 'inherit' }} />
        <Link href={cta.button.href} className="btn btnSolid">{cta.button.label}</Link>
      </form>
    </section>
  )
}