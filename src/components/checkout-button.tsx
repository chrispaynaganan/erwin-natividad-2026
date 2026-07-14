// src/components/checkout-button.tsx
'use client'

import { useTransition } from 'react'
import { createMembershipCheckout, createOneOffCheckout } from '@/app/actions/checkout'

export function MembershipCheckoutButton({ planId, children }: { planId: string; children: React.ReactNode }) {
  const [pending, startTransition] = useTransition()
  return (
    <button type="button" className="btn btnPrimary" disabled={pending}
      onClick={() => startTransition(() => { createMembershipCheckout(planId) })}>
      {pending ? 'Redirecting…' : children}
    </button>
  )
}

export function OneOffCheckoutButton({
  amountCents, description, children,
}: { amountCents: number; description: string; children: React.ReactNode }) {
  const [pending, startTransition] = useTransition()
  return (
    <button type="button" className="btn btnPrimary" disabled={pending}
      onClick={() => startTransition(() => { createOneOffCheckout({ amountCents, description }) })}>
      {pending ? 'Redirecting…' : children}
    </button>
  )
}