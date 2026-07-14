// src/app/membership/page.tsx
import { listActivePlans } from '@/lib/plans-db/store'
import { MembershipCheckoutButton } from '@/components/checkout-button'

export const metadata = { title: 'Membership' }
export const dynamic = 'force-dynamic'

function formatPrice(cents: number, currency: string, interval: string) {
  const amount = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100)
  return `${amount}/${interval}`
}

export default async function MembershipPage() {
  const plans = await listActivePlans()

  return (
    <main className="container">
      <h1>Membership</h1>
      <p>Unlock premium episodes and behind-the-scenes content.</p>
      {plans.length === 0 ? (
        <p>Membership plans aren&rsquo;t available yet — check back soon.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{ border: '1px solid var(--border, #E7E5E0)', borderRadius: 12, padding: 24 }}>
              <h2>{plan.name}</h2>
              <p style={{ fontSize: 24, fontWeight: 600 }}>{formatPrice(plan.amount_cents, plan.currency, plan.interval)}</p>
              {plan.description && <p>{plan.description}</p>}
              {Array.isArray(plan.features) && (
                <ul>{plan.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
              )}
              <MembershipCheckoutButton planId={plan.id}>Subscribe</MembershipCheckoutButton>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}