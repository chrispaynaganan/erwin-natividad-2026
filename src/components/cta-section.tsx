// src/components/cta-section.tsx
import { getSiteContent } from '@/lib/content/store'
import { CtaForm } from './cta-form'

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
      <CtaForm emailPlaceholder={cta.emailPlaceholder} buttonLabel={cta.button.label} />
    </section>
  )
}