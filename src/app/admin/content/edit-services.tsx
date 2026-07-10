'use client'

import { useState } from 'react'
import type { BreakdownItem, PricingTier } from '@/lib/content/site-content'
import { Field, TagsField, LinesField, ItemShell, AddButton, HeadFields, FaqListEditor, move, type EditorProps } from './fields'
import { InclusionsField } from './inclusions-field'
import s from './content.module.css'

type TabKey = 'hero' | 'breakdown' | 'pricing' | 'how' | 'faqs'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'breakdown', label: 'Services Breakdown' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'how', label: 'How It Works' },
  { key: 'faqs', label: 'Quick Answers' },
]

const blankBreakdown = (): BreakdownItem => ({ title: 'New service', tags: [], desc: '', who: '', turnaround: '', includes: [] })
const blankTier = (): PricingTier => ({ name: 'New package', badge: '', featured: false, pricePrefix: 'From', discountPercent: 0, desc: '', listLabel: 'Includes:', list: [], cta: 'Book' })

export function EditServices({ c, edit }: EditorProps) {
  const [tab, setTab] = useState<TabKey>('hero')
  const sv = c.services
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
              <Field label="Heading (line 1)" value={sv.hero.title} onChange={(v) => edit((d) => { d.services.hero.title = v })} />
              <Field label="Heading (gold line)" value={sv.hero.titleGold} onChange={(v) => edit((d) => { d.services.hero.titleGold = v })} />
            </div>
            <Field label="Intro paragraph" textarea rows={4} value={sv.hero.body} onChange={(v) => edit((d) => { d.services.hero.body = v })} />
          </section>
        )}

        {tab === 'breakdown' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Services Breakdown</h2>
            <HeadFields head={sv.breakdown} onChange={(h) => edit((d) => { Object.assign(d.services.breakdown, h) })} />
            <div className={s.items}>
              {sv.breakdown.items.map((it, i) => (
                <ItemShell key={i} title={it.title || `Service ${i + 1}`} i={i} count={sv.breakdown.items.length}
                  onUp={() => edit((d) => move(d.services.breakdown.items, i, -1))}
                  onDown={() => edit((d) => move(d.services.breakdown.items, i, 1))}
                  onRemove={() => edit((d) => { d.services.breakdown.items.splice(i, 1) })}>
                  <Field label="Title" value={it.title} onChange={(v) => edit((d) => { d.services.breakdown.items[i].title = v })} />
                  <TagsField label="Tag pills" value={it.tags} onChange={(v) => edit((d) => { d.services.breakdown.items[i].tags = v })} />
                  <Field label="Description" textarea value={it.desc} onChange={(v) => edit((d) => { d.services.breakdown.items[i].desc = v })} />
                  <div className={s.row2}>
                    <Field label={'Who it\u2019s for'} textarea rows={2} value={it.who} onChange={(v) => edit((d) => { d.services.breakdown.items[i].who = v })} />
                    <Field label="Turnaround time" value={it.turnaround} onChange={(v) => edit((d) => { d.services.breakdown.items[i].turnaround = v })} />
                  </div>
                  <LinesField label={'What\u2019s included'} value={it.includes} onChange={(v) => edit((d) => { d.services.breakdown.items[i].includes = v })} />
                </ItemShell>
              ))}
              <AddButton label="Add service" onClick={() => edit((d) => { d.services.breakdown.items.push(blankBreakdown()) })} />
            </div>
          </section>
        )}

        {tab === 'pricing' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Pricing Packages</h2>
            <HeadFields head={sv.pricing} onChange={(h) => edit((d) => { Object.assign(d.services.pricing, h) })} />
            <div className={s.items}>
              {sv.pricing.items.map((it, i) => {
                const subtotal = it.list.reduce((sum, item) => sum + (item.price || 0), 0)
                const total = it.discountPercent > 0 ? subtotal * (1 - it.discountPercent / 100) : subtotal
                return (
                  <ItemShell key={i} title={it.name || `Package ${i + 1}`} i={i} count={sv.pricing.items.length}
                    onUp={() => edit((d) => move(d.services.pricing.items, i, -1))}
                    onDown={() => edit((d) => move(d.services.pricing.items, i, 1))}
                    onRemove={() => edit((d) => { d.services.pricing.items.splice(i, 1) })}>
                    <div className={s.row2}>
                      <Field label="Name" value={it.name} onChange={(v) => edit((d) => { d.services.pricing.items[i].name = v })} />
                      <Field label="Badge" value={it.badge} onChange={(v) => edit((d) => { d.services.pricing.items[i].badge = v })} placeholder="Most Popular" />
                    </div>
                    <div className={s.row2}>
                      <Field label="Price prefix (small label above price)" value={it.pricePrefix} onChange={(v) => edit((d) => { d.services.pricing.items[i].pricePrefix = v })} placeholder="From" />
                      <Field label="Discount % (0 = no discount shown)" value={String(it.discountPercent)} onChange={(v) => edit((d) => { d.services.pricing.items[i].discountPercent = Number(v.replace(/[^0-9.]/g, '')) || 0 })} placeholder="10" />
                    </div>
                    <Field label="Short description" value={it.desc} onChange={(v) => edit((d) => { d.services.pricing.items[i].desc = v })} />
                    <Field label="List label" value={it.listLabel} onChange={(v) => edit((d) => { d.services.pricing.items[i].listLabel = v })} placeholder="Basic package includes:" />
                    <InclusionsField label="Included items & prices" value={it.list} onChange={(v) => edit((d) => { d.services.pricing.items[i].list = v })} />
                    <p className={s.hint}>
                      Computed price shown on the card: <strong>${Number.isInteger(total) ? total : total.toFixed(2)}</strong>
                      {it.discountPercent > 0 ? ` (from a $${Number.isInteger(subtotal) ? subtotal : subtotal.toFixed(2)} subtotal, ${it.discountPercent}% off)` : ''}
                    </p>
                    <div className={s.row2}>
                      <Field label="Button text" value={it.cta} onChange={(v) => edit((d) => { d.services.pricing.items[i].cta = v })} />
                      <label className={s.field}>
                        <span className={s.label}>Highlighted card</span>
                        <select className={s.input} value={it.featured ? 'yes' : 'no'}
                          onChange={(e) => edit((d) => { d.services.pricing.items[i].featured = e.target.value === 'yes' })}>
                          <option value="no">No</option>
                          <option value="yes">Yes (gold outline)</option>
                        </select>
                      </label>
                    </div>
                  </ItemShell>
                )
              })}
              <AddButton label="Add package" onClick={() => edit((d) => { d.services.pricing.items.push(blankTier()) })} />
            </div>
            <Field label="Footnote under pricing" textarea rows={2} value={sv.pricing.footnote} onChange={(v) => edit((d) => { d.services.pricing.footnote = v })} />
          </section>
        )}

        {tab === 'how' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>How It Works</h2>
            <HeadFields head={sv.how} onChange={(h) => edit((d) => { Object.assign(d.services.how, h) })} />
            <div className={s.items}>
              {sv.how.steps.map((st, i) => (
                <ItemShell key={i} title={st.title || `Step ${i + 1}`} i={i} count={sv.how.steps.length}
                  onUp={() => edit((d) => move(d.services.how.steps, i, -1))}
                  onDown={() => edit((d) => move(d.services.how.steps, i, 1))}
                  onRemove={() => edit((d) => { d.services.how.steps.splice(i, 1) })}>
                  <Field label="Step title" value={st.title} onChange={(v) => edit((d) => { d.services.how.steps[i].title = v })} />
                  <Field label="Step text" textarea value={st.text} onChange={(v) => edit((d) => { d.services.how.steps[i].text = v })} />
                </ItemShell>
              ))}
              <AddButton label="Add step" onClick={() => edit((d) => { d.services.how.steps.push({ title: 'New step', text: '' }) })} />
            </div>
          </section>
        )}

        {tab === 'faqs' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Quick Answers</h2>
            <HeadFields head={sv.faqs} onChange={(h) => edit((d) => { Object.assign(d.services.faqs, h) })} />
            <FaqListEditor items={sv.faqs.items} onChange={(items) => edit((d) => { d.services.faqs.items = items })} />
          </section>
        )}
      </div>
    </>
  )
}