// src/components/home-cta-form.tsx
'use client'

import { useActionState } from 'react'
import { subscribeToNewsletter, type NewsletterState } from '@/app/actions/newsletter'

const initialState: NewsletterState = { status: 'idle' }

export function HomeCtaForm({
  emailPlaceholder, buttonLabel, inputClassName, formClassName,
}: { emailPlaceholder: string; buttonLabel: string; inputClassName: string; formClassName: string }) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState)

  if (state.status === 'success') {
    return <p style={{ marginTop: 24 }}>Thanks — check your inbox to confirm your subscription.</p>
  }

  return (
    <form action={formAction} className={formClassName}>
      <input type="hidden" name="source" value="homepage-cta" />
      <input
        className={inputClassName} type="email" name="email" required
        placeholder={emailPlaceholder} aria-label={emailPlaceholder}
      />
      <button type="submit" className="btn btnSolid" disabled={pending}>
        {pending ? 'Submitting…' : buttonLabel}
      </button>
      {state.status === 'error' && <p role="alert" style={{ color: 'var(--error, #B3261E)', fontSize: 14 }}>{state.message}</p>}
    </form>
  )
}