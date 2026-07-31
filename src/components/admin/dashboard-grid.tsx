'use client'

import { useMemo, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import Link from 'next/link'
import ReactGridLayoutBase, { WidthProvider } from 'react-grid-layout/legacy'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import {
  IconCalendarCheck, IconUsers, IconFileText, IconNews, IconMicrophone,
  IconBriefcase, IconCreditCard, IconSearch, IconSettings,
  IconGripVertical, IconX, IconPlus, IconArrowUpRight,
} from '@tabler/icons-react'
import { useToast } from '@/components/toast-provider'
import { saveDashboardLayout } from '@/app/admin/dashboard-actions'
import {
  ALL_WIDGET_KEYS, WIDGET_META, type WidgetKey, type LayoutItem,
  type DashboardLayout, type DashboardMetrics,
} from '@/lib/admin-dashboard-widgets'
import styles from './dashboard-grid.module.css'

// react-grid-layout's own .d.ts for its main entry point is incomplete/
// mismatched for this codebase's usage (see note below on the /legacy
// entry point actually used here). Rather than fight the library's types,
// we type our *own* usage explicitly (the props we actually pass, and the
// shape the callback actually receives at runtime).
type RGLItem = { i: string; x: number; y: number; w: number; h: number }

type GridLayoutProps = {
  className?: string
  layout: RGLItem[]
  cols?: number
  rowHeight?: number
  margin?: [number, number]
  compactType?: 'vertical' | 'horizontal' | null
  draggableHandle?: string
  onLayoutChange?: (layout: RGLItem[]) => void
  children?: React.ReactNode
}

// ROOT CAUSE, confirmed by pulling the actual published package: this repo
// depends on react-grid-layout v2, which is a ground-up rewrite. Its main
// entry point (`react-grid-layout`) exports a brand-new `GridLayout` with
// a different props shape (requires an explicit `width` number, uses
// `gridConfig`/`compactor` instead of flat `cols`/`compactType`, etc.) and
// — critically — does NOT export `WidthProvider` at all anymore. That's
// the actual "WidthProvider is not a function" crash: it isn't a bundler
// or import-syntax problem, `WidthProvider` genuinely isn't there.
//
// The library ships a dedicated compatibility entry point for exactly
// this situation: `react-grid-layout/legacy`. It re-exports the old v1
// API — `WidthProvider`, and a default `ReactGridLayout` that takes the
// same flat props (`cols`, `rowHeight`, `margin`, `compactType`,
// `draggableHandle`, `onLayoutChange(layout)`) this component already
// uses — with correct, standard TypeScript declarations (no cast-fighting
// needed for the import itself).
//
// This is also safe with SSR on its own merits, with no dynamic()/
// ssr:false wrapper needed: the only `window`-touching code in this
// library runs inside `componentDidMount`, which never executes during
// server rendering. `WidthProvider` exists specifically to correct the
// initial guessed width once the component mounts client-side.
const GridLayout = WidthProvider(ReactGridLayoutBase) as unknown as ComponentType<GridLayoutProps>

const ICONS: Record<WidgetKey, typeof IconCalendarCheck> = {
  bookings: IconCalendarCheck,
  subscribers: IconUsers,
  content: IconFileText,
  blog: IconNews,
  podcasts: IconMicrophone,
  projects: IconBriefcase,
  payments: IconCreditCard,
  seo: IconSearch,
  settings: IconSettings,
}

const ROW_HEIGHT = 84
const SAVE_DEBOUNCE_MS = 700

function formatCents(cents: number) {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function WidgetLines({ lines }: { lines: { label: string; value: string }[] }) {
  return (
    <div className={styles.metricGrid}>
      {lines.map((l) => (
        <div key={l.label} className={styles.metricItem}>
          <span className={styles.metricValue}>{l.value}</span>
          <span className={styles.metricLabel}>{l.label}</span>
        </div>
      ))}
    </div>
  )
}

function widgetBody(key: WidgetKey, metrics: DashboardMetrics) {
  switch (key) {
    case 'bookings':
      return <WidgetLines lines={[
        { label: 'This week', value: String(metrics.bookings.thisWeek) },
        { label: 'Waitlisted', value: String(metrics.bookings.waitlisted) },
        { label: 'Awaiting reply', value: String(metrics.bookings.needsReply) },
      ]} />
    case 'subscribers':
      return <WidgetLines lines={[
        { label: 'Total', value: String(metrics.subscribers.total) },
        { label: 'Subscribed', value: String(metrics.subscribers.subscribed) },
        { label: 'Pending', value: String(metrics.subscribers.pending) },
      ]} />
    case 'blog':
      return <WidgetLines lines={[
        { label: 'Published', value: String(metrics.blog.published) },
        { label: 'Drafts', value: String(metrics.blog.drafts) },
      ]} />
    case 'podcasts':
      return <WidgetLines lines={[
        { label: 'Shows', value: String(metrics.podcasts.shows) },
        { label: 'Missing audio', value: String(metrics.podcasts.episodesMissingAudio) },
      ]} />
    case 'projects':
      return <WidgetLines lines={[
        { label: 'Published', value: String(metrics.projects.published) },
        { label: 'Featured', value: String(metrics.projects.featured) },
        { label: 'Missing audio', value: String(metrics.projects.missingAudio) },
      ]} />
    case 'payments':
      return metrics.payments ? (
        <WidgetLines lines={[
          { label: 'This month', value: formatCents(metrics.payments.thisMonthCents) },
          { label: 'Payments', value: String(metrics.payments.countThisMonth) },
        ]} />
      ) : (
        <p className={styles.noAccess}>Admin access required to view revenue.</p>
      )
    case 'content':
    case 'seo':
    case 'settings':
      return <p className={styles.description}>{WIDGET_META[key].description}</p>
  }
}

export function DashboardGrid({
  metrics, initialLayout,
}: { metrics: DashboardMetrics; initialLayout: DashboardLayout }) {
  const toast = useToast()
  const [visible, setVisible] = useState<WidgetKey[]>(initialLayout.visible)
  const [layout, setLayout] = useState<LayoutItem[]>(initialLayout.layout)
  const [addMenuOpen, setAddMenuOpen] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hiddenWidgets = useMemo(
    () => ALL_WIDGET_KEYS.filter((k) => !visible.includes(k)),
    [visible],
  )

  function scheduleSave(nextVisible: WidgetKey[], nextLayout: LayoutItem[]) {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const res = await saveDashboardLayout({ visible: nextVisible, layout: nextLayout })
      if (!res.ok) toast.error(res.message)
    }, SAVE_DEBOUNCE_MS)
  }

  function handleLayoutChange(rgl: RGLItem[]) {
    // react-grid-layout gives back every item currently mounted, in its own
    // shape — narrow it back to our LayoutItem (WidgetKey-keyed) shape.
    const next: LayoutItem[] = rgl.map((item) => ({
      i: item.i as WidgetKey, x: item.x, y: item.y, w: item.w, h: item.h,
    }))
    setLayout(next)
    scheduleSave(visible, next)
  }

  function removeWidget(key: WidgetKey) {
    const nextVisible = visible.filter((k) => k !== key)
    setVisible(nextVisible)
    scheduleSave(nextVisible, layout)
  }

  function addWidget(key: WidgetKey) {
    const nextVisible = [...visible, key]
    // Drop it in at the bottom, full-ish width, rather than trying to guess
    // a gap — compactType="vertical" on the grid will settle it neatly.
    const maxY = layout.reduce((m, item) => Math.max(m, item.y + item.h), 0)
    const nextLayout = [...layout, { i: key, x: 0, y: maxY, w: 4, h: 3 }]
    setVisible(nextVisible)
    setLayout(nextLayout)
    setAddMenuOpen(false)
    scheduleSave(nextVisible, nextLayout)
  }

  const gridLayout = layout.filter((item) => visible.includes(item.i))

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.addMenuWrap}>
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setAddMenuOpen((v) => !v)}
            disabled={hiddenWidgets.length === 0}
          >
            <IconPlus size={16} stroke={1.9} /> Add widget
          </button>
          {addMenuOpen && (
            <div className={styles.addMenu} role="menu">
              {hiddenWidgets.length === 0 ? (
                <span className={styles.addMenuEmpty}>All widgets are shown</span>
              ) : (
                hiddenWidgets.map((key) => {
                  const Icon = ICONS[key]
                  return (
                    <button key={key} type="button" className={styles.addMenuItem} onClick={() => addWidget(key)}>
                      <Icon size={15} stroke={1.75} /> {WIDGET_META[key].title}
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>

      <GridLayout
        className={styles.grid}
        layout={gridLayout}
        cols={12}
        rowHeight={ROW_HEIGHT}
        margin={[16, 16]}
        compactType="vertical"
        draggableHandle={`.${styles.dragHandle}`}
        onLayoutChange={handleLayoutChange}
      >
        {visible.map((key) => (
          <div key={key}>
            <WidgetCard widgetKey={key} metrics={metrics} onRemove={() => removeWidget(key)} />
          </div>
        ))}
      </GridLayout>
    </div>
  )
}

function WidgetCard({
  widgetKey, metrics, onRemove,
}: { widgetKey: WidgetKey; metrics: DashboardMetrics; onRemove: () => void }) {
  const Icon = ICONS[widgetKey]
  const meta = WIDGET_META[widgetKey]

  return (
    <article className={styles.card}>
      <header className={styles.cardHead}>
        <span className={styles.dragHandle} aria-hidden="true"><IconGripVertical size={16} stroke={1.75} /></span>
        <span className={styles.cardIcon}><Icon size={16} stroke={1.75} /></span>
        <span className={styles.cardTitle}>{meta.title}</span>
        <button type="button" className={styles.removeBtn} aria-label={`Remove ${meta.title} widget`} onClick={onRemove}>
          <IconX size={14} stroke={1.9} />
        </button>
      </header>

      <div className={styles.cardBody}>{widgetBody(widgetKey, metrics)}</div>

      <Link href={meta.href} className={styles.cardLink}>
        Open <IconArrowUpRight size={14} stroke={1.9} />
      </Link>
    </article>
  )
}