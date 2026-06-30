import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { AudioPlayer } from '@/components/audio-player'
import { getSiteContent } from '@/lib/content/store'
import s from './home.module.css'

// Read fresh content each request so admin edits appear immediately.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const { home } = await getSiteContent()
  const { hero, logos, whatIDo, featuredWork, meet, testimonials, cta } = home

  return (
    <main>
      {/* HERO */}
      <section className={`${s.hero} container`}>
        <div className={s.heroGrid}>
          <div>
            <h1 className={s.heroName}>{hero.name1}<span className={s.heroNameGold}>{hero.name2}</span></h1>
            <div className={s.tags}>
              {hero.tags.map((t) => <span key={t} className="pill">{t}</span>)}
            </div>
            <p className={s.heroEyebrow}>{hero.eyebrow}</p>
            <p className={s.heroBody}>{hero.body}</p>
            <p className={s.featuredLabel}>{hero.featuredLabel}</p>
            <p className={s.featuredTitle}>{hero.featuredTitle}</p>
            <AudioPlayer />
            <div className={s.heroCtas}>
              <Link href={hero.ctaPrimary.href} className="btn btnSolid">{hero.ctaPrimary.label}</Link>
              <Link href={hero.ctaSecondary.href} className="btn btnOutline">{hero.ctaSecondary.label}</Link>
            </div>
          </div>
          <div className={s.heroPhoto}>Erwin&rsquo;s portrait</div>
        </div>
      </section>

      {/* LOGOS */}
      <section className={`${s.logos} container`}>
        <p className={s.logosLabel}>{logos.label}</p>
        <div className={s.logosRow}>
          {logos.items.map((logo, i) => (
            <div key={i} className={s.logoChip} aria-label={logo.name}>
              {logo.imageUrl ? <img src={logo.imageUrl} alt={logo.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : null}
            </div>
          ))}
        </div>
      </section>

      {/* WHAT I DO */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>{whatIDo.title} <span className="gold">{whatIDo.titleGold}</span></h2>
          <p className={s.headSub}>{whatIDo.sub}</p>
        </Reveal>
        <div className={s.cards3}>
          {whatIDo.items.map((sv, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className={s.serviceCard}>
                <div className={s.serviceImg} />
                <div className={s.serviceBody}>
                  <h3>{sv.title}</h3>
                  <p>{sv.body}</p>
                  <div className={s.serviceBtns}>
                    {sv.primary.label && <Link href={sv.primary.href} className="btn btnSolid">{sv.primary.label}</Link>}
                    {sv.secondary.label && <Link href={sv.secondary.href} className="btn btnOutline">{sv.secondary.label}</Link>}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className={`${s.section} container`}>
        <Reveal>
          <div className={s.workHead}>
            <div>
              <h2 className={s.headTitle}>{featuredWork.title} <span className="gold">{featuredWork.titleGold}</span></h2>
              <p className={s.headSub}>{featuredWork.sub}</p>
            </div>
            {featuredWork.viewAll.label && <Link href={featuredWork.viewAll.href} className="btn btnOutline">{featuredWork.viewAll.label}</Link>}
          </div>
        </Reveal>
        <div className={s.workGrid}>
          {featuredWork.items.map((w, i) => (
            <Reveal key={i} delay={(i % 3) * 80}>
              <div className={s.workCard}>
                <div className={s.workTags}>{w.tags.map((t) => <span key={t} className="pill">{t}</span>)}</div>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
                <span className={s.workDate}>{w.date}</span>
                <AudioPlayer />
                <Link href={featuredWork.viewAll.href} className="btn btnSolid" style={{ width: '100%' }}>View Project</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MEET ERWIN */}
      <section className={`${s.section} container`}>
        <div className={s.meetGrid}>
          <Reveal><div className={s.meetPhoto} /></Reveal>
          <Reveal delay={80}>
            <div>
              <h2 className={s.headTitle}>{meet.title} <span className="gold">{meet.titleGold}</span></h2>
              <p className={s.meetQuote}>&ldquo;{meet.quote}&rdquo;</p>
              <div className={s.meetBody}>
                {meet.body.map((para, i) => <p key={i}>{para}</p>)}
              </div>
              {meet.cta.label && <Link href={meet.cta.href} className="btn btnOutline">{meet.cta.label}</Link>}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>{testimonials.title} <span className="gold">{testimonials.titleGold}</span></h2>
          <p className={s.headSub}>{testimonials.sub}</p>
        </Reveal>
        <div className={s.cards3}>
          {testimonials.items.map((t, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className={s.tCard}>
                <div className={s.quoteMark}>&ldquo;</div>
                <p className={s.tText}>{t.text}</p>
                <p className={s.tName}>{t.name}</p>
                <p className={s.tRole}>{t.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>{cta.title} <span className="gold">{cta.titleGold}</span></h2>
          <p className={s.headSub}>{cta.sub}</p>
          <form className={s.ctaForm}>
            <input className={s.ctaInput} type="email" placeholder={cta.emailPlaceholder} aria-label={cta.emailPlaceholder} />
            <Link href={cta.button.href} className="btn btnSolid">{cta.button.label}</Link>
          </form>
        </Reveal>
      </section>
    </main>
  )
}