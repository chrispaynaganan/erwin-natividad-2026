import {
  IconMail, IconPhone, IconMapPin,
  IconBrandFacebook, IconBrandInstagram, IconBrandTiktok, IconBrandYoutube, IconBrandLinkedin,
} from '@tabler/icons-react'
import { Reveal } from '@/components/reveal'
import { ContactForm } from '@/components/contact-form'
import { FaqGrid } from '@/components/faq'
import { getSiteContent } from '@/lib/content/store'
import { SITE_URL } from '@/lib/site-url'
import s from './contact.module.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { contact } = await getSiteContent()
  const seo = contact.seo
  const fallbackTitle = `${contact.hero.title} ${contact.hero.titleGold}`
  const title = seo.metaTitle || fallbackTitle
  const description = seo.metaDescription || contact.hero.body
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/contact`,
      ...(seo.ogImageUrl ? { images: [{ url: seo.ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
  }
}

// Social URLs stay placeholders until Erwin provides real profiles
// (same as the footer) — they'll move into editable content with the
// footer/socials pass.
const socials = [
  { label: 'Facebook', Icon: IconBrandFacebook },
  { label: 'Instagram', Icon: IconBrandInstagram },
  { label: 'TikTok', Icon: IconBrandTiktok },
  { label: 'YouTube', Icon: IconBrandYoutube },
  { label: 'LinkedIn', Icon: IconBrandLinkedin },
]

export default async function ContactPage() {
  const { contact } = await getSiteContent()

  const direct = [
    { Icon: IconMail, label: 'Email', value: contact.direct.email },
    { Icon: IconPhone, label: 'Phone', value: contact.direct.phone },
    { Icon: IconMapPin, label: 'Location', value: contact.direct.location },
  ]

  return (
    <main>
      {/* HERO */}
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>{contact.hero.title} <span className={s.heroTitleGold}>{contact.hero.titleGold}</span></h1>
        <p className={s.heroBody}>{contact.hero.body}</p>
      </section>

      {/* FORM + SIDEBAR */}
      <section className="container">
        <div className={s.layout}>
          <Reveal><ContactForm /></Reveal>

          <div className={s.side}>
            <Reveal delay={80}>
              <div className={s.expectCard}>
                <div className={s.expectTitle}>{contact.expect.title}</div>
                {contact.expect.items.map((e, i) => (
                  <div key={i} className={s.expectItem}>
                    <span className={s.expectNum}>{i + 1}</span>
                    <p className={s.expectText}><strong>{e.t}</strong> <span>{e.d}</span></p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className={s.directCard}>
                <div className={s.directTitle}>{contact.direct.title}</div>
                {direct.map(({ Icon, label, value }) => (
                  <div key={label} className={s.directRow}>
                    <span className={s.directIcon}><Icon size={20} stroke={1.75} /></span>
                    <div>
                      <div className={s.directLabel}>{label}</div>
                      <div className={s.directValue}>{value}</div>
                    </div>
                  </div>
                ))}
                <p className={s.socialLabel}>{contact.direct.socialLabel}</p>
                <div className={s.socials}>
                  {socials.map(({ label, Icon }) => (
                    <a key={label} href="#" aria-label={label} className={s.social}><Icon size={19} stroke={1.75} /></a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* QUICK ANSWERS */}
      <section className={`${s.faqSection} container`}>
        <Reveal>
          <h2 className={s.faqHead}>{contact.faqs.title} <span className="gold">{contact.faqs.titleGold}</span></h2>
          <p className={s.faqSub}>{contact.faqs.sub}</p>
        </Reveal>
        <FaqGrid items={contact.faqs.items} />
      </section>
    </main>
  )
}