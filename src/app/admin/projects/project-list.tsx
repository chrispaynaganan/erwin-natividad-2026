'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { IconAlertTriangle, IconStar, IconSparkles } from '@tabler/icons-react'
import { deleteProject } from './actions'
import type { ProjectRow } from '@/lib/projects-db/store'
import s from './projects.module.css'

function StatusPill({ status }: { status: string }) {
  return <span className={`${s.pill} ${s[status] ?? s.draft}`}>{status}</span>
}

export function ProjectList({
  projects,
  featuredSlots = 3,
}: {
  projects: ProjectRow[]
  featuredSlots?: number
}) {
  const [pending, start] = useTransition()

  function onDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can’t be undone.`)) return
    start(() => {
      deleteProject(id).then((res) => { if (res && !res.ok) alert(res.message) })
    })
  }

  if (projects.length === 0) {
    return <p className={s.empty}>No projects yet — create your first one.</p>
  }

  // The homepage renders featured projects in sort order and stops at the slot
  // count, so anything past that is set but invisible. Flag it per row.
  const featuredInOrder = projects.filter((p) => p.is_featured).map((p) => p.id)
  const overflowIds = new Set(featuredInOrder.slice(featuredSlots))

  return (
    <>
      {overflowIds.size > 0 && (
        <p className={`${s.notice} ${s.noticeWarn}`}>
          <IconAlertTriangle size={15} stroke={1.8} />
          {featuredInOrder.length} projects are featured but the homepage shows only {featuredSlots}.
          The {overflowIds.size} lowest in sort order won’t appear.
        </p>
      )}

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.titleCol}>Project</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Hero</th>
              <th className={s.actionCol} />
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className={s.row}>
                <td className={s.titleCell}>
                  <Link href={`/admin/projects/${p.id}`} className={s.title}>{p.title}</Link>
                  <span className={s.meta}>
                    /work/{p.slug}
                    {p.tags?.length ? ` · ${p.tags.length} tag${p.tags.length === 1 ? '' : 's'}` : ''}
                    {!p.audio_url ? ' · no demo audio' : ''}
                  </span>
                </td>
                <td><StatusPill status={p.status} /></td>
                <td>
                  {p.is_featured ? (
                    <span className={overflowIds.has(p.id) ? `${s.flag} ${s.overflow}` : s.flag}>
                      <IconStar size={14} stroke={1.8} />
                      {overflowIds.has(p.id) ? 'Over limit' : 'Featured'}
                    </span>
                  ) : (
                    <span className={`${s.flag} ${s.flagOff}`}>—</span>
                  )}
                </td>
                <td>
                  {p.is_hero ? (
                    <span className={s.flag}><IconSparkles size={14} stroke={1.8} /> Hero</span>
                  ) : (
                    <span className={`${s.flag} ${s.flagOff}`}>—</span>
                  )}
                </td>
                <td className={s.actionCell}>
                  <button type="button" className={s.del} disabled={pending} onClick={() => onDelete(p.id, p.title)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}