'use client'

import { IconTrash, IconPlus, IconArrowUp, IconArrowDown } from '@tabler/icons-react'
import type { SiteContent, LinkItem, SectionHead, FaqItem } from '@/lib/content/site-content'
import s from './content.module.css'

// Shared prop shape for the per-page editors.
export type EditorProps = {
  c: SiteContent
  edit: (mut: (d: SiteContent) => void) => void
}

// Generic in-place array move used by the mutation-style editors.
export const move = <T,>(arr: T[], i: number, dir: -1 | 1) => {
  const j = i + dir
  if (j < 0 || j >= arr.length) return
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
}

export function Field({ label, value, onChange, textarea, rows, placeholder }: {
  label: string; value: string; onChange: (v: string) => void
  textarea?: boolean; rows?: number; placeholder?: string
}) {
  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      {textarea
        ? <textarea className={s.input} value={value} rows={rows ?? 3} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <input className={s.input} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </label>
  )
}

export function LinkField({ label, value, onChange }: { label: string; value: LinkItem; onChange: (v: LinkItem) => void }) {
  return (
    <div className={s.row2}>
      <Field label={`${label} \u2014 text`} value={value.label} onChange={(label2) => onChange({ ...value, label: label2 })} />
      <Field label={`${label} \u2014 link`} value={value.href} onChange={(href) => onChange({ ...value, href })} placeholder="/work-with-me" />
    </div>
  )
}

export function TagsField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <Field
      label={`${label} (comma-separated)`}
      value={value.join(', ')}
      onChange={(raw) => onChange(raw.split(',').map((t) => t.trim()).filter(Boolean))}
    />
  )
}

// One entry per line — for lists whose entries contain commas (bullet lists,
// paragraphs). Blank lines are dropped on change.
export function LinesField({ label, value, onChange, rows }: {
  label: string; value: string[]; onChange: (v: string[]) => void; rows?: number
}) {
  return (
    <label className={s.field}>
      <span className={s.label}>{label} (one per line)</span>
      <textarea className={s.input} rows={rows ?? Math.max(4, value.length + 1)}
        value={value.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n'))}
        onBlur={(e) => onChange(e.target.value.split('\n').map((l) => l.trim()).filter(Boolean))} />
    </label>
  )
}

// Section heading trio: "Heading" + gold part + subtitle.
export function HeadFields({ head, onChange, subLabel = 'Subtitle' }: {
  head: SectionHead; onChange: (h: SectionHead) => void; subLabel?: string
}) {
  return (
    <>
      <div className={s.row2}>
        <Field label="Heading" value={head.title} onChange={(title) => onChange({ ...head, title })} />
        <Field label="Heading (gold part)" value={head.titleGold} onChange={(titleGold) => onChange({ ...head, titleGold })} />
      </div>
      <Field label={subLabel} textarea value={head.sub} onChange={(sub) => onChange({ ...head, sub })} />
    </>
  )
}

export function ItemShell({ title, i, count, onUp, onDown, onRemove, children }: {
  title: string; i: number; count: number
  onUp: () => void; onDown: () => void; onRemove: () => void; children: React.ReactNode
}) {
  return (
    <div className={s.itemCard}>
      <div className={s.itemHead}>
        <span className={s.itemTitle}>{title}</span>
        <div className={s.itemActions}>
          <button type="button" className={s.iconBtn} disabled={i === 0} onClick={onUp} aria-label="Move up"><IconArrowUp size={16} stroke={1.75} /></button>
          <button type="button" className={s.iconBtn} disabled={i === count - 1} onClick={onDown} aria-label="Move down"><IconArrowDown size={16} stroke={1.75} /></button>
          <button type="button" className={s.iconBtnDanger} onClick={onRemove} aria-label="Remove"><IconTrash size={16} stroke={1.75} /></button>
        </div>
      </div>
      {children}
    </div>
  )
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className={s.addBtn} onClick={onClick}><IconPlus size={16} stroke={1.75} /> {label}</button>
  )
}

// Question/answer list editor, reused by Services, Contact, and the FAQ page.
export function FaqListEditor({ items, onChange }: { items: FaqItem[]; onChange: (items: FaqItem[]) => void }) {
  const update = (i: number, patch: Partial<FaqItem>) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className={s.items}>
      {items.map((it, i) => (
        <ItemShell key={i} title={it.q || `Question ${i + 1}`} i={i} count={items.length}
          onUp={() => moveItem(i, -1)} onDown={() => moveItem(i, 1)}
          onRemove={() => onChange(items.filter((_, j) => j !== i))}>
          <Field label="Question" value={it.q} onChange={(q) => update(i, { q })} />
          <Field label="Answer" textarea value={it.a} onChange={(a) => update(i, { a })} />
        </ItemShell>
      ))}
      <AddButton label="Add question" onClick={() => onChange([...items, { q: 'New question', a: '' }])} />
    </div>
  )
}