'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { IconChevronRight, IconPencil, IconPlus, IconAlertTriangle } from '@tabler/icons-react'
import { deleteShow } from './actions'
import { deleteEpisode } from '@/app/admin/episodes/actions'
import type { Show } from '@/lib/shows/store'
import type { Episode } from '@/lib/episodes/store'
import s from './podcasts.module.css'

function StatusPill({ status }: { status: string }) {
  const cls = s[status] ?? s.draft
  return <span className={`${s.pill} ${cls}`}>{status}</span>
}

function fmtDuration(secs: number | null) {
  if (!secs) return null
  const m = Math.floor(secs / 60)
  const sec = secs % 60
  return `${m}:${String(sec).padStart(2, '0')}`
}

function WarnTooltip({ label }: { label: string }) {
  return (
    <span className={s.tooltipWrap} tabIndex={0} aria-label={label}>
      <IconAlertTriangle size={15} stroke={1.9} className={s.warnIcon} aria-hidden />
      <span className={s.tooltipBubble} role="tooltip">{label}</span>
    </span>
  )
}

export function ShowList({
  shows,
  episodesByShow,
}: {
  shows: Show[]
  episodesByShow: Record<string, Episode[]>
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [pending, start] = useTransition()

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function onDeleteShow(id: string, title: string, count: number) {
    const warning = count
      ? `Delete "${title}"? This will also delete its ${count} episode${count === 1 ? '' : 's'}. This can’t be undone.`
      : `Delete "${title}"? This can’t be undone.`
    if (!confirm(warning)) return
    start(() => {
      deleteShow(id).then((res) => { if (res && !res.ok) alert(res.message) })
    })
  }

  function onDeleteEpisode(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can’t be undone.`)) return
    start(() => {
      deleteEpisode(id).then((res) => { if (res && !res.ok) alert(res.message) })
    })
  }

  if (shows.length === 0) {
    return (
      <div className={s.tableWrap}>
        <p className={s.empty}>No shows yet — create your first one before adding episodes.</p>
        <div className={s.addRow}>
          <Link href="/admin/shows/new" className={s.addBtn}>
            <IconPlus size={15} stroke={1.9} /> Add new show
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={s.tableWrap}>
      <div className={s.tableHead}>
        <span>Title</span>
        <span>Slug</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      {shows.map((sh) => {
        const eps = episodesByShow[sh.id] ?? []
        const isOpen = open[sh.id] ?? false
        const broken = eps.filter((e) => e.status === 'published' && !e.audio_path).length

        return (
          <div key={sh.id}>
            <div
              className={s.row}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => toggle(sh.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(sh.id) }
              }}
            >
              <span className={s.titleCell}>
                <IconChevronRight size={16} stroke={1.8} className={isOpen ? `${s.chev} ${s.chevOpen}` : s.chev} />
                {sh.cover_url
                  ? <img src={sh.cover_url} alt="" className={s.cover} />
                  : <span className={s.cover} aria-hidden />}
                <span className={s.titleMain}>
                  <span className={s.titleText}>
                    {sh.title}
                    {broken > 0 && <WarnTooltip label={`${broken} published episode${broken === 1 ? '' : 's'} without audio`} />}
                  </span>
                  <span className={s.meta}>{eps.length} episode{eps.length === 1 ? '' : 's'}</span>
                </span>
              </span>

              <span className={s.slugCell}>/{sh.slug}</span>
              <StatusPill status={sh.status} />

              <span className={s.actionsCell}>
                <Link
                  href={`/admin/shows/${sh.id}`}
                  className={s.iconBtn}
                  onClick={(e) => e.stopPropagation()}
                >
                  <IconPencil size={14} stroke={1.9} /> Edit
                </Link>
                <button
                  type="button"
                  className={`${s.iconBtn} ${s.iconBtnDanger}`}
                  disabled={pending}
                  onClick={(e) => { e.stopPropagation(); onDeleteShow(sh.id, sh.title, eps.length) }}
                >
                  Delete
                </button>
              </span>
            </div>

            {isOpen && (
              <>
                {eps.length === 0 && <p className={s.epEmpty}>No episodes in this show yet.</p>}

                {eps.map((ep) => (
                  <div key={ep.id} className={`${s.row} ${s.rowEp}`}>
                    <span className={s.titleCell}>
                      <span className={s.chevSpacer} aria-hidden />
                      <span className={s.titleMain}>
                        <span className={s.titleText}>
                          <Link href={`/admin/episodes/${ep.id}`} className={s.epTitle}>{ep.title}</Link>
                          {!ep.audio_path && <WarnTooltip label="Published without audio" />}
                        </span>
                        <span className={s.meta}>
                          Season {ep.season ?? '—'} · Episode {ep.episode_number ?? '—'}
                          {fmtDuration(ep.duration_secs) && ` · ${fmtDuration(ep.duration_secs)}`}
                          {ep.is_premium && ' · Premium'}
                        </span>
                      </span>
                    </span>

                    <span className={s.slugCell}>—</span>
                    <StatusPill status={ep.status} />

                    <span className={s.actionsCell}>
                      <Link href={`/admin/episodes/${ep.id}`} className={s.iconBtn}>
                        <IconPencil size={14} stroke={1.9} /> Edit
                      </Link>
                      <button
                        type="button"
                        className={`${s.iconBtn} ${s.iconBtnDanger}`}
                        disabled={pending}
                        onClick={() => onDeleteEpisode(ep.id, ep.title)}
                      >
                        Delete
                      </button>
                    </span>
                  </div>
                ))}

                <div className={s.addRow}>
                  <Link href={`/admin/episodes/new?show=${sh.id}`} className={s.addBtn}>
                    <IconPlus size={15} stroke={1.9} /> Add new episode
                  </Link>
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}