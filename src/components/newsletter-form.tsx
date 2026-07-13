// src/components/newsletter-form.tsx
'use client'

import { useActionState } from 'react'
import { subscribeToNewsletter, type NewsletterState } from '@/app/actions/newsletter'

const initialState: NewsletterState = { status: 'idle' }

export function NewsletterForm({ source = 'unknown' }: { source?: string }) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState)

  if (state.status === 'success') {
    return <p>Thanks — check your inbox to confirm your subscription.</p>
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="source" value={source} />
      <input type="email" name="email" placeholder="you@example.com" required />
      <button type="submit" disabled={pending}>{pending ? 'Subscribing…' : 'Subscribe'}</button>
      {state.status === 'error' && <p role="alert">{state.message}</p>}
    </form>
  )
}