// New file — src/app/admin/content/inclusions-field.tsx
// Deliberately separate from fields.tsx (not touching that shared file).
// Reuses the same class names (s.field, s.label, s.input, s.hint) so it
// looks consistent with Field/LinesField/TagsField, but is self-contained.

'use client'

import { IconChevronUp, IconChevronDown, IconTrash, IconPlus } from '@tabler/icons-react'
import s from './content.module.css'

export type Inclusion = { id: string; label: string; price: number }

function randomId() {
  return Math.random().toString(36).slice(2, 10)
}

function formatMoney(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2)
}

export function InclusionsField({
  label,
  value,
  onChange,
}: {
  label: string
  value: Inclusion[]
  onChange: (v: Inclusion[]) => void
}) {
  function update(i: number, patch: Partial<Inclusion>) {
    const next = value.slice()
    next[i] = { ...next[i], ...patch }
    onChange(next)
  }

  function remove(i: number) {
    onChange(value.filter((_, idx) => idx !== i))
  }

  function moveItem(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = value.slice()
    const tmp = next[i]
    next[i] = next[j]
    next[j] = tmp
    onChange(next)
  }

  function add() {
    onChange([...value, { id: randomId(), label: '', price: 0 }])
  }

  const subtotal = value.reduce((sum, item) => sum + (Number(item.price) || 0), 0)

  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {value.map((item, i) => (
          <div key={item.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              className={s.input}
              style={{ flex: 1 }}
              value={item.label}
              placeholder="e.g. Up to 150 words"
              onChange={(e) => update(i, { label: e.target.value })}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <span style={{ opacity: 0.6 }}>$</span>
              <input
                className={s.input}
                type="number"
                min={0}
                step="0.01"
                style={{ width: 90 }}
                value={item.price}
                onChange={(e) => update(i, { price: Number(e.target.value) || 0 })}
              />
            </div>
            <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} aria-label="Move up" title="Move up">
              <IconChevronUp size={16} stroke={1.75} />
            </button>
            <button type="button" onClick={() => moveItem(i, 1)} disabled={i === value.length - 1} aria-label="Move down" title="Move down">
              <IconChevronDown size={16} stroke={1.75} />
            </button>
            <button type="button" onClick={() => remove(i)} aria-label="Remove" title="Remove">
              <IconTrash size={16} stroke={1.75} />
            </button>
          </div>
        ))}

        <button type="button" onClick={add} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}>
          <IconPlus size={16} stroke={1.75} /> Add inclusion
        </button>
      </div>

      <p className={s.hint} style={{ marginTop: 6 }}>
        Subtotal from these inclusions: ${formatMoney(subtotal)} — prices here are never shown publicly, only the label + checkmark appear on the card. The discount % field below is applied to this subtotal to get the displayed price.
      </p>
    </label>
  )
}