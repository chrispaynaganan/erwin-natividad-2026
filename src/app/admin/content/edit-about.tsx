'use client'

import { useState } from 'react'
import { Field, LinkField, TagsField, LinesField, ItemShell, AddButton, HeadFields, move, type EditorProps } from './fields'
import s from './content.module.css'

type TabKey = 'hero' | 'skills' | 'stats' | 'highlights' | 'philosophy'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'hero', label: 'Hero & Journey' },
  { key: 'skills', label: 'Skills' },
  { key: 'stats', label: 'Milestones' },
  { key: 'highlights', label: 'Career Highlights' },
  { key: 'philosophy', label: 'Philosophy & CTA' },
]

export function EditAbout({ c, edit }: EditorProps) {
  const [tab, setTab] = useState<TabKey>('hero')
  const ab = c.about
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
            <h2 className={s.cardTitle}>Hero & My Journey</h2>
            <div className={s.row2}>
              <Field label="Heading" value={ab.heroTitle} onChange={(v) => edit((d) => { d.about.heroTitle = v })} />
              <Field label="Heading (gold part)" value={ab.heroTitleGold} onChange={(v) => edit((d) => { d.about.heroTitleGold = v })} />
            </div>
            <Field label="Journey section title" value={ab.journeyTitle} onChange={(v) => edit((d) => { d.about.journeyTitle = v })} />
            <LinesField label="Journey paragraphs" rows={10} value={ab.journey} onChange={(v) => edit((d) => { d.about.journey = v })} />
          </section>
        )}

        {tab === 'skills' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Skills & Expertise</h2>
            <HeadFields head={ab.skills} onChange={(h) => edit((d) => { Object.assign(d.about.skills, h) })} />
            <div className={s.items}>
              {ab.skills.groups.map((g, i) => (
                <ItemShell key={i} title={g.title || `Group ${i + 1}`} i={i} count={ab.skills.groups.length}
                  onUp={() => edit((d) => move(d.about.skills.groups, i, -1))}
                  onDown={() => edit((d) => move(d.about.skills.groups, i, 1))}
                  onRemove={() => edit((d) => { d.about.skills.groups.splice(i, 1) })}>
                  <Field label="Group title" value={g.title} onChange={(v) => edit((d) => { d.about.skills.groups[i].title = v })} />
                  <TagsField label="Tags" value={g.tags} onChange={(v) => edit((d) => { d.about.skills.groups[i].tags = v })} />
                </ItemShell>
              ))}
              <AddButton label="Add group" onClick={() => edit((d) => { d.about.skills.groups.push({ title: 'New group', tags: [] }) })} />
            </div>
          </section>
        )}

        {tab === 'stats' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Experiences & Milestones</h2>
            <HeadFields head={ab.stats} onChange={(h) => edit((d) => { Object.assign(d.about.stats, h) })} />
            <div className={s.items}>
              {ab.stats.items.map((st, i) => (
                <ItemShell key={i} title={st.label || `Stat ${i + 1}`} i={i} count={ab.stats.items.length}
                  onUp={() => edit((d) => move(d.about.stats.items, i, -1))}
                  onDown={() => edit((d) => move(d.about.stats.items, i, 1))}
                  onRemove={() => edit((d) => { d.about.stats.items.splice(i, 1) })}>
                  <div className={s.row2}>
                    <Field label="Number" value={st.num} onChange={(v) => edit((d) => { d.about.stats.items[i].num = v })} placeholder="15+" />
                    <Field label="Label" value={st.label} onChange={(v) => edit((d) => { d.about.stats.items[i].label = v })} />
                  </div>
                </ItemShell>
              ))}
              <AddButton label="Add stat" onClick={() => edit((d) => { d.about.stats.items.push({ num: '0', label: 'New stat' }) })} />
            </div>
          </section>
        )}

        {tab === 'highlights' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Career Highlights</h2>
            <Field label="Section title" value={ab.highlightsTitle} onChange={(v) => edit((d) => { d.about.highlightsTitle = v })} />
            <div className={s.items}>
              {ab.highlights.map((h, i) => (
                <ItemShell key={i} title={`${h.year} \u2014 ${h.title}` || `Highlight ${i + 1}`} i={i} count={ab.highlights.length}
                  onUp={() => edit((d) => move(d.about.highlights, i, -1))}
                  onDown={() => edit((d) => move(d.about.highlights, i, 1))}
                  onRemove={() => edit((d) => { d.about.highlights.splice(i, 1) })}>
                  <div className={s.row2}>
                    <Field label="Year" value={h.year} onChange={(v) => edit((d) => { d.about.highlights[i].year = v })} />
                    <Field label="Title" value={h.title} onChange={(v) => edit((d) => { d.about.highlights[i].title = v })} />
                  </div>
                  <Field label="Text" textarea rows={4} value={h.text} onChange={(v) => edit((d) => { d.about.highlights[i].text = v })} />
                </ItemShell>
              ))}
              <AddButton label="Add highlight" onClick={() => edit((d) => { d.about.highlights.push({ year: '2026', title: 'New highlight', text: '' }) })} />
            </div>
          </section>
        )}

        {tab === 'philosophy' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Philosophy & Final CTA</h2>
            <Field label="Philosophy label" value={ab.philosophyLabel} onChange={(v) => edit((d) => { d.about.philosophyLabel = v })} />
            <LinesField label="Philosophy paragraphs" rows={6} value={ab.philosophy} onChange={(v) => edit((d) => { d.about.philosophy = v })} />
            <Field label="CTA heading" textarea rows={2} value={ab.finalCta.title} onChange={(v) => edit((d) => { d.about.finalCta.title = v })} />
            <Field label="CTA text" textarea rows={2} value={ab.finalCta.body} onChange={(v) => edit((d) => { d.about.finalCta.body = v })} />
            <LinkField label="Primary button" value={ab.finalCta.primary} onChange={(v) => edit((d) => { d.about.finalCta.primary = v })} />
            <LinkField label="Secondary button" value={ab.finalCta.secondary} onChange={(v) => edit((d) => { d.about.finalCta.secondary = v })} />
          </section>
        )}
      </div>
    </>
  )
}