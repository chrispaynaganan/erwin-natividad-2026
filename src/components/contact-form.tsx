'use client'
import { useActionState } from 'react'
import { IconSend } from '@tabler/icons-react'
import { submitContact, type ContactState } from '@/app/contact/actions'
import s from '@/app/contact/contact.module.css'

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, null)

  return (
    <form action={action} className={s.form}>
      <h2 className={s.formTitle}>Send a Message</h2>
      <p className={s.formSub}>Fill out the form below and I&rsquo;ll get back to you within 24-48 hours.</p>

      <label className={s.field}>
        <span className={s.label}>Full Name <span className={s.req}>*</span></span>
        <input name="full_name" required placeholder="John Doe" className={s.input} />
      </label>

      <div className={s.row2}>
        <label className={s.field}>
          <span className={s.label}>Email Address <span className={s.req}>*</span></span>
          <input name="email" type="email" required placeholder="john@example.com" className={s.input} />
        </label>
        <label className={s.field}>
          <span className={s.label}>Phone Number</span>
          <input name="phone" placeholder="john@example.com" className={s.input} />
        </label>
      </div>

      <label className={s.field}>
        <span className={s.label}>Inquiry <span className={s.req}>*</span></span>
        <input name="inquiry" placeholder="Type of Inquiry" className={s.input} />
      </label>

      <label className={s.field}>
        <span className={s.label}>Project Brief / Message <span className={s.req}>*</span></span>
        <textarea name="message" required rows={4} className={s.input}
          placeholder="Tell me about your project, goals, or questions. The more detail, the better! Include things like: project timeline, budget range, script length, intended use, and any specific direction you have in mind." />
      </label>

      {state && <p className={state.ok ? s.success : s.error}>{state.message}</p>}

      <button type="submit" className="btn btnSolid" disabled={pending} style={{ width: '100%', marginTop: 6 }}>
        <IconSend size={17} stroke={1.75} /> {pending ? 'Sending\u2026' : 'Let\u2019s Talk'}
      </button>
    </form>
  )
}