'use client'

import s from './content.module.css'
import type { SeoMeta } from '@/lib/content/site-content'

export const TITLE_LIMIT = 60
export const DESC_LIMIT = 160

export type Health = 'ok' | 'attention' | 'error'

// Same rules as /admin/seo, so the two pages always agree.
export function seoHealth(seo?: SeoMeta): Health {
  if (!seo) return 'ok'
  const title = seo.metaTitle.trim()
  const desc = seo.metaDescription.trim()
  if (title.length > TITLE_LIMIT || desc.length > DESC_LIMIT) return 'error'
  if (!title || !desc || !seo.ogImageUrl.trim()) return 'attention'
  return 'ok'
}

const COPY: Record<Exclude<Health, 'ok'>, string> = {
  attention: 'Incomplete — falling back to site defaults',
  error: 'A field is over its character limit',
}

export function HealthDot({ health }: { health: Health }) {
  if (health === 'ok') return null
  const label = COPY[health]
  return (
    <span
      className={`${s.dot} ${health === 'error' ? s.dotError : s.dotAttention}`}
      title={label}
      aria-label={label}
      role="img"
    />
  )
}

export type TabDef = { key: string; label: string; health?: Health }

export function TabRow({
  groupLabel,
  variant,
  tabs,
  active,
  onSelect,
}: {
  groupLabel: string
  variant: 'page' | 'section'
  tabs: TabDef[]
  active: string
  onSelect: (key: string) => void
}) {
  const base = variant === 'page' ? s.pageTab : s.tab
  const activeCls = variant === 'page' ? s.pageTabActive : s.tabActive
  const rowCls = variant === 'page' ? s.pageTabs : s.tabs
  const flagged = tabs.filter((t) => t.health && t.health !== 'ok')

  return (
    <div className={s.tabGroup}>
      <span className={s.groupLabel}>{groupLabel}</span>
      <nav className={rowCls} aria-label={groupLabel}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onSelect(t.key)}
            aria-current={active === t.key ? 'true' : undefined}
            className={active === t.key ? `${base} ${activeCls}` : base}
          >
            {t.label}
            {t.health ? <HealthDot health={t.health} /> : null}
          </button>
        ))}
      </nav>
      {flagged.length > 0 && (
        <div className={s.legend}>
          {flagged.some((t) => t.health === 'attention') && (
            <span className={s.legendItem}>
              <span className={`${s.dot} ${s.dotAttention}`} /> SEO incomplete
            </span>
          )}
          {flagged.some((t) => t.health === 'error') && (
            <span className={s.legendItem}>
              <span className={`${s.dot} ${s.dotError}`} /> Over character limit
            </span>
          )}
        </div>
      )}
    </div>
  )
}