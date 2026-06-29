import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { CtaSection } from '@/components/cta-section'
import { FaqGrid, type Faq } from '@/components/faq'
import s from './services.module.css'

export const metadata = { title: 'Services' }

const breakdown = [
  {
    title: 'Voice Over Recording',
    tags: ['Commercial', 'Narration', 'eLearning', 'Corporate', 'Explainer Videos', 'Audiobooks'],
    desc: 'Professional voice over services across all formats and industries. From high-energy commercials to authoritative documentaries, I bring your scripts to life with versatility and polish.',
    who: 'Brands, agencies, content creators, and businesses needing professional voice talent',
    turnaround: '24-72 hours (depending on project scope)',
    includes: ['Broadcast-quality audio files (WAV, MP3, or preferred format)', 'Multiple takes and variations as needed', 'Professional editing and mastering', 'Commercial license for usage rights', 'Pickup/revision recording as agreed'],
  },
  {
    title: 'Voice Coaching',
    tags: ['One-on-One Sessions', 'Group Workshops', 'Beginner to Advanced Levels'],
    desc: 'Personalized one-on-one coaching to develop your voice over skills, build confidence, and refine your unique vocal identity. Whether you\u2019re just starting out or looking to level up, I\u2019ll guide you every step of the way.',
    who: 'Aspiring voice artists, content creators, and professionals wanting to improve their vocal delivery',
    turnaround: 'Sessions scheduled weekly or bi-weekly',
    includes: ['Customized lesson plans based on your goals', 'Vocal technique and breath control training', 'Script interpretation and performance coaching', 'Industry insights and career guidance', 'Recording reviews and constructive feedback', 'Home studio setup recommendations'],
  },
  {
    title: 'Demo Reel Production',
    tags: ['Commercial Demo', 'Character Demo', 'Narration Demo', 'Multi-Genre Demo'],
    desc: 'End-to-end demo reel production that showcases your talent in the best light. From script selection to final mix, I\u2019ll help you create a compelling demo that opens doors.',
    who: 'Voice actors building or refreshing their professional demo reel',
    turnaround: '2-3 weeks from start to delivery',
    includes: ['Script curation tailored to your voice and goals', 'Professional recording and direction', 'High-quality editing and mixing', 'Music and SFX integration', 'Multiple format exports (60s, 90s, full-length)', 'Performance notes and coaching throughout'],
  },
  {
    title: 'Script Consultation',
    tags: ['Single Script Review', 'Ongoing Project Support'],
    desc: 'Expert review and feedback on your scripts before recording. I\u2019ll help optimize pacing, tone, delivery notes, and ensure your script is camera-ready for the best possible performance.',
    who: 'Writers, producers, and creators who want to maximize the impact of their voice over scripts',
    turnaround: '48 hours',
    includes: ['Detailed script review and markup', 'Pacing and breath mark suggestions', 'Tone and delivery recommendations', 'Pronunciation guidance for technical terms', 'Estimated recording time analysis', 'Written feedback document'],
  },
]

const pricing = [
  { name: 'Basic Package', badge: 'Most affordable', featured: false, from: 'From $250 (Save 10%)', price: '$150', desc: 'Perfect for short-form content and quick projects (make this longer)', listLabel: 'Basic package includes:', list: ['Up to 150 words', '1 revision round', '48-hour delivery', 'Professional editing & mastering'], cta: 'Book Basic' },
  { name: 'Standard Package', badge: 'Most Popular', featured: true, from: 'From $550 (Save 10%)', price: '$350', desc: 'Most popular \u2013 ideal for most projects', listLabel: 'Everything in basic, plus:', list: ['Up to 500 words', '2 revision rounds', '24-hour delivery', 'Professional editing & mastering'], cta: 'Book Standard' },
  { name: 'Custom', badge: 'Let\u2019s Talk', featured: false, from: 'Starts at', price: '$500', desc: 'For large-scale or ongoing projects', listLabel: 'Basic package includes:', list: ['Up to 150 words', '1 revision round', '48-hour delivery', 'Professional editing & mastering'], cta: 'Inquire' },
]

const steps = [
  { title: 'Reach Out', text: 'Fill out the inquiry form or send me a direct message with your project details, timeline, and any specific requirements.' },
  { title: 'Discovery Call', text: 'We\u2019ll have a brief discussion about your project or coaching goals, creative direction, and expectations to ensure we\u2019re aligned.' },
  { title: 'Agreement & Payment', text: 'You\u2019ll receive a detailed quote and agreement. Once signed and the deposit is received, we\u2019re ready to roll.' },
  { title: 'Production / Session', text: 'Recording begins! For coaching, we\u2019ll start our scheduled sessions. For voice over work, I\u2019ll deliver the performance with precision and professionalism.' },
  { title: 'Delivery & Revisions', text: 'Receive your polished files within the agreed timeframe. Any revisions within scope will be handled promptly and professionally.' },
]

const faqs: Faq[] = [
  { q: 'How soon can you start on a project?', a: 'Most projects begin within 2\u20133 business days of a signed agreement and deposit. Rush turnaround is available on request.' },
  { q: 'Do you require a deposit before starting?', a: 'Yes \u2014 a 50% deposit secures your slot and start date. The balance is due on delivery of the final files.' },
  { q: 'Do you work with international clients?', a: 'Absolutely. I work with clients worldwide and deliver remotely, scheduling sessions across time zones as needed.' },
  { q: 'What information should I have ready before reaching out?', a: 'Your script or brief, intended use, target tone, deadline, and any reference samples help me give you an accurate quote.' },
  { q: 'Can I request a custom package?', a: 'Yes. For larger or ongoing work, I\u2019ll put together a tailored quote based on scope, word count, and timeline.' },
  { q: 'What file formats do you deliver?', a: 'Broadcast-quality WAV and MP3 by default, or any preferred format and specification you require.' },
  { q: 'How do I get started?', a: 'Send a message through the contact page with your project details, and I\u2019ll follow up to align on scope and timing.' },
  { q: 'What\u2019s your cancellation policy?', a: 'Deposits are non-refundable once work begins, but unused balances can be credited toward future projects within scope.' },
]

export default function ServicesPage() {
  return (
    <main>
      {/* HERO */}
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>What I<span className={s.heroTitleGold}>Offer</span></h1>
        <p className={s.heroBody}>
          Professional voice over work and coaching tailored to your needs. Every project receives dedicated
          attention and world-class quality. Voice services designed to meet your creative and professional needs.
        </p>
      </section>

      {/* SERVICES BREAKDOWN */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>Services <span className="gold">Breakdown</span></h2>
          <p className={s.headSub}>Comprehensive voice services designed to meet your creative and professional needs.</p>
        </Reveal>
        <div className={s.breakdown}>
          {breakdown.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 80}>
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
                      <div key={item} className={s.check}><span className={s.checkMark}>{'\u2713'}</span><span>{item}</span></div>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>Pricing <span className="gold">Packages</span></h2>
          <p className={s.headSub}>Transparent pricing designed to fit projects of all sizes. Custom quotes available for unique requirements.</p>
        </Reveal>
        <div className={s.pricing}>
          {pricing.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div className={`${s.priceCard} ${p.featured ? s.priceCardFeatured : ''}`}>
                <span className={`${s.badge} ${p.featured ? s.badgeFeatured : ''}`}>{p.badge}</span>
                <div className={s.priceName}>{p.name}</div>
                <div className={s.priceFrom}>{p.from}</div>
                <div className={s.priceBig}>{p.price}</div>
                <p className={s.priceDesc}>{p.desc}</p>
                <div className={s.priceIncludesLabel}>{p.listLabel}</div>
                <ul className={s.priceList}>
                  {p.list.map((li) => <li key={li}><span className="gold">{'\u2713'}</span>{li}</li>)}
                </ul>
                <Link href="/contact" className={`btn ${p.featured ? 'btnSolid' : 'btnOutline'}`} style={{ width: '100%' }}>{p.cta}</Link>
              </div>
            </Reveal>
          ))}
        </div>
        <p className={s.priceFootnote}>
          $ Prices may vary based on project complexity, word count, and delivery timeline. 50% deposit required before production begins. Final payment due upon delivery.
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>How It <span className="gold">Works</span></h2>
          <p className={s.headSub}>A simple, transparent process from first contact to final delivery. Here&rsquo;s what to expect when working with me.</p>
        </Reveal>
        <div className={s.timeline}>
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 60}>
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
          <h2 className={s.headTitle}>Quick <span className="gold">Answers</span></h2>
          <p className={s.headSub}>Common questions about booking and working together</p>
        </Reveal>
        <FaqGrid items={faqs} />
      </section>

      <CtaSection />
    </main>
  )
}