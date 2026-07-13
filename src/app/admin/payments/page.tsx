// src/app/admin/payments/page.tsx
import { listPayments } from '@/lib/payments-db/store'
import { PaymentsList } from './payments-list'

export const metadata = { title: 'Payments' }

export default async function PaymentsPage() {
  const payments = await listPayments()
  return (
    <div>
      <h1>Payments</h1>
      <PaymentsList payments={payments} />
    </div>
  )
}