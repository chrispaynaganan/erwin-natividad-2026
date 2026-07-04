import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { Journey } from '@/components/journey'
import { Testimonials } from '@/components/testimonials'
import { getSiteContent } from '@/lib/content/store'
import s from './about.module.css'

export const metadata = { title: 'About' }
export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const { about } = await getSiteContent()

  return (
    <main>
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>{about.heroTitle} <span className={s.heroTitleGold}>{about.heroTitleGold}</span></h1>
      </section>

      {/* My Journey */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.blockTitle}>{about.journeyTitle}</h2>
          <div style={{ marginTop: 16 }}><Journey paragraphs={about.journey} /></div>
        </Reveal>
      </section>

      {/* Skills & Expertise */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>{about.skills.title} <span className="gold">{about.skills.titleGold}</span></h2>
          <p className={s.headSub}>{about.skills.sub}</p>
        </Reveal>
        <div className={s.skillsGrid}>
          {about.skills.groups.map((c, i) => (
            <Reveal key={c.title || i} delay={i * 80}>
              <div className={s.skillCard}>
                <div className={s.skillTitle}>{c.title}</div>
                <div className={s.skillTags}>{c.tags.map((t) => <span key={t} className={s.skillTag}>{t}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experiences & Milestones */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>{about.stats.title} <span className="gold">{about.stats.titleGold}</span></h2>
          <p className={s.headSub}>{about.stats.sub}</p>
        </Reveal>
        <div className={s.stats}>
          {about.stats.items.map((st) => (
            <div key={st.label}>
              <div className={s.statNum}>{st.num}</div>
              <div className={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Career Highlights */}
      <section className={`${s.section} container`}>
        <Reveal><h2 className={s.blockTitle}>{about.highlightsTitle}</h2></Reveal>
        <div className={s.highlights}>
          {about.highlights.map((h, i) => (
            <Reveal key={`${h.year}-${i}`}>
              <div className={s.hlItem}>
                <div className={s.hlYear}>{h.year}</div>
                <div>
                  <div className={s.hlTitle}>{h.title}</div>
                  <p className={s.hlText}>{h.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* My Philosophy */}
      <section className={`${s.section} container`}>
        <div className={s.philo}>
          <Reveal><div className={s.philoLabel}>{about.philosophyLabel}</div></Reveal>
          <Reveal delay={80}>
            <div className={s.philoText}>
              {about.philosophy.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA */}
      <section className={`${s.finalCta} container`}>
        <Reveal>
          <h2 className={s.finalCtaTitle}>{about.finalCta.title}</h2>
          <p className={s.finalCtaText}>{about.finalCta.body}</p>
          <div className={s.finalCtaBtns}>
            {about.finalCta.primary.label && <Link href={about.finalCta.primary.href} className="btn btnSolid">{about.finalCta.primary.label}</Link>}
            {about.finalCta.secondary.label && <Link href={about.finalCta.secondary.href} className="btn btnOutline">{about.finalCta.secondary.label}</Link>}
          </div>
        </Reveal>
      </section>
    </main>
  )
}