const items = [
  { text: 'Erwin\u2019s voice brought our brand campaign to life in ways we never imagined. His professionalism and ability to nail the perfect tone on the first take saved us time and delivered exceptional results.', name: 'Sarah Mitchell', role: 'Marketing Director, TechVision Inc.' },
  { text: 'As a voice coaching student, I can\u2019t recommend Erwin enough. He helped me discover my authentic voice and gave me the confidence to pursue professional work. Three months later, I landed my first commercial gig!', name: 'Michael Chen', role: 'Voice Coaching Student' },
  { text: 'Working with Erwin on our audiobook series was a dream. His range of character voices and emotional depth brought our story to life. Listeners consistently praise the narration quality.', name: 'Jessica Torres', role: 'Author & Publisher' },
]

// Shared "What People Say" testimonials (home + about).
export function Testimonials() {
  return (
    <section className="container" style={{ padding: '64px 0' }}>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>What People <span className="gold">Say</span></h2>
      <p style={{ color: 'var(--text-muted)', marginTop: 10, maxWidth: '60ch' }}>
        Don&rsquo;t just take my word for it &mdash; hear from clients and students who&rsquo;ve experienced the difference.
      </p>
      <div className="tGrid">
        {items.map((t) => (
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