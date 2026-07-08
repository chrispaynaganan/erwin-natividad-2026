'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { deleteProject } from './actions'
import type { ProjectRow } from '@/lib/projects-db/store'

export function ProjectList({ projects }: { projects: ProjectRow[] }) {
  const [pending, start] = useTransition()

  function onDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can\u2019t be undone.`)) return
    start(() => {
      deleteProject(id).then((res) => {
        if (res && !res.ok) alert(res.message)
      })
    })
  }

  if (projects.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>No projects yet \u2014 create your first one.</p>
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
          <th style={{ padding: '10px 8px' }}>Title</th>
          <th style={{ padding: '10px 8px' }}>Status</th>
          <th style={{ padding: '10px 8px' }}>Featured</th>
          <th style={{ padding: '10px 8px' }} />
        </tr>
      </thead>
      <tbody>
        {projects.map((p) => (
          <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '10px 8px' }}>
              <Link href={`/admin/projects/${p.id}`}>{p.title}</Link>
            </td>
            <td style={{ padding: '10px 8px' }}>{p.status}</td>
            <td style={{ padding: '10px 8px' }}>{p.is_featured ? 'Yes' : 'No'}</td>
            <td style={{ padding: '10px 8px', textAlign: 'right' }}>
              <button type="button" disabled={pending} onClick={() => onDelete(p.id, p.title)}
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