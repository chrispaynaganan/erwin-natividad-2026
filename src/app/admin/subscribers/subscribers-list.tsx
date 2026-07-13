// src/app/admin/subscribers/subscribers-list.tsx
'use client'

import { useState, useMemo, startTransition } from 'react'
import { setSubscriberStatus } from './actions'
import type { SubscriberRow, SubscriberStatus } from '@/lib/subscribers-db/store'

const STATUS_OPTIONS: SubscriberStatus[] = ['pending', 'subscribed', 'unsubscribed', 'bounced']

export function SubscribersList({ subscribers }: { subscribers: SubscriberRow[] }) {
  const [rows, setRows] = useState(subscribers)
  const [statusFilter, setStatusFilter] = useState<SubscriberStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => rows.filter((r) =>
    (statusFilter === 'all' || r.status === statusFilter) &&
    r.email.toLowerCase().includes(search.toLowerCase())
  ), [rows, statusFilter, search])

  function handleStatusChange(id: string, status: SubscriberStatus) {
    const prev = rows
    setRows((cur) => cur.map((r) => (r.id === id ? { ...r, status } : r)))
    startTransition(() => {
      setSubscriberStatus(id, status).then((res) => {
        if (!res.ok) { setRows(prev); console.error(res.error) }
      })
    })
  }

  function exportCsv() {
    const header = 'email,status,source,subscribed_at,unsubscribed_at,created_at'
    const lines = filtered.map((r) =>
      [r.email, r.status, r.source ?? '', r.subscribed_at ?? '', r.unsubscribed_at ?? '', r.created_at]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')
    )
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input placeholder="Search by email…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SubscriberStatus | 'all')}>
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <button type="button" className="btn btnOutline" onClick={exportCsv}>Export CSV</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>Email</th><th>Status</th><th>Source</th><th>Subscribed</th><th>Joined</th></tr></thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} style={{ borderTop: '1px solid var(--border, #E7E5E0)' }}>
              <td>{r.email}</td>
              <td>
                <select value={r.status} onChange={(e) => handleStatusChange(r.id, e.target.value as SubscriberStatus)}>
                  {STATUS_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </td>
              <td>{r.source ?? '—'}</td>
              <td>{r.subscribed_at ? new Date(r.subscribed_at).toLocaleDateString() : '—'}</td>
              <td>{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted, #6B6862)' }}>No subscribers match this filter.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}