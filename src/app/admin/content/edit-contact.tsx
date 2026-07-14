'use client'

import { useState } from 'react'
import { Field, ItemShell, AddButton, HeadFields, FaqListEditor, move, type EditorProps } from './fields'
import { SeoEditor } from './seo-editor'
import { SITE_URL } from '@/lib/site-url'
import s from './content.module.css'

type TabKey = 'hero' | 'expect' | 'direct' | 'faqs' | 'seo'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'expect', label: 'What to Expect' },
  { key: 'direct', label: 'Direct Contact' },
  { key: 'faqs', label: 'Quick Answers' },
  { key: 'seo', label: 'SEO' },
]

export function EditContact({ c, edit }: EditorProps) {
  const [tab, setTab] = useState<TabKey>('hero')
  const ct = c.contact
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
              <Field label="Heading" value={ct.hero.title} onChange={(v) => edit((d) => { d.contact.hero.title = v })} />
              <Field label="Heading (gold part)" value={ct.hero.titleGold} onChange={(v) => edit((d) => { d.contact.hero.titleGold = v })} />
            </div>
            <Field label="Intro paragraph" textarea value={ct.hero.body} onChange={(v) => edit((d) => { d.contact.hero.body = v })} />
          </section>
        )}

        {tab === 'expect' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>What to Expect</h2>
            <Field label="Card title" value={ct.expect.title} onChange={(v) => edit((d) => { d.contact.expect.title = v })} />
            <div className={s.items}>
              {ct.expect.items.map((it, i) => (
                <ItemShell key={i} title={it.t || `Item ${i + 1}`} i={i} count={ct.expect.items.length}
                  onUp={() => edit((d) => move(d.contact.expect.items, i, -1))}
                  onDown={() => edit((d) => move(d.contact.expect.items, i, 1))}
                  onRemove={() => edit((d) => { d.contact.expect.items.splice(i, 1) })}>
                  <div className={s.row2}>
                    <Field label="Lead (bold part)" value={it.t} onChange={(v) => edit((d) => { d.contact.expect.items[i].t = v })} placeholder="Response time:" />
                    <Field label="Text" value={it.d} onChange={(v) => edit((d) => { d.contact.expect.items[i].d = v })} />
                  </div>
                </ItemShell>
              ))}
              <AddButton label="Add item" onClick={() => edit((d) => { d.contact.expect.items.push({ t: 'New item:', d: '' }) })} />
            </div>
          </section>
        )}

        {tab === 'direct' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Direct Contact</h2>
            <p className={s.hint}>These appear in the card next to the contact form. Make sure the email matches the inbox Erwin actually checks.</p>
            <Field label="Card title" value={ct.direct.title} onChange={(v) => edit((d) => { d.contact.direct.title = v })} />
            <div className={s.row2}>
              <Field label="Email" value={ct.direct.email} onChange={(v) => edit((d) => { d.contact.direct.email = v })} />
              <Field label="Phone" value={ct.direct.phone} onChange={(v) => edit((d) => { d.contact.direct.phone = v })} />
            </div>
            <div className={s.row2}>
              <Field label="Location" value={ct.direct.location} onChange={(v) => edit((d) => { d.contact.direct.location = v })} placeholder="Remote" />
              <Field label="Socials label" value={ct.direct.socialLabel} onChange={(v) => edit((d) => { d.contact.direct.socialLabel = v })} />
            </div>
          </section>
        )}

        {tab === 'faqs' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Quick Answers</h2>
            <HeadFields head={ct.faqs} onChange={(h) => edit((d) => { Object.assign(d.contact.faqs, h) })} />
            <FaqListEditor items={ct.faqs.items} onChange={(items) => edit((d) => { d.contact.faqs.items = items })} />
          </section>
        )}

        {tab === 'seo' && (
          <SeoEditor
            value={ct.seo}
            onChange={(v) => edit((d) => { d.contact.seo = v })}
            pageUrl={`${SITE_URL}/contact`}
            fallbackTitle={`${ct.hero.title}${ct.hero.titleGold}`}
            fallbackDescription={ct.hero.body}
            folder="seo-contact"
          />
        )}
      </div>
    </>
  )
}