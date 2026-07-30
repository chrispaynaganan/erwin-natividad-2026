'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconDeviceFloppy, IconCircleCheck, IconAlertTriangle, IconArrowLeft } from '@tabler/icons-react'
import { Field, TagsField, LinesField } from '@/app/admin/content/fields'
import { TabRow } from '@/app/admin/content/section-tabs'
import { ImageField } from '@/components/admin/image-field'
import { AudioField, type AudioValue } from '@/components/admin/audio-field'
import { saveProject, type SaveState } from '../actions'
import type { ProjectRow } from '@/lib/projects-db/store'
import s from '@/app/admin/content/content.module.css'
import p from '../projects.module.css'

const STATUSES = ['draft', 'scheduled', 'published', 'archived'] as const
type Status = (typeof STATUSES)[number]

type TabKey = 'listing' | 'media' | 'detail'

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function ProjectForm({ project }: { project: ProjectRow | null }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<SaveState>(null)
  const [dirty, setDirty] = useState(false)
  const [tab, setTab] = useState<TabKey>('listing')

  const [title, setTitle] = useState(project?.title ?? '')
  const [slug, setSlug] = useState(project?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!project)
  const [tags, setTags] = useState<string[]>(project?.tags ?? [])
  const [description, setDescription] = useState(project?.description ?? '')
  const [paragraphs, setParagraphs] = useState<string[]>(project?.paragraphs ?? [])
  const [dateLabel, setDateLabel] = useState(project?.date_label ?? '')
  const [coverUrl, setCoverUrl] = useState(project?.cover_url ?? '')
  const [audio, setAudio] = useState<AudioValue | null>(
    project?.audio_url
      ? { path: '', url: project.audio_url, durationSecs: project.duration_secs ?? 0, fileName: project.audio_url.split('/').pop() ?? 'demo.m4a' }
      : null
  )
  // Plain text field — accepts either a bare YouTube video ID or a full
  // youtube.com/youtu.be URL. saveProject() normalizes it down to just the
  // ID before it's stored, so what's saved is always embed-ready.
  const [videoId, setVideoId] = useState(project?.video_id ?? '')
  const [client, setClient] = useState(project?.client ?? '')
  const [studio, setStudio] = useState(project?.studio ?? '')
  const [lengthLabel, setLengthLabel] = useState(project?.length_label ?? '')
  const [ageRange, setAgeRange] = useState(project?.age_range ?? '')
  const [voiceCharacter, setVoiceCharacter] = useState(project?.voice_character ?? '')
  const [genre, setGenre] = useState(project?.genre ?? '')
  const [deliverables, setDeliverables] = useState(project?.deliverables ?? '')
  const [isFeatured, setIsFeatured] = useState(project?.is_featured ?? false)
  // Hero spotlight. Only one project across the site can hold this; checking it
  // tells saveProject to atomically clear whichever project has it now.
  const [isHero, setIsHero] = useState(project?.is_hero ?? false)
  const [status, setStatus] = useState<Status>((project?.status as Status) ?? 'draft')
  const [sortOrder, setSortOrder] = useState(project?.sort_order?.toString() ?? '0')

  function markDirty() { setDirty(true); setMsg(null) }

  function onTitleChange(v: string) {
    setTitle(v)
    markDirty()
    if (!slugTouched) setSlug(slugify(v))
  }

  function leave(href: string) {
    if (dirty && !confirm('You have unsaved changes. Leave without saving?')) return
    router.push(href)
  }

  // Tabs can hide whatever is blocking a save, so each reports its own state.
  const listingHealth = !title.trim() || !slug.trim() ? 'error' : 'ok'
  const mediaHealth = status === 'published' && !audio ? 'attention' : 'ok'

  function save() {
    start(async () => {
      const res = await saveProject({
        id: project?.id,
        title,
        slug,
        tags,
        description,
        paragraphs,
        date_label: dateLabel,
        audio_url: audio?.url ?? null,
        video_id: videoId || null,
        duration_secs: audio?.durationSecs ?? null,
        cover_url: coverUrl,
        client,
        studio,
        length_label: lengthLabel,
        age_range: ageRange,
        voice_character: voiceCharacter,
        genre,
        deliverables,
        is_featured: isFeatured,
        is_hero: isHero,
        status,
        sort_order: sortOrder ? Number(sortOrder) : 0,
      })
      setMsg(res)
      if (res?.ok) {
        setDirty(false)
        if (!project && res.id) router.replace(`/admin/projects/${res.id}`)
      }
    })
  }

  return (
    <div className={s.wrap}>
      <nav className={p.crumbs} aria-label="Breadcrumb">
        <Link href="/admin/projects" className={p.crumbLink}>Projects</Link>
        <span className={p.crumbSep} aria-hidden>/</span>
        <span className={p.crumbCurrent}>{project ? project.title : 'New project'}</span>
      </nav>

      <header className={s.head}>
        <div>
          <h1 className={s.h1}>{project ? 'Edit Project' : 'New Project'}</h1>
          <p className={s.sub}>{project ? project.title : 'A work sample shown on /work, with its own detail page.'}</p>
        </div>
        <button type="button" className={p.backLink} onClick={() => leave('/admin/projects')}>
          <IconArrowLeft size={15} stroke={1.8} /> Back to Projects
        </button>
      </header>

      <TabRow
        groupLabel="Section"
        variant="section"
        active={tab}
        onSelect={(k) => setTab(k as TabKey)}
        tabs={[
          { key: 'listing', label: 'Card & Listing', health: listingHealth },
          { key: 'media', label: 'Demo Audio, Video & Cover Art', health: mediaHealth },
          { key: 'detail', label: 'Project Detail Page' },
        ]}
      />

      <div className={s.panel}>
        {tab === 'listing' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Card &amp; Listing</h2>
            <div className={s.row2}>
              <Field label="Title" value={title} onChange={onTitleChange} />
              <Field label="Slug" value={slug} onChange={(v) => { setSlug(slugify(v)); setSlugTouched(true); markDirty() }} placeholder="project-slug" />
            </div>

            <TagsField label="Tags" value={tags} onChange={(v) => { setTags(v); markDirty() }} />
            <Field label="Short description (shown on the card)" textarea rows={2} value={description} onChange={(v) => { setDescription(v); markDirty() }} />

            <div className={s.row2}>
              <Field label="Date (shown on card, and as “Completed” on the detail page)" value={dateLabel} onChange={(v) => { setDateLabel(v); markDirty() }} placeholder="March 2026" />
              <Field label="Sort order (lower shows first)" value={sortOrder} onChange={(v) => { setSortOrder(v.replace(/[^0-9-]/g, '')); markDirty() }} placeholder="0" />
            </div>

            <div className={s.row2}>
              <label className={s.field}>
                <span className={s.label}>Status</span>
                <select className={s.input} value={status} onChange={(e) => { setStatus(e.target.value as Status); markDirty() }}>
                  {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </label>
              <label className={s.field} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
                <input type="checkbox" checked={isFeatured} onChange={(e) => { setIsFeatured(e.target.checked); markDirty() }} />
                <span className={s.label} style={{ margin: 0 }}>
                  Featured on homepage
                  <span style={{ display: 'block', fontWeight: 400, opacity: 0.7 }}>
                    Up to 3 featured projects appear, ordered by sort order.
                  </span>
                </span>
              </label>
            </div>

            <label className={s.field} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={isHero} onChange={(e) => { setIsHero(e.target.checked); markDirty() }} />
              <span className={s.label} style={{ margin: 0 }}>
                Use as Hero spotlight
                <span style={{ display: 'block', fontWeight: 400, opacity: 0.7 }}>
                  Only one project can be the Hero at a time — enabling this replaces whichever project currently is.
                </span>
              </span>
            </label>
          </section>
        )}

        {tab === 'media' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Demo Audio, Video &amp; Cover Art</h2>
            {mediaHealth === 'attention' && (
              <p className={s.hint} style={{ color: '#C2620F' }}>
                This project is published with no demo audio, so its card will have no player.
              </p>
            )}
            <AudioField label="Demo audio" folder="projects" bucket="project-audio" value={audio} onChange={(v) => { setAudio(v); markDirty() }}
              hint="Public demo audio — converted to AAC (.m4a) in your browser before upload, then playable by anyone." />
            <ImageField label="Cover art" folder="projects" bucket="site-media" value={coverUrl} onChange={(v) => { setCoverUrl(v); markDirty() }} />
            <Field
              label="YouTube video (optional)"
              value={videoId}
              onChange={(v) => { setVideoId(v); markDirty() }}
              placeholder="https://youtube.com/watch?v=... or just the video ID"
            />
            <p className={s.hint}>
              Paste the full YouTube link or just the video ID — either works. Set the video to
              “Unlisted” on YouTube so it only shows up here, not on your channel or in search.
              Leave blank if this project has no video.
            </p>
          </section>
        )}

        {tab === 'detail' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Project Detail Page</h2>
            <p className={s.hint}>Shown on the full project page at /work/{slug || 'your-slug'}.</p>
            <LinesField label="Body paragraphs" rows={8} value={paragraphs} onChange={(v) => { setParagraphs(v); markDirty() }} />

            <div className={s.row2}>
              <Field label="Client" value={client} onChange={(v) => { setClient(v); markDirty() }} />
              <Field label="Recording studio" value={studio} onChange={(v) => { setStudio(v); markDirty() }} />
            </div>
            <div className={s.row2}>
              <Field label="Length (descriptive, e.g. “9 hours total”)" value={lengthLabel} onChange={(v) => { setLengthLabel(v); markDirty() }} />
              <Field label="Age range" value={ageRange} onChange={(v) => { setAgeRange(v); markDirty() }} placeholder="25-45" />
            </div>
            <div className={s.row2}>
              <Field label="Character" value={voiceCharacter} onChange={(v) => { setVoiceCharacter(v); markDirty() }} placeholder="Energetic, Upbeat" />
              <Field label="Genre" value={genre} onChange={(v) => { setGenre(v); markDirty() }} />
            </div>
            <Field label="Deliverables" value={deliverables} onChange={(v) => { setDeliverables(v); markDirty() }} placeholder="WAV, MP3, Broadcast Quality" />
          </section>
        )}
      </div>

      <div className={s.saveBar}>
        <div className={s.saveStatus}>
          {msg && (
            <span className={msg.ok ? s.ok : s.err}>
              {msg.ok ? <IconCircleCheck size={16} stroke={1.75} /> : <IconAlertTriangle size={16} stroke={1.75} />} {msg.message}
            </span>
          )}
          {!msg && dirty && <span className={s.hintInline}>Unsaved changes</span>}
          {!msg && !dirty && listingHealth === 'error' && (
            <span className={s.hintInline}>Title and slug are required</span>
          )}
        </div>
        <button type="button" className={`btn btnSolid ${s.saveBtn}`} onClick={save} disabled={pending || !dirty || !title.trim()}>
          <IconDeviceFloppy size={16} stroke={1.75} /> {pending ? 'Saving…' : 'Save project'}
        </button>
      </div>
    </div>
  )
}