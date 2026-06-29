import { Reveal } from './reveal'

export type LegalSection = { heading: string; paragraphs: string[]; bullets?: string[] }

// Shared layout for Privacy Policy / Terms — clean long-form prose.
export function LegalPage({ title, lastUpdated, intro, sections }: {
  title: string; lastUpdated: string; intro?: string; sections: LegalSection[]
}) {
  return (
    <main className="container" style={{ padding: '56px 0 80px', maxWidth: 820 }}>
      <Reveal>
        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 3.4rem)', letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: '0.9rem' }}>Last updated: {lastUpdated}</p>

        <div style={{ marginTop: 24, padding: '14px 18px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          This is a starter template, not legal advice. Please have it reviewed by a qualified attorney and complete any
          bracketed placeholders before publishing.
        </div>

        {intro && <p style={{ marginTop: 28, color: 'var(--text-muted)', lineHeight: 1.8 }}>{intro}</p>}
      </Reveal>

      {sections.map((s, i) => (
        <Reveal key={s.heading} delay={Math.min(i * 40, 160)}>
          <section style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: 12 }}>{s.heading}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j} style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 12 }}>{p}</p>
            ))}
            {s.bullets && (
              <ul style={{ color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: 22, marginTop: 4 }}>
                {s.bullets.map((b, k) => <li key={k} style={{ marginBottom: 6 }}>{b}</li>)}
              </ul>
            )}
          </section>
        </Reveal>
      ))}
    </main>
  )
}