import { Reveal } from '@/components/reveal'
import CalendlyEmbed from '@/components/calendly-embed'
import { createPublicClient } from '@/lib/supabase/public'
import s from './work-with-me.module.css'

export const metadata = {
  title: 'Work With Me',
  description: 'Book a free discovery call with Erwin Natividad — no payment, just a conversation about your project.',
}

const steps = [
  { t: 'Pick a time that works', d: 'Choose an open slot directly on the calendar below — no back-and-forth emails needed.' },
  { t: 'Get instant confirmation', d: 'You’ll get a calendar invite and confirmation email right away, with a link to reschedule if plans change.' },
  { t: 'We have a discovery call', d: 'A relaxed conversation about your goals, scope, and whether we’re the right fit. No pressure.' },
  { t: 'You get a tailored plan', d: 'If it’s a match, I’ll send a clear quote and next steps. Only then do we talk numbers.' },
]

// Editable in /admin/settings (Defaults tab) → settings.calendly_url. Falls
// back to NEXT_PUBLIC_CALENDLY_URL so local dev / a fresh deploy still works
// before an admin has set it through the dashboard.
async function getCalendlyUrl(): Promise<string | undefined> {
  const supabase = createPublicClient()
  const { data } = await supabase.from('settings').select('value').eq('key', 'calendly_url').maybeSingle()
  const fromDb = typeof data?.value === 'string' ? data.value.trim() : ''
  return fromDb || process.env.NEXT_PUBLIC_CALENDLY_URL
}

export default async function WorkWithMePage() {
  const calendlyUrl = await getCalendlyUrl()

  return (
    <main>
      <section className={`${s.hero} container`}>
        <span className={s.eyebrow}>Work With Me</span>
        <h1 className={s.heroTitle}>Let&rsquo;s start with a <span className={s.heroTitleGold}>conversation</span></h1>
        <p className={s.heroBody}>Book a free discovery call. No payment, no pressure &mdash; just a focused chat about your project so we can map out the right approach together.</p>
      </section>

      <section className="container">
        <div className={s.layout}>
          <Reveal><CalendlyEmbed url={calendlyUrl} /></Reveal>

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