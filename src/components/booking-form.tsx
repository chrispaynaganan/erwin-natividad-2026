'use client'
import { useActionState } from 'react'
import { IconCalendarEvent } from '@tabler/icons-react'
import { submitBooking, type BookingState } from '@/app/work-with-me/actions'
import s from '@/app/work-with-me/work-with-me.module.css'

const projectTypes = ['Voice Over Recording', 'Voice Coaching', 'Demo Reel Production', 'Script Consultation', 'Not sure yet / Other']
const budgets = ['Not sure yet', 'Under $250', '$250 \u2013 $500', '$500 \u2013 $1,000', '$1,000+']
const times = ['Flexible', 'Morning', 'Afternoon', 'Evening']

export function BookingForm() {
  const [state, action, pending] = useActionState<BookingState, FormData>(submitBooking, null)

  return (
    <form action={action} className={s.form}>
      {/* Honeypot — hidden from real users; bots that fill it are silently dropped. */}
      <input type="text" name="company_url" tabIndex={-1} autoComplete="off" aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      <h2 className={s.formTitle}>Request a Discovery Call</h2>
      <p className={s.formSub}>No payment needed &mdash; just tell me about your project and I&rsquo;ll email you to set up a time.</p>

      <div className={s.row2}>
        <label className={s.field}>
          <span className={s.label}>Full Name <span className={s.req}>*</span></span>
          <input name="full_name" required placeholder="John Doe" className={s.input} />
        </label>
        <label className={s.field}>
          <span className={s.label}>Email <span className={s.req}>*</span></span>
          <input name="email" type="email" required placeholder="john@example.com" className={s.input} />
        </label>
      </div>

      <div className={s.row2}>
        <label className={s.field}>
          <span className={s.label}>Company / Brand</span>
          <input name="company" placeholder="Optional" className={s.input} />
        </label>
        <label className={s.field}>
          <span className={s.label}>What do you need?</span>
          <select name="project_type" className={s.input} defaultValue={projectTypes[0]}>
            {projectTypes.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
      </div>

      <label className={s.field}>
        <span className={s.label}>What&rsquo;s the main challenge or goal? <span className={s.req}>*</span></span>
        <textarea name="challenge" required rows={3} className={s.input}
          placeholder="What are you trying to achieve? What&rsquo;s getting in the way right now?" />
      </label>

      <label className={s.field}>
        <span className={s.label}>Project details</span>
        <textarea name="details" rows={3} className={s.input}
          placeholder="Timeline, word count, intended use, reference samples — anything that helps me prepare." />
      </label>

      <div className={s.row2}>
        <label className={s.field}>
          <span className={s.label}>Budget range</span>
          <select name="budget" className={s.input} defaultValue={budgets[0]}>
            {budgets.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
        <label className={s.field}>
          <span className={s.label}>How did you hear about me?</span>
          <input name="heard" placeholder="Optional" className={s.input} />
        </label>
      </div>

      <div className={s.schedNote}>Preferred time for the call (I&rsquo;ll confirm by email)</div>
      <div className={s.row3}>
        <label className={s.field}>
          <span className={s.label}>Date</span>
          <input name="preferred_date" type="date" className={s.input} />
        </label>
        <label className={s.field}>
          <span className={s.label}>Time of day</span>
          <select name="preferred_time" className={s.input} defaultValue={times[0]}>
            {times.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
        <label className={s.field}>
          <span className={s.label}>Time zone</span>
          <input name="timezone" placeholder="e.g. EST" className={s.input} />
        </label>
      </div>

      {state && <p className={state.ok ? s.success : s.error}>{state.message}</p>}

      <button type="submit" className="btn btnSolid" disabled={pending} style={{ width: '100%', marginTop: 6 }}>
        <IconCalendarEvent size={17} stroke={1.75} /> {pending ? 'Sending\u2026' : 'Request My Call'}
      </button>
      <p className={s.fine}>This sends a request, not a confirmed booking &mdash; and you won&rsquo;t be charged anything.</p>
    </form>
  )
}