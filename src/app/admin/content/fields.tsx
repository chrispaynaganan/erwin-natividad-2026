'use client'

import { useEffect, useState } from 'react'
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
      <Field label={`${label} — text`} value={value.label} onChange={(label2) => onChange({ ...value, label: label2 })} />
      <Field label={`${label} — link`} value={value.href} onChange={(href) => onChange({ ...value, href })} placeholder="/work-with-me" />
    </div>
  )
}

const parseTags = (raw: string) => raw.split(',').map((t) => t.trim()).filter(Boolean)

/**
 * Comma-separated tag editor.
 *
 * The previous version derived the input's value straight from the array on
 * every render: `value.join(', ')` in, `split/trim/filter` out. Typing a comma
 * produced an empty trailing element that `filter(Boolean)` dropped, so the
 * comma disappeared as you typed it — and `trim()` then ate the following
 * space. The array round-trip was rewriting the field mid-keystroke.
 *
 * Now the raw text is held locally and only normalised on blur. The parent
 * still gets parsed tags on every change, so dirty-tracking is unaffected.
 */
export function TagsField({ label, value, onChange, placeholder }: {
  label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string
}) {
  const [draft, setDraft] = useState(() => value.join(', '))
  const [focused, setFocused] = useState(false)
  const canonical = value.join(', ')

  // Re-sync only when the value changes from outside (switching pages, undo)
  // and never while the field has focus.
  useEffect(() => {
    if (!focused) setDraft(canonical)
  }, [canonical, focused])

  return (
    <label className={s.field}>
      <span className={s.label}>{label} (comma-separated)</span>
      <input
        className={s.input}
        value={draft}
        placeholder={placeholder ?? 'Commercial, Narration, eLearning'}
        onFocus={() => setFocused(true)}
        onChange={(e) => { setDraft(e.target.value); onChange(parseTags(e.target.value)) }}
        onBlur={(e) => {
          setFocused(false)
          const tags = parseTags(e.target.value)
          onChange(tags)
          setDraft(tags.join(', '))
        }}
      />
      {value.length > 0 && (
        <span className={s.chips}>
          {value.map((t, i) => <span key={`${t}-${i}`} className={s.chip}>{t}</span>)}
        </span>
      )}
    </label>
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