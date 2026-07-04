'use client'

import { useState, useTransition } from 'react'
import { IconDeviceFloppy, IconExternalLink, IconCircleCheck, IconAlertTriangle } from '@tabler/icons-react'
import { saveSiteContent, type SaveState } from './actions'
import type { SiteContent } from '@/lib/content/site-content'
import { Field } from './fields'
import { EditHome } from './edit-home'
import { EditServices } from './edit-services'
import { EditAbout } from './edit-about'
import { EditContact } from './edit-contact'
import { EditFaq } from './edit-faq'
import { EditNav } from './edit-nav'
import s from './content.module.css'

type PageKey = 'home' | 'services' | 'about' | 'contact' | 'faq' | 'blog' | 'nav'
const PAGES: { key: PageKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'services', label: 'Services' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'faq', label: 'FAQ' },
  { key: 'blog', label: 'Blog' },
  { key: 'nav', label: 'Navigation' },
]

export function ContentEditor({ initial }: { initial: SiteContent }) {
  const [c, setC] = useState<SiteContent>(initial)
  const [page, setPage] = useState<PageKey>('home')
  const [dirty, setDirty] = useState(false)
  const [msg, setMsg] = useState<SaveState>(null)
  const [pending, start] = useTransition()

  // Immutable editor: clone, mutate the draft, store.
  function edit(mut: (d: SiteContent) => void) {
    setC((prev) => { const next = structuredClone(prev); mut(next); return next })
    setDirty(true); setMsg(null)
  }

  function save() {
    start(async () => {
      const res = await saveSiteContent(c)
      setMsg(res)
      if (res?.ok) setDirty(false)
    })
  }

  return (
    <div className={s.wrap}>
      <header className={s.head}>
        <div>
          <h1 className={s.h1}>Content</h1>
          <p className={s.sub}>Every page of the site is editable here. Pick a page, then a section. Changes go live when you save.</p>
        </div>
        <a className={s.viewLink} href="/" target="_blank" rel="noreferrer">View site <IconExternalLink size={15} stroke={1.75} /></a>
      </header>

      <nav className={s.pageTabs} aria-label="Pages">
        {PAGES.map((p) => (
          <button key={p.key} type="button" onClick={() => setPage(p.key)}
            className={page === p.key ? `${s.pageTab} ${s.pageTabActive}` : s.pageTab}>{p.label}</button>
        ))}
      </nav>

      {page === 'home' && <EditHome c={c} edit={edit} />}
      {page === 'services' && <EditServices c={c} edit={edit} />}
      {page === 'about' && <EditAbout c={c} edit={edit} />}
      {page === 'contact' && <EditContact c={c} edit={edit} />}
      {page === 'faq' && <EditFaq c={c} edit={edit} />}
      {page === 'nav' && <EditNav c={c} edit={edit} />}

      {page === 'blog' && (
        <div className={s.panel}>
          <section className={s.card}>
            <h2 className={s.cardTitle}>Blog — Hero</h2>
            <p className={s.hint}>The heading and intro of the blog listing page. Posts themselves are managed under Blog in the sidebar (coming soon).</p>
            <div className={s.row2}>
              <Field label="Heading" value={c.blog.hero.title} onChange={(v) => edit((d) => { d.blog.hero.title = v })} />
              <Field label="Heading (gold part)" value={c.blog.hero.titleGold} onChange={(v) => edit((d) => { d.blog.hero.titleGold = v })} />
            </div>
            <Field label="Intro paragraph" textarea value={c.blog.hero.body} onChange={(v) => edit((d) => { d.blog.hero.body = v })} />
          </section>
        </div>
      )}

      {/* sticky save bar */}
      <div className={s.saveBar}>
        <div className={s.saveStatus}>
          {msg && (
            <span className={msg.ok ? s.ok : s.err}>
              {msg.ok ? <IconCircleCheck size={16} stroke={1.75} /> : <IconAlertTriangle size={16} stroke={1.75} />} {msg.message}
            </span>
          )}
          {!msg && dirty && <span className={s.hintInline}>Unsaved changes</span>}
        </div>
        <button type="button" className={`btn btnSolid ${s.saveBtn}`} onClick={save} disabled={pending || !dirty}>
          <IconDeviceFloppy size={16} stroke={1.75} /> {pending ? 'Saving\u2026' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}