import { getSiteContent } from '@/lib/content/store'

// Shared "What People Say" section (About page). Reads the same editable
// content as the homepage testimonials — edit under Content → Home → Testimonials.
export async function Testimonials() {
  const { home } = await getSiteContent()
  const t9s = home.testimonials
  return (
    <section className="container" style={{ padding: '64px 0' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>{t9s.title} <span className="gold">{t9s.titleGold}</span></h2>
      <p style={{ color: 'var(--text-muted)', marginTop: 10, maxWidth: '60ch' }}>{t9s.sub}</p>
      <div className="tGrid">
        {t9s.items.map((t) => (
          <figure key={t.name} className="tCard">
            <div className="tMark">&ldquo;</div>
            <blockquote className="tText">{t.text}</blockquote>
            <figcaption>
              <div className="tName">{t.name}</div>
              <div className="tRole">{t.role}</div>
            </figcaption>
          </figure>
        ))}
      </div>
      <style>{`
        .tGrid { display: grid; grid-template-columns: 1fr; gap: 24px; margin-top: 32px; }
        @media (min-width: 820px) { .tGrid { grid-template-columns: repeat(3, 1fr); } }
        .tCard { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 24px; box-shadow: var(--shadow); }
        .tMark { color: var(--accent); font-size: 2.5rem; font-weight: 800; line-height: 1; }
        .tText { color: var(--text); font-size: 0.95rem; line-height: 1.6; margin: 10px 0 18px; }
        .tName { font-weight: 600; }
        .tRole { color: var(--text-muted); font-size: 0.82rem; margin-top: 2px; }
      `}</style>
    </section>
  )
}