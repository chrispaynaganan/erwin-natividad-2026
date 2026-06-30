import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { FaqGrid, type Faq } from '@/components/faq'
import s from './faq.module.css'

export const metadata = { title: 'FAQ' }

const general: Faq[] = [
  { q: 'What services do you offer?', a: 'Professional voice over recording, one-on-one voice coaching, full demo reel production, and script consultation for voice-driven content.' },
  { q: 'Do you work with international and remote clients?', a: 'Yes \u2014 I work with clients worldwide and deliver entirely remotely, scheduling sessions across time zones as needed.' },
  { q: 'How do we get started?', a: 'Book a free discovery call through the Work With Me page. Tell me about your project and I\u2019ll email you to set up a time \u2014 no payment required to begin.' },
  { q: 'What makes a good fit for working together?', a: 'Clear goals and an openness to direction. Whether you\u2019re a brand, agency, or individual creator, the discovery call helps us both confirm it\u2019s the right match.' },
]

const projects: Faq[] = [
  { q: 'What styles and genres do you cover?', a: 'Commercials, narration, eLearning, corporate, explainer videos, audiobooks and more \u2014 from high-energy reads to warm, authoritative delivery.' },
  { q: 'What\u2019s your typical turnaround?', a: 'Most voice over projects deliver within 24\u201372 hours depending on scope. Rush options are available on request.' },
  { q: 'What file formats do you deliver?', a: 'Broadcast-quality WAV or MP3 by default, and I\u2019m happy to match any specific format, sample rate, or naming convention your project needs.' },
  { q: 'How many revisions are included?', a: 'Each package includes revision rounds within the agreed scope. Additional changes outside scope can be added at an hourly rate.' },
]

const booking: Faq[] = [
  { q: 'Is the discovery call really free?', a: 'Yes. The call is a no-obligation conversation about your project. You won\u2019t be charged anything to book or attend.' },
  { q: 'Do you require a deposit before a project starts?', a: 'For paid projects, a 50% deposit secures your start date, with the balance due on delivery. This only applies once we\u2019ve agreed on scope \u2014 never to book the call.' },
  { q: 'What are your rates?', a: 'Packages start at $150 for short-form work, with standard and custom tiers for larger projects. We\u2019ll confirm exact pricing after the discovery call.' },
  { q: 'What\u2019s your cancellation policy?', a: 'Discovery calls can be rescheduled anytime. For booked projects, cancellation terms are outlined in your agreement before any payment is made.' },
]

export default function FaqPage() {
  return (
    <main>
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>Frequently asked <span className={s.heroTitleGold}>questions</span></h1>
        <p className={s.heroBody}>Everything you need to know about working with me &mdash; from turnaround and formats to booking and payment. Don&rsquo;t see your question? Reach out anytime.</p>
      </section>

      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.catHead}>General</h2>
          <p className={s.catSub}>The basics about my work and process.</p>
        </Reveal>
        <FaqGrid items={general} />
      </section>

      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.catHead}>Projects &amp; Delivery</h2>
          <p className={s.catSub}>How voiceover and coaching projects run.</p>
        </Reveal>
        <FaqGrid items={projects} />
      </section>

      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.catHead}>Booking &amp; Payment</h2>
          <p className={s.catSub}>Scheduling, rates, and what to expect.</p>
        </Reveal>
        <FaqGrid items={booking} />
      </section>

      <section className={`${s.finalCta} container`}>
        <Reveal>
          <h2 className={s.ctaTitle}>Still have <span className="gold">questions?</span></h2>
          <p className={s.ctaBody}>Book a free discovery call and let&rsquo;s talk it through.</p>
          <Link href="/work-with-me" className="btn btnSolid">Work With Me</Link>
        </Reveal>
      </section>
    </main>
  )
}