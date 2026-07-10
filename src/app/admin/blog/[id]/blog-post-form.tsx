'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { IconDeviceFloppy, IconCircleCheck, IconAlertTriangle } from '@tabler/icons-react'
import { Field } from '@/app/admin/content/fields'
import { ImageField } from '@/components/admin/image-field'
import { saveBlogPost, type SaveState } from '../actions'
import type { BlogPostRow } from '@/lib/blog-db/store'
import s from '@/app/admin/content/content.module.css'

const STATUSES = ['draft', 'scheduled', 'published', 'archived'] as const
type Status = (typeof STATUSES)[number]

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function BlogPostForm({ post }: { post: BlogPostRow | null }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<SaveState>(null)
  const [dirty, setDirty] = useState(false)

  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!post)
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [body, setBody] = useState(post?.body ?? '')
  const [coverUrl, setCoverUrl] = useState(post?.cover_url ?? '')
  const [status, setStatus] = useState<Status>((post?.status as Status) ?? 'draft')

  function markDirty() { setDirty(true); setMsg(null) }

  function onTitleChange(v: string) {
    setTitle(v)
    markDirty()
    if (!slugTouched) setSlug(slugify(v))
  }

  function save() {
    start(async () => {
      const res = await saveBlogPost({
        id: post?.id,
        title,
        slug,
        excerpt,
        body,
        cover_url: coverUrl,
        status,
      })
      setMsg(res)
      if (res?.ok) {
        setDirty(false)
        if (!post && res.id) router.replace(`/admin/blog/${res.id}`)
      }
    })
  }

  return (
    <div className={s.wrap}>
      <header className={s.head}>
        <div>
          <h1 className={s.h1}>{post ? 'Edit Post' : 'New Post'}</h1>
          <p className={s.sub}>{post ? post.title : 'A blog post shown on /blog, with its own page.'}</p>
        </div>
      </header>

      <div className={s.panel}>
        <section className={s.card}>
          <h2 className={s.cardTitle}>Post</h2>
          <div className={s.row2}>
            <Field label="Title" value={title} onChange={onTitleChange} />
            <Field label="Slug" value={slug} onChange={(v) => { setSlug(slugify(v)); setSlugTouched(true); markDirty() }} placeholder="post-slug" />
          </div>
          <Field label="Excerpt (shown on the blog listing card)" textarea rows={2} value={excerpt} onChange={(v) => { setExcerpt(v); markDirty() }} />

          <label className={s.field}>
            <span className={s.label}>Status</span>
            <select className={s.input} value={status} onChange={(e) => { setStatus(e.target.value as Status); markDirty() }}>
              {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
            </select>
          </label>
        </section>

        <section className={s.card}>
          <h2 className={s.cardTitle}>Cover Image</h2>
          <ImageField label="Cover image" folder="blog" value={coverUrl} onChange={(v) => { setCoverUrl(v); markDirty() }} />
        </section>

        <section className={s.card}>
          <h2 className={s.cardTitle}>Body</h2>
          <p className={s.hint}>Shown on the full post page at /blog/{slug || 'your-slug'}. Plain text for now \u2014 flag if this should support markdown/rich text instead.</p>
          <Field label="Post body" textarea rows={16} value={body} onChange={(v) => { setBody(v); markDirty() }} />
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
          <IconDeviceFloppy size={16} stroke={1.75} /> {pending ? 'Saving\u2026' : 'Save post'}
        </button>
      </div>
    </div>
  )
}