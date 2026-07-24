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
      ? `Delete "${title}"? This will also delete its ${count} episode${count === 1 ? '' : 's'}. This can\u2019t be undone.`
      : `Delete "${title}"? This can\u2019t be undone.`
    if (!confirm(warning)) return
    start(() => {
      deleteShow(id).then((res) => { if (res && !res.ok) alert(res.message) })
    })
  }

  function onDeleteEpisode(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can\u2019t be undone.`)) return
    start(() => {
      deleteEpisode(id).then((res) => { if (res && !res.ok) alert(res.message) })
    })
  }

  if (shows.length === 0) {
    return <p className={s.empty}>No shows yet — create your first one before adding episodes.</p>
  }

  return (
    <div className={s.list}>
      {shows.map((sh) => {
        const eps = episodesByShow[sh.id] ?? []
        const isOpen = open[sh.id] ?? false
        // A published episode with no audio file is a real error, not just incomplete.
        const broken = eps.filter((e) => e.status === 'published' && !e.audio_path).length

        return (
          <div key={sh.id} className={s.show}>
            <button type="button" className={s.showHead} onClick={() => toggle(sh.id)} aria-expanded={isOpen}>
              <IconChevronRight size={17} stroke={1.8} className={isOpen ? `${s.chev} ${s.chevOpen}` : s.chev} />
              {sh.cover_url
                ? <img src={sh.cover_url} alt="" className={s.cover} />
                : <span className={s.cover} aria-hidden />}
              <span className={s.showMain}>
                <span className={s.showTitle}>
                  {sh.title}
                  <StatusPill status={sh.status} />
                  {broken > 0 && (
                    <span className={s.warn}>
                      <IconAlertTriangle size={14} stroke={1.8} />
                      {broken} published without audio
                    </span>
                  )}
                </span>
                <span className={s.showMeta}>
                  /{sh.slug} · {eps.length} episode{eps.length === 1 ? '' : 's'}
                </span>
              </span>
              <span className={s.showActions}>
                <Link href={`/admin/shows/${sh.id}`} className={s.link} onClick={(e) => e.stopPropagation()}>
                  <IconPencil size={15} stroke={1.75} /> Edit show
                </Link>
                <button
                  type="button"
                  className={s.del}
                  disabled={pending}
                  onClick={(e) => { e.stopPropagation(); onDeleteShow(sh.id, sh.title, eps.length) }}
                >
                  Delete
                </button>
              </span>
            </button>

            {isOpen && (
              <div className={s.body}>
                {eps.length === 0 && <p className={s.epEmpty}>No episodes in this show yet.</p>}

                {eps.map((ep) => (
                  <div key={ep.id} className={s.epRow}>
                    <span className={s.epMain}>
                      <Link href={`/admin/episodes/${ep.id}`} className={s.epTitle}>{ep.title}</Link>
                      <span className={s.epMeta}>
                        <span>
                          S{ep.season ?? '—'} · E{ep.episode_number ?? '—'}
                        </span>
                        {fmtDuration(ep.duration_secs) && <span>{fmtDuration(ep.duration_secs)}</span>}
                        {ep.is_premium && <span>Premium</span>}
                        {!ep.audio_path && <span className={s.warn}>No audio</span>}
                      </span>
                    </span>
                    <StatusPill status={ep.status} />
                    <button
                      type="button"
                      className={s.del}
                      disabled={pending}
                      onClick={() => onDeleteEpisode(ep.id, ep.title)}
                    >
                      Delete
                    </button>
                  </div>
                ))}

                <div className={s.addRow}>
                  <Link href={`/admin/episodes/new?show=${sh.id}`} className={s.link}>
                    <IconPlus size={15} stroke={1.9} /> New episode in {sh.title}
                  </Link>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}