'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { IconDeviceFloppy, IconCircleCheck, IconAlertTriangle } from '@tabler/icons-react'
import { Field } from '@/app/admin/content/fields'
import { ImageField } from '@/components/admin/image-field'
import { AudioField, type AudioValue } from '@/components/admin/audio-field'
import { saveEpisode, type SaveState } from '../actions'
import type { Episode, Show } from '@/lib/episodes/store'
import s from '@/app/admin/content/content.module.css'

const STATUSES = ['draft', 'scheduled', 'published', 'archived'] as const
type Status = (typeof STATUSES)[number]

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function EpisodeForm({ episode, shows }: { episode: Episode | null; shows: Show[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<SaveState>(null)
  const [dirty, setDirty] = useState(false)

  const [showId, setShowId] = useState(episode?.show_id ?? shows[0]?.id ?? '')
  const [title, setTitle] = useState(episode?.title ?? '')
  const [slug, setSlug] = useState(episode?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!episode)
  const [description, setDescription] = useState(episode?.description ?? '')
  const [showNotes, setShowNotes] = useState(episode?.show_notes ?? '')
  const [transcript, setTranscript] = useState(episode?.transcript ?? '')
  const [coverUrl, setCoverUrl] = useState(episode?.cover_url ?? '')
  const [audio, setAudio] = useState<AudioValue | null>(
    episode?.audio_path
      ? { path: episode.audio_path, durationSecs: episode.duration_secs ?? 0, fileName: episode.audio_path.split('/').pop() ?? 'audio.m4a' }
      : null
  )
  const [episodeNumber, setEpisodeNumber] = useState(episode?.episode_number?.toString() ?? '')
  const [season, setSeason] = useState(episode?.season?.toString() ?? '')
  const [isPremium, setIsPremium] = useState(episode?.is_premium ?? false)
  const [status, setStatus] = useState<Status>((episode?.status as Status) ?? 'draft')

  function markDirty() { setDirty(true); setMsg(null) }

  function onTitleChange(v: string) {
    setTitle(v)
    markDirty()
    if (!slugTouched) setSlug(slugify(v))
  }

  function save() {
    start(async () => {
      const res = await saveEpisode({
        id: episode?.id,
        show_id: showId,
        title,
        slug,
        description,
        show_notes: showNotes,
        transcript,
        audio_path: audio?.path ?? null,
        duration_secs: audio?.durationSecs ?? null,
        episode_number: episodeNumber ? Number(episodeNumber) : null,
        season: season ? Number(season) : null,
        cover_url: coverUrl,
        is_premium: isPremium,
        status,
        published_at: episode?.published_at ?? null,
      })
      setMsg(res)
      if (res?.ok) {
        setDirty(false)
        if (!episode && res.id) router.replace(`/admin/episodes/${res.id}`)
      }
    })
  }

  return (
    <div className={s.wrap}>
      <header className={s.head}>
        <div>
          <h1 className={s.h1}>{episode ? 'Edit Episode' : 'New Episode'}</h1>
          <p className={s.sub}>{episode ? episode.title : 'Fill in the details, then save as a draft or publish.'}</p>
        </div>
      </header>

      <div className={s.panel}>
        <section className={s.card}>
          <h2 className={s.cardTitle}>Details</h2>
          <div className={s.row2}>
            <label className={s.field}>
              <span className={s.label}>Show</span>
              <select className={s.input} value={showId} onChange={(e) => { setShowId(e.target.value); markDirty() }}>
                {shows.length === 0 && <option value="">No shows yet</option>}
                {shows.map((sh) => <option key={sh.id} value={sh.id}>{sh.title}</option>)}
              </select>
            </label>
            <label className={s.field}>
              <span className={s.label}>Status</span>
              <select className={s.input} value={status} onChange={(e) => { setStatus(e.target.value as Status); markDirty() }}>
                {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
              </select>
            </label>
          </div>

          <Field label="Title" value={title} onChange={onTitleChange} />
          <Field label="Slug" value={slug} onChange={(v) => { setSlug(slugify(v)); setSlugTouched(true); markDirty() }} placeholder="episode-slug" />

          <div className={s.row2}>
            <Field label="Season" value={season} onChange={(v) => { setSeason(v.replace(/[^0-9]/g, '')); markDirty() }} placeholder="1" />
            <Field label="Episode number" value={episodeNumber} onChange={(v) => { setEpisodeNumber(v.replace(/[^0-9]/g, '')); markDirty() }} placeholder="1" />
          </div>

          <Field label="Description" textarea rows={3} value={description} onChange={(v) => { setDescription(v); markDirty() }} />

          <label className={s.field} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={isPremium} onChange={(e) => { setIsPremium(e.target.checked); markDirty() }} />
            <span className={s.label} style={{ margin: 0 }}>Premium (requires an active membership to play)</span>
          </label>
        </section>

        <section className={s.card}>
          <h2 className={s.cardTitle}>Audio & Cover Art</h2>
          <AudioField label="Episode audio" value={audio} onChange={(v) => { setAudio(v); markDirty() }} />
          <ImageField label="Cover art" folder="episodes" bucket="episode-art" value={coverUrl} onChange={(v) => { setCoverUrl(v); markDirty() }} />
        </section>

        <section className={s.card}>
          <h2 className={s.cardTitle}>Show Notes & Transcript</h2>
          <Field label="Show notes" textarea rows={6} value={showNotes} onChange={(v) => { setShowNotes(v); markDirty() }} />
          <Field label="Transcript" textarea rows={10} value={transcript} onChange={(v) => { setTranscript(v); markDirty() }} />
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
        <button type="button" className={`btn btnSolid ${s.saveBtn}`} onClick={save} disabled={pending || !dirty || !showId}>
          <IconDeviceFloppy size={16} stroke={1.75} /> {pending ? 'Saving\u2026' : 'Save episode'}
        </button>
      </div>
    </div>
  )
}