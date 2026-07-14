// src/app/actions/checkout.ts
'use server'

import { redirect } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { createPublicClient } from '@/lib/supabase/public'
// ⚠️ Same unconfirmed import as lib/blog.ts — still haven't seen the real file.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
// ⚠️ Env var name assumed. Swap for whatever's actually in .env.example.

async function getCurrentUserId(): Promise<string | null> {
  // ⚠️ ASSUMPTION — I've never seen lib/auth.ts or how requireRole() reads
  // the session. This is the standard Supabase SSR pattern, but if the real
  // helper differs, this function is the one thing to swap.
  const db = createPublicClient()
  const { data: { user } } = await db.auth.getUser()
  return user?.id ?? null
}

export async function createMembershipCheckout(planId: string) {
  const userId = await getCurrentUserId()
  if (!userId) {
    // Memberships require an account — bounce to login, come back after.
    redirect(`/login?next=/pricing&plan=${planId}`)
    // ⚠️ "/login" is a guess. Real route unconfirmed.
  }

  const adminDb = createAdminClient()
  const { data: plan, error } = await adminDb
    .from('plans')
    .select('id, stripe_price_id, is_active')
    .eq('id', planId)
    .maybeSingle()

  if (error || !plan || !plan.is_active || !plan.stripe_price_id) {
    throw new Error('This plan is not available for checkout.')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
    success_url: `${SITE_URL}/account?checkout=success`,
    cancel_url: `${SITE_URL}/pricing?checkout=cancelled`,
    // Critical: metadata on the Session does NOT propagate to the
    // Subscription object automatically. The webhook reads
    // sub.metadata?.user_id off the Subscription itself, so it has to be
    // set here explicitly via subscription_data, not just top-level.
    subscription_data: { metadata: { user_id: userId } },
    metadata: { user_id: userId, plan_id: planId },
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL.')
  redirect(session.url)
}

export async function createOneOffCheckout(input: {
  amountCents: number
  currency?: string
  description: string
}) {
  const userId = await getCurrentUserId() // optional for one-off — null is fine for guests
  const { amountCents, currency = 'usd', description } = input

  if (!amountCents || amountCents < 50) {
    throw new Error('Invalid payment amount.')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: { currency, unit_amount: amountCents, product_data: { name: description } },
      quantity: 1,
    }],
    // No customer_email set — Stripe Checkout's own email field handles guest capture.
    success_url: `${SITE_URL}/thank-you?checkout=success`,
    cancel_url: `${SITE_URL}/pricing?checkout=cancelled`,
    // Same propagation rule as above, on payment_intent_data this time.
    // Deliberately omitting the user_id key entirely for guests rather than
    // sending an empty string — Stripe metadata values must be strings, and
    // the webhook does `intent.metadata?.user_id ?? null` before inserting
    // into a uuid column. An empty string would pass that `?? null` check
    // and then fail at the database as an invalid uuid. Omitting the key
    // makes it genuinely `undefined`, which resolves to `null` correctly.
    payment_intent_data: {
      metadata: { description, ...(userId ? { user_id: userId } : {}) },
    },
    metadata: userId ? { user_id: userId } : {},
  })

  if (!session.url) throw new Error('Stripe did not return a checkout URL.')
  redirect(session.url)
}