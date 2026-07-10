import Link from 'next/link'
import { IconCheck } from '@tabler/icons-react'
import { Reveal } from '@/components/reveal'
import { CtaSection } from '@/components/cta-section'
import { FaqGrid } from '@/components/faq'
import { getSiteContent } from '@/lib/content/store'
import s from './services.module.css'

export const metadata = { title: 'Services' }
export const dynamic = 'force-dynamic'

function formatMoney(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

export default async function ServicesPage() {
  const { services } = await getSiteContent()
  const { hero, breakdown, pricing, how, faqs } = services

  return (
    <main>
      {/* HERO */}
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>{hero.title}<span className={s.heroTitleGold}>{hero.titleGold}</span></h1>
        <p className={s.heroBody}>{hero.body}</p>
      </section>

      {/* SERVICES BREAKDOWN */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>{breakdown.title} <span className="gold">{breakdown.titleGold}</span></h2>
          <p className={s.headSub}>{breakdown.sub}</p>
        </Reveal>
        <div className={s.breakdown}>
          {breakdown.items.map((c, i) => (
            <Reveal key={c.title || i} delay={(i % 2) * 80}>
              <article className={s.svcCard}>
                <h3 className={s.svcTitle}>{c.title}</h3>
                <div className={s.svcTags}>{c.tags.map((t) => <span key={t} className="pill">{t}</span>)}</div>
                <p className={s.svcDesc}>{c.desc}</p>
                <div className={s.svcMeta}>
                  <div><div className={s.metaLabel}>Who It&rsquo;s For</div><div className={s.metaText}>{c.who}</div></div>
                  <div><div className={s.metaLabel}>Turnaround Time</div><div className={s.metaText}>{c.turnaround}</div></div>
                </div>
                <div className={s.includes}>
                  <div className={s.metaLabel}>What&rsquo;s Included</div>
                  <div className={s.checkGrid}>
                    {c.includes.map((item) => (
                      <div key={item} className={s.check}><span className={s.checkMark}><IconCheck size={16} stroke={2} /></span><span>{item}</span></div>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRICING — total is computed from each inclusion's price + the package's
          discount %, never manually typed. Inclusion prices are admin-only and
          never rendered here — only the label + checkmark show publicly. */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>{pricing.title} <span className="gold">{pricing.titleGold}</span></h2>
          <p className={s.headSub}>{pricing.sub}</p>
        </Reveal>
        <div className={s.pricing}>
          {pricing.items.map((p, i) => {
            const subtotal = p.list.reduce((sum, item) => sum + (item.price || 0), 0)
            const hasDiscount = !p.useCustomPrice && p.discountPercent > 0
            const total = hasDiscount ? subtotal * (1 - p.discountPercent / 100) : subtotal

            return (
              <Reveal key={p.name || i} delay={i * 80}>
                <div className={`${s.priceCard} ${p.featured ? s.priceCardFeatured : ''}`}>
                  <span className={`${s.badge} ${p.featured ? s.badgeFeatured : ''}`}>{p.badge}</span>
                  <div className={s.priceName}>{p.name}</div>
                  <div className={s.priceFrom}>
                    {p.useCustomPrice
                      ? p.pricePrefix
                      : hasDiscount
                        ? `${p.pricePrefix} $${formatMoney(subtotal)} (Save ${p.discountPercent}%)`
                        : p.pricePrefix}
                  </div>
                  <div className={s.priceBig}>{p.useCustomPrice ? p.customPriceLabel : `$${formatMoney(total)}`}</div>
                  <p className={s.priceDesc}>{p.desc}</p>
                  <div className={s.priceIncludesLabel}>{p.listLabel}</div>
                  <ul className={s.priceList}>
                    {p.list.map((item) => (
                      <li key={item.id}>
                        <span className="gold" style={{ display: 'inline-flex' }}><IconCheck size={15} stroke={2} /></span>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className={`btn ${p.featured ? 'btnSolid' : 'btnOutline'}`} style={{ width: '100%', marginTop: 'auto' }}>{p.cta}</Link>
                </div>
              </Reveal>
            )
          })}
        </div>
        <p className={s.priceFootnote}>{pricing.footnote}</p>
      </section>

      {/* HOW IT WORKS */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>{how.title} <span className="gold">{how.titleGold}</span></h2>
          <p className={s.headSub}>{how.sub}</p>
        </Reveal>
        <div className={s.timeline}>
          {how.steps.map((step, i) => (
            <Reveal key={step.title || i} delay={i * 60}>
              <div className={s.tlItem}>
                <div className={s.tlNum}>{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className={s.tlTitle}>{step.title}</div>
                  <p className={s.tlText}>{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* QUICK ANSWERS */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>{faqs.title} <span className="gold">{faqs.titleGold}</span></h2>
          <p className={s.headSub}>{faqs.sub}</p>
        </Reveal>
        <FaqGrid items={faqs.items} />
      </section>

      <CtaSection />
    </main>
  )
}