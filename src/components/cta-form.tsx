'use client'

import { useActionState } from 'react'
import { subscribeToNewsletter, type NewsletterState } from '@/app/actions/newsletter'

const initialState: NewsletterState = { status: 'idle' }

export function CtaForm({ emailPlaceholder, buttonLabel }: { emailPlaceholder: string; buttonLabel: string }) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState)

  if (state.status === 'success') {
    return <p style={{ marginTop: 24, color: 'var(--text-muted)' }}>Thanks — check your inbox to confirm your subscription.</p>
  }

  return (
    <form action={formAction} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24, maxWidth: 520 }}>
      <input type="hidden" name="source" value="cta-section" />
      <input
        type="email" name="email" required
        placeholder={emailPlaceholder} aria-label={emailPlaceholder}
        style={{ flex: 1, minWidth: 220, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', font: 'inherit' }}
      />
      <button type="submit" className="btn btnSolid" disabled={pending}>
        {pending ? 'Submitting…' : buttonLabel}
      </button>
      {state.status === 'error' && (
        <p role="alert" style={{ width: '100%', color: 'var(--error, #B3261E)', fontSize: 14 }}>{state.message}</p>
      )}
    </form>
  )
}