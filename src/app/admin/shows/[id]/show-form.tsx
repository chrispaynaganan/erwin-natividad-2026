'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { IconDeviceFloppy, IconCircleCheck, IconAlertTriangle } from '@tabler/icons-react'
import { Field } from '@/app/admin/content/fields'
import { ImageField } from '@/components/admin/image-field'
import { saveShow, type SaveState } from '../actions'
import type { Show } from '@/lib/shows/store'
import type { Episode } from '@/lib/episodes/store'
import s from '@/app/admin/content/content.module.css'

const STATUSES = ['draft', 'scheduled', 'published', 'archived'] as const
type Status = (typeof STATUSES)[number]

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function ShowForm({ show, episodes }: { show: Show | null; episodes: Episode[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<SaveState>(null)
  const [dirty, setDirty] = useState(false)

  const [title, setTitle] = useState(show?.title ?? '')
  const [slug, setSlug] = useState(show?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!show)
  const [description, setDescription] = useState(show?.description ?? '')
  const [coverUrl, setCoverUrl] = useState(show?.cover_url ?? '')
  const [status, setStatus] = useState<Status>((show?.status as Status) ?? 'draft')
  const [sortOrder, setSortOrder] = useState(show?.sort_order?.toString() ?? '0')
  const [featuredEpisodeId, setFeaturedEpisodeId] = useState(show?.featured_episode_id ?? '')

  function markDirty() { setDirty(true); setMsg(null) }

  function onTitleChange(v: string) {
    setTitle(v)
    markDirty()
    if (!slugTouched) setSlug(slugify(v))
  }

  function save() {
    start(async () => {
      const res = await saveShow({
        id: show?.id,
        title,
        slug,
        description,
        cover_url: coverUrl,
        status,
        sort_order: sortOrder ? Number(sortOrder) : 0,
        featured_episode_id: featuredEpisodeId || null,
      })
      setMsg(res)
      if (res?.ok) {
        setDirty(false)
        if (!show && res.id) router.replace(`/admin/shows/${res.id}`)
      }
    })
  }

  return (
    <div className={s.wrap}>
      <header className={s.head}>
        <div>
          <h1 className={s.h1}>{show ? 'Edit Show' : 'New Show'}</h1>
          <p className={s.sub}>{show ? show.title : 'Create a show, then episodes can be attached to it.'}</p>
        </div>
      </header>

      <div className={s.panel}>
        <section className={s.card}>
          <h2 className={s.cardTitle}>Details</h2>
          <div className={s.row2}>
            <Field label="Title" value={title} onChange={onTitleChange} />
            <Field label="Slug" value={slug} onChange={(v) => { setSlug(slugify(v)); setSlugTouched(true); markDirty() }} placeholder="show-slug" />
          </div>

          <div className={s.row2}>
            <label className={s.field}>
              <span className={s.label}>Status</span>
              <select className={s.input} value={status} onChange={(e) => { setStatus(e.target.value as Status); markDirty() }}>
                {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </label>
            <Field label="Sort order (lower shows first)" value={sortOrder} onChange={(v) => { setSortOrder(v.replace(/[^0-9-]/g, '')); markDirty() }} placeholder="0" />
          </div>

          <Field label="Description" textarea rows={4} value={description} onChange={(v) => { setDescription(v); markDirty() }} />

          {show && (
            <label className={s.field}>
              <span className={s.label}>Featured episode (shown as the play pill on the show page)</span>
              <select
                className={s.input}
                value={featuredEpisodeId}
                onChange={(e) => { setFeaturedEpisodeId(e.target.value); markDirty() }}
              >
                <option value="">Latest episode (automatic)</option>
                {episodes.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    {ep.episode_number != null ? `#${ep.episode_number} — ` : ''}{ep.title}
                  </option>
                ))}
              </select>
            </label>
          )}
        </section>

        <section className={s.card}>
          <h2 className={s.cardTitle}>Cover Art</h2>
          <ImageField label="Show cover" folder="shows" bucket="show-art" value={coverUrl} onChange={(v) => { setCoverUrl(v); markDirty() }} />
        </section>
      </div>

      <div className={s.saveBar}>
        <div className={s.saveStatus}>
          {msg && (
            <span className={msg.ok ? s.ok : s.err}>
              {msg.ok ? <IconCircleCheck size={16} stroke={1.75} /> : <IconAlertTriangle size={16} stroke={1.75} />} {msg.message}
            </span>
          )}
          {!msg && dirty && <span className={s.hintInline}>Unsaved changes</span>}
        </div>
        <button type="button" className={`btn btnSolid ${s.saveBtn}`} onClick={save} disabled={pending || !dirty || !title.trim()}>
          <IconDeviceFloppy size={16} stroke={1.75} /> {pending ? 'Saving\u2026' : 'Save show'}
        </button>
      </div>
    </div>
  )
}