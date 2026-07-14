import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { FaqGrid } from '@/components/faq'
import { getSiteContent } from '@/lib/content/store'
import { SITE_URL } from '@/lib/site-url'
import s from './faq.module.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { faq } = await getSiteContent()
  const seo = faq.seo
  const fallbackTitle = `${faq.hero.title} ${faq.hero.titleGold}`
  const title = seo.metaTitle || fallbackTitle
  const description = seo.metaDescription || faq.hero.body
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/faq`,
      ...(seo.ogImageUrl ? { images: [{ url: seo.ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  }
}

export default async function FaqPage() {
  const { faq } = await getSiteContent()
  const groups = [faq.general, faq.projects, faq.booking]

  return (
    <main>
      {/* HERO */}
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>{faq.hero.title} <span className={s.heroTitleGold}>{faq.hero.titleGold}</span></h1>
        <p className={s.heroBody}>{faq.hero.body}</p>
      </section>

      {/* QUESTION GROUPS */}
      {groups.map((g, i) => (
        <section key={g.title || i} className={`${s.section} container`}>
          <Reveal>
            <h2 className={s.catHead}>{g.title}</h2>
            <p className={s.catSub}>{g.sub}</p>
          </Reveal>
          <FaqGrid items={g.items} />
        </section>
      ))}

      {/* FINAL CTA */}
      <section className={`${s.finalCta} container`}>
        <Reveal>
          <h2 className={s.ctaTitle}>{faq.finalCta.title} <span className="gold">{faq.finalCta.titleGold}</span></h2>
          <p className={s.ctaBody}>{faq.finalCta.body}</p>
          <Link href={faq.finalCta.button.href} className="btn btnSolid">{faq.finalCta.button.label}</Link>
        </Reveal>
      </section>
    </main>
  )
}