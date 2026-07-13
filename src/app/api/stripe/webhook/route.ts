// src/app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

type MembershipStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete'

// Stripe has more subscription states than our enum. Anything unmatched
// (incomplete_expired, unpaid, paused) becomes `canceled` — safer to lose
// access than leave a membership stuck on a stale status.
function mapSubscriptionStatus(status: Stripe.Subscription.Status): MembershipStatus {
  switch (status) {
    case 'trialing': return 'trialing'
    case 'active': return 'active'
    case 'past_due': return 'past_due'
    case 'canceled': return 'canceled'
    case 'incomplete': return 'incomplete'
    default: return 'canceled'
  }
}

async function upsertMembership(db: ReturnType<typeof createAdminClient>, sub: Stripe.Subscription) {
  // Requires metadata.user_id set at Checkout Session creation — see note
  // below the switch statement about the missing checkout-initiation flow.
  const userId = sub.metadata?.user_id
  if (!userId) {
    console.error('subscription event missing metadata.user_id — cannot link membership', sub.id)
    return
  }

  const priceId = sub.items.data[0]?.price?.id
  let planId: string | null = null
  if (priceId) {
    const { data: plan } = await db.from('plans').select('id').eq('stripe_price_id', priceId).maybeSingle()
    planId = plan?.id ?? null
  }

  const { error } = await db.from('memberships').upsert(
    {
      user_id: userId,
      plan_id: planId,
      stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
      stripe_subscription_id: sub.id,
      status: mapSubscriptionStatus(sub.status),
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' }
  )
  if (error) console.error('membership upsert failed:', error)
}

async function recordPayment(db: ReturnType<typeof createAdminClient>, intent: Stripe.PaymentIntent, status: string) {
  const { error } = await db.from('payments').upsert(
    {
      user_id: intent.metadata?.user_id ?? null,
      membership_id: intent.metadata?.membership_id ?? null,
      stripe_payment_intent_id: intent.id,
      amount_cents: intent.amount,
      currency: intent.currency,
      status,
      description: intent.description ?? null,
    },
    { onConflict: 'stripe_payment_intent_id' }
  )
  if (error) console.error('payment upsert failed:', error)
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get('stripe-signature')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Stripe signature verification failed:', err)
    return new NextResponse('Invalid signature', { status: 400 })
  }

  const db = createAdminClient()

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await upsertMembership(db, event.data.object as Stripe.Subscription)
      break
    case 'payment_intent.succeeded':
      await recordPayment(db, event.data.object as Stripe.PaymentIntent, 'succeeded')
      break
    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const intentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id
      if (intentId) {
        const { error } = await db.from('payments').update({ status: 'refunded' }).eq('stripe_payment_intent_id', intentId)
        if (error) console.error('payment refund update failed:', error)
      }
      break
    }
    default:
      break
  }

  return NextResponse.json({ received: true })
}