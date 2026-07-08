'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { deleteEpisode } from './actions'
import type { Episode } from '@/lib/episodes/store'

export function EpisodeList({ episodes, showsById }: { episodes: Episode[]; showsById: Record<string, string> }) {
  const [pending, start] = useTransition()

  function onDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can\u2019t be undone.`)) return
    start(() => {
      deleteEpisode(id).then((res) => {
        if (res && !res.ok) alert(res.message)
      })
    })
  }

  if (episodes.length === 0) {
    return <p style={{ color: 'var(--color-text-muted)' }}>No episodes yet \u2014 create your first one.</p>
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
          <th style={{ padding: '10px 8px' }}>Title</th>
          <th style={{ padding: '10px 8px' }}>Show</th>
          <th style={{ padding: '10px 8px' }}>S / E</th>
          <th style={{ padding: '10px 8px' }}>Status</th>
          <th style={{ padding: '10px 8px' }}>Premium</th>
          <th style={{ padding: '10px 8px' }} />
        </tr>
      </thead>
      <tbody>
        {episodes.map((ep) => (
          <tr key={ep.id} style={{ borderBottom: '1px solid var(--border)' }}>
            <td style={{ padding: '10px 8px' }}>
              <Link href={`/admin/episodes/${ep.id}`}>{ep.title}</Link>
            </td>
            <td style={{ padding: '10px 8px' }}>{showsById[ep.show_id] ?? '\u2014'}</td>
            <td style={{ padding: '10px 8px' }}>{ep.season ?? '\u2014'} / {ep.episode_number ?? '\u2014'}</td>
            <td style={{ padding: '10px 8px' }}>{ep.status}</td>
            <td style={{ padding: '10px 8px' }}>{ep.is_premium ? 'Yes' : 'No'}</td>
            <td style={{ padding: '10px 8px', textAlign: 'right' }}>
              <button type="button" disabled={pending} onClick={() => onDelete(ep.id, ep.title)}
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