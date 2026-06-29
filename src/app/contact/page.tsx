import { Reveal } from '@/components/reveal'
import { FaqGrid, type Faq } from '@/components/faq'
import { ContactForm } from '@/components/contact-form'
import s from './contact.module.css'

export const metadata = { title: 'Contact' }

const expect = [
  { t: 'Response time:', d: 'I typically respond within 24-48 hours' },
  { t: 'Next steps:', d: 'A brief discovery call or email discussion about your project' },
  { t: 'Be prepared:', d: 'Having your script or word count estimate ready speeds things up' },
  { t: 'International welcome:', d: 'I work with clients worldwide across all time zones' },
]

const direct = [
  { icon: '\u2709', label: 'Email', value: 'erwin.natividad@voiceover.com' },
  { icon: '\u260E', label: 'Phone', value: '+1 (234) 567-8900' },
  { icon: '\u{1F5FA}', label: 'Location', value: 'Remote' },
]

const socials = ['f', '\u25C9', 'in', '\u25B6', 't']

const faqs: Faq[] = [
  { q: 'How soon can you start on a project?', a: 'Most projects begin within 2\u20133 business days of a signed agreement and deposit. Rush turnaround is available on request.' },
  { q: 'Do you require a deposit before starting?', a: 'Yes \u2014 a 50% deposit secures your slot and start date. The balance is due on delivery of the final files.' },
  { q: 'Do you work with international clients?', a: 'Absolutely. I work with clients worldwide and deliver remotely, scheduling sessions across time zones as needed.' },
  { q: 'What information should I have ready before reaching out?', a: 'Your script or brief, intended use, target tone, deadline, and any reference samples help me give you an accurate quote.' },
]

export default function ContactPage() {
  return (
    <main>
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>Let&rsquo;s work <span className={s.heroTitleGold}>together</span></h1>
        <p className={s.heroBody}>Whether you have a project in mind or just want to say hello, I&rsquo;d love to hear from you.</p>
      </section>

      <section className="container">
        <div className={s.layout}>
          <Reveal><ContactForm /></Reveal>

          <aside className={s.side}>
            <Reveal delay={60}>
              <div className={s.expectCard}>
                <div className={s.expectTitle}>What to Expect</div>
                {expect.map((e, i) => (
                  <div key={i} className={s.expectItem}>
                    <span className={s.expectNum}>{i + 1}</span>
                    <span className={s.expectText}><strong>{e.t}</strong> <span>{e.d}</span></span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className={s.directCard}>
                <div className={s.directTitle}>Direct Contact</div>
                {direct.map((d) => (
                  <div key={d.label} className={s.directRow}>
                    <span className={s.directIcon} aria-hidden>{d.icon}</span>
                    <span>
                      <div className={s.directLabel}>{d.label}</div>
                      <div className={s.directValue}>{d.value}</div>
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div>
                <p className={s.socialLabel}>You can also find me on</p>
                <div className={s.socials}>
                  {socials.map((c, i) => <span key={i} className={s.social} aria-hidden>{c}</span>)}
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className={`${s.faqSection} container`}>
        <Reveal>
          <h2 className={s.faqHead}>Quick <span className="gold">Answers</span></h2>
          <p className={s.faqSub}>Common questions about booking and working together</p>
        </Reveal>
        <FaqGrid items={faqs} />
      </section>
    </main>
  )
}