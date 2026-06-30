import { Reveal } from '@/components/reveal'
import { BookingForm } from '@/components/booking-form'
import s from './work-with-me.module.css'

export const metadata = {
  title: 'Work With Me',
  description: 'Book a free discovery call with Erwin Natividad — no payment, just a conversation about your project.',
}

const steps = [
  { t: 'Tell me about your project', d: 'Fill out the short form — your goals, the challenge, and a rough timeline.' },
  { t: 'I review and reach out', d: 'I\u2019ll email you within 24\u201348 hours to confirm a call time that works for us both.' },
  { t: 'We have a discovery call', d: 'A relaxed conversation about your goals, scope, and whether we\u2019re the right fit. No pressure.' },
  { t: 'You get a tailored plan', d: 'If it\u2019s a match, I\u2019ll send a clear quote and next steps. Only then do we talk numbers.' },
]

export default function WorkWithMePage() {
  return (
    <main>
      <section className={`${s.hero} container`}>
        <span className={s.eyebrow}>Work With Me</span>
        <h1 className={s.heroTitle}>Let&rsquo;s start with a <span className={s.heroTitleGold}>conversation</span></h1>
        <p className={s.heroBody}>Book a free discovery call. No payment, no pressure &mdash; just a focused chat about your project so we can map out the right approach together.</p>
      </section>

      <section className="container">
        <div className={s.layout}>
          <Reveal><BookingForm /></Reveal>

          <aside className={s.side}>
            <Reveal delay={60}>
              <div className={s.sideCard}>
                <div className={s.sideTitle}>How it works</div>
                {steps.map((st, i) => (
                  <div key={i} className={s.step}>
                    <span className={s.stepNum}>{i + 1}</span>
                    <span className={s.stepText}><strong>{st.t}</strong><span>{st.d}</span></span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className={s.assureCard}>
                <div className={s.assureTitle}>This isn&rsquo;t a checkout</div>
                <p className={s.assureBody}>You won&rsquo;t be asked to pay anything to book. The goal of the call is simply to understand what you need and see if we&rsquo;re a good fit before any project begins.</p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </main>
  )
}