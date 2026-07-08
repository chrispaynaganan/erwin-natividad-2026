'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { deleteShow } from './actions'
import type { Show } from '@/lib/shows/store'

export function ShowList({ shows }: { shows: Show[] }) {
  const [pending, start] = useTransition()

  function onDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This will also delete every episode that belongs to it. This can\u2019t be undone.`)) return
    start(() => {
      deleteShow(id).then((res) => {
        if (res && !res.ok) alert(res.message)
      })
    })
  }

  if (shows.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>No shows yet \u2014 create your first one before adding episodes.</p>
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
          <th style={{ padding: '10px 8px' }}>Title</th>
          <th style={{ padding: '10px 8px' }}>Slug</th>
          <th style={{ padding: '10px 8px' }}>Status</th>
          <th style={{ padding: '10px 8px' }} />
        </tr>
      </thead>
      <tbody>
        {shows.map((sh) => (
          <tr key={sh.id} style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '10px 8px' }}>
              <Link href={`/admin/shows/${sh.id}`}>{sh.title}</Link>
            </td>
            <td style={{ padding: '10px 8px' }}>{sh.slug}</td>
            <td style={{ padding: '10px 8px' }}>{sh.status}</td>
            <td style={{ padding: '10px 8px', textAlign: 'right' }}>
              <button type="button" disabled={pending} onClick={() => onDelete(sh.id, sh.title)}
                style={{ color: '#C0392B', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', fontSize: '0.85rem' }}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}