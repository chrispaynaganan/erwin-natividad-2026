import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import type Stripe from 'stripe'

// Stripe -> Supabase sync. This is the ONLY writer of memberships/payments.
// Membership/payment tables have no client write policies (see migration 0001).
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
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      // TODO: upsert into public.memberships keyed by stripe_subscription_id.
      // Map sub.status -> membership_status, set current_period_end, plan_id.
      console.log('subscription event', sub.id, sub.status)
      break
    }
    case 'payment_intent.succeeded':
    case 'charge.refunded': {
      const intent = event.data.object as Stripe.PaymentIntent
      // TODO: insert into public.payments.
      console.log('payment event', intent.id)
      break
    }
    default:
      // Unhandled events are fine — acknowledge so Stripe stops retrying.
      break
  }

  // Touch db to keep the import meaningful until handlers are filled in.
  void db
  return NextResponse.json({ received: true })
}
