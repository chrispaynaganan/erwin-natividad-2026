'use client'

import { useState } from 'react'
import { Field, LinkField, FaqListEditor, type EditorProps } from './fields'
import s from './content.module.css'

type TabKey = 'hero' | 'general' | 'projects' | 'booking' | 'cta'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'general', label: 'General' },
  { key: 'projects', label: 'Projects & Delivery' },
  { key: 'booking', label: 'Booking & Payment' },
  { key: 'cta', label: 'Final CTA' },
]

export function EditFaq({ c, edit }: EditorProps) {
  const [tab, setTab] = useState<TabKey>('hero')
  const f = c.faq

  const group = (key: 'general' | 'projects' | 'booking') => (
    <section className={s.card}>
      <h2 className={s.cardTitle}>{f[key].title || 'Section'}</h2>
      <div className={s.row2}>
        <Field label="Section title" value={f[key].title} onChange={(v) => edit((d) => { d.faq[key].title = v })} />
        <Field label="Section subtitle" value={f[key].sub} onChange={(v) => edit((d) => { d.faq[key].sub = v })} />
      </div>
      <FaqListEditor items={f[key].items} onChange={(items) => edit((d) => { d.faq[key].items = items })} />
    </section>
  )

  return (
    <>
      <nav className={s.tabs}>
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={tab === t.key ? `${s.tab} ${s.tabActive}` : s.tab}>{t.label}</button>
        ))}
      </nav>

      <div className={s.panel}>
        {tab === 'hero' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Hero</h2>
            <div className={s.row2}>
              <Field label="Heading" value={f.hero.title} onChange={(v) => edit((d) => { d.faq.hero.title = v })} />
              <Field label="Heading (gold part)" value={f.hero.titleGold} onChange={(v) => edit((d) => { d.faq.hero.titleGold = v })} />
            </div>
            <Field label="Intro paragraph" textarea value={f.hero.body} onChange={(v) => edit((d) => { d.faq.hero.body = v })} />
          </section>
        )}

        {tab === 'general' && group('general')}
        {tab === 'projects' && group('projects')}
        {tab === 'booking' && group('booking')}

        {tab === 'cta' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Final CTA</h2>
            <div className={s.row2}>
              <Field label="Heading" value={f.finalCta.title} onChange={(v) => edit((d) => { d.faq.finalCta.title = v })} />
              <Field label="Heading (gold part)" value={f.finalCta.titleGold} onChange={(v) => edit((d) => { d.faq.finalCta.titleGold = v })} />
            </div>
            <Field label="Text" value={f.finalCta.body} onChange={(v) => edit((d) => { d.faq.finalCta.body = v })} />
            <LinkField label="Button" value={f.finalCta.button} onChange={(v) => edit((d) => { d.faq.finalCta.button = v })} />
          </section>
        )}
      </div>
    </>
  )
}