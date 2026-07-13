// src/app/admin/payments/payments-list.tsx
'use client'

import { useState, useMemo } from 'react'
import type { PaymentRow } from '@/lib/payments-db/store'

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100)
}

export function PaymentsList({ payments }: { payments: PaymentRow[] }) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const statuses = useMemo(() => Array.from(new Set(payments.map((p) => p.status))), [payments])

  const filtered = useMemo(() => payments.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    const q = search.toLowerCase()
    const matchesSearch = !q ||
      (p.profiles?.full_name ?? '').toLowerCase().includes(q) ||
      p.stripe_payment_intent_id.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q)
    return matchesStatus && matchesSearch
  }), [payments, statusFilter, search])

  // Revenue is "succeeded, not refunded" — sums whatever's actually collected.
  const totals = useMemo(() => {
    const succeeded = filtered.filter((p) => p.status === 'succeeded')
    const refunded = filtered.filter((p) => p.status === 'refunded')
    const byCurrency = (rows: PaymentRow[]) => {
      const sums = new Map<string, number>()
      for (const r of rows) sums.set(r.currency, (sums.get(r.currency) ?? 0) + r.amount_cents)
      return sums
    }
    return { revenue: byCurrency(succeeded), refunded: byCurrency(refunded), count: filtered.length }
  }, [filtered])

  function exportCsv() {
    const header = 'customer,amount,currency,status,description,stripe_payment_intent_id,date'
    const lines = filtered.map((p) => [
      p.profiles?.full_name ?? p.user_id ?? '',
      (p.amount_cents / 100).toFixed(2),
      p.currency,
      p.status,
      p.description ?? '',
      p.stripe_payment_intent_id,
      p.created_at,
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {[...totals.revenue.entries()].map(([currency, cents]) => (
          <div key={currency} style={{ border: '1px solid var(--border, #E7E5E0)', borderRadius: 8, padding: '12px 16px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted, #6B6862)' }}>Revenue ({currency.toUpperCase()})</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{formatMoney(cents, currency)}</div>
          </div>
        ))}
        {[...totals.refunded.entries()].map(([currency, cents]) => (
          <div key={currency} style={{ border: '1px solid var(--border, #E7E5E0)', borderRadius: 8, padding: '12px 16px' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted, #6B6862)' }}>Refunded ({currency.toUpperCase()})</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{formatMoney(cents, currency)}</div>
          </div>
        ))}
        <div style={{ border: '1px solid var(--border, #E7E5E0)', borderRadius: 8, padding: '12px 16px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted, #6B6862)' }}>Transactions</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{totals.count}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input placeholder="Search by customer, description, or payment ID…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1 }} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="button" className="btn btnOutline" onClick={exportCsv}>Export CSV</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>Customer</th><th>Amount</th><th>Status</th><th>Description</th><th>Date</th></tr></thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} style={{ borderTop: '1px solid var(--border, #E7E5E0)' }}>
              <td>{p.profiles?.full_name ?? p.user_id ?? '—'}</td>
              <td>{formatMoney(p.amount_cents, p.currency)}</td>
              <td>{p.status}</td>
              <td>{p.description ?? '—'}</td>
              <td>{new Date(p.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted, #6B6862)' }}>No payments match this filter.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}