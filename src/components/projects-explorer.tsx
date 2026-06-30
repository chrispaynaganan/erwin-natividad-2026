'use client'
import { useMemo, useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { AudioPlayer } from './audio-player'
import { type Project } from '@/lib/projects'
import s from '@/app/work/work.module.css'

const PAGE = 6

type Sort = 'none' | 'newest' | 'oldest' | 'az'
type Dur = 'any' | 'lt5' | '5to6' | 'gt6'

const toSeconds = (d: string) => {
  const [m, sec] = d.split(':').map(Number)
  return (m || 0) * 60 + (sec || 0)
}
const dateVal = (d: string) => {
  const t = Date.parse(d)
  return Number.isNaN(t) ? 0 : t
}

export function ProjectsExplorer({ projects, categories }: { projects: Project[]; categories: string[] }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('All')
  const [visible, setVisible] = useState(PAGE)
  const [sort, setSort] = useState<Sort>('none')
  const [duration, setDuration] = useState<Dur>('any')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)

  // Close the filter dropdown on outside click / Escape.
  useEffect(() => {
    if (!filtersOpen) return
    const onDoc = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFiltersOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFiltersOpen(false) }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey) }
  }, [filtersOpen])

  const reset = () => { setQuery(''); setActive('All'); setSort('none'); setDuration('any'); setVisible(PAGE) }
  const advancedCount = (sort !== 'none' ? 1 : 0) + (duration !== 'any' ? 1 : 0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = projects.filter((p) => {
      const inCat = active === 'All' || p.tags.some((t) => t.toLowerCase() === active.toLowerCase())
      const inSearch = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      const secs = toSeconds(p.duration)
      const inDur =
        duration === 'any' ||
        (duration === 'lt5' && secs < 300) ||
        (duration === '5to6' && secs >= 300 && secs <= 360) ||
        (duration === 'gt6' && secs > 360)
      return inCat && inSearch && inDur
    })
    if (sort === 'newest') list.sort((a, b) => dateVal(b.date) - dateVal(a.date))
    else if (sort === 'oldest') list.sort((a, b) => dateVal(a.date) - dateVal(b.date))
    else if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [projects, query, active, sort, duration])

  const shown = filtered.slice(0, visible)

  const Opt = ({ on, set, val, label }: { on: boolean; set: () => void; val: string; label: string }) => (
    <button type="button" className={`${s.filterOpt} ${on ? s.filterOptActive : ''}`} onClick={set} key={val}>{label}</button>
  )

  return (
    <>
      {/* Search + Filters */}
      <div className={s.toolbar}>
        <div className={s.searchWrap}>
          <span className={s.searchIcon} aria-hidden>{'\u{1F50D}'}</span>
          <input
            className={s.searchInput}
            placeholder="Search projects by title or description..."
            aria-label="Search projects"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisible(PAGE) }}
          />
        </div>

        <div className={s.filterWrap} ref={filterRef}>
          <button className={s.filterBtn} type="button" aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((o) => !o)}>
            {'\u2261'} <span className={s.filterBtnLabel}>Filters</span>
            {advancedCount > 0 && <span className={s.filterDot} aria-hidden />}
          </button>

          {filtersOpen && (
            <div className={s.filterPanel} role="dialog" aria-label="Filter projects">
              <div className={s.filterGroup}>
                <span className={s.filterLabel}>Sort by date</span>
                <div className={s.filterOpts}>
                  <Opt val="newest" label="Newest" on={sort === 'newest'} set={() => { setSort(sort === 'newest' ? 'none' : 'newest'); setVisible(PAGE) }} />
                  <Opt val="oldest" label="Oldest" on={sort === 'oldest'} set={() => { setSort(sort === 'oldest' ? 'none' : 'oldest'); setVisible(PAGE) }} />
                  <Opt val="az" label="A \u2013 Z" on={sort === 'az'} set={() => { setSort(sort === 'az' ? 'none' : 'az'); setVisible(PAGE) }} />
                </div>
              </div>

              <div className={s.filterGroup}>
                <span className={s.filterLabel}>Duration</span>
                <div className={s.filterOpts}>
                  <Opt val="any" label="Any" on={duration === 'any'} set={() => { setDuration('any'); setVisible(PAGE) }} />
                  <Opt val="lt5" label="Under 5 min" on={duration === 'lt5'} set={() => { setDuration('lt5'); setVisible(PAGE) }} />
                  <Opt val="5to6" label="5 \u2013 6 min" on={duration === '5to6'} set={() => { setDuration('5to6'); setVisible(PAGE) }} />
                  <Opt val="gt6" label="Over 6 min" on={duration === 'gt6'} set={() => { setDuration('gt6'); setVisible(PAGE) }} />
                </div>
              </div>

              <div className={s.filterFoot}>
                <span className={s.filterCount}>{filtered.length} result{filtered.length === 1 ? '' : 's'}</span>
                <button type="button" className={s.filterReset} onClick={reset}>Reset all</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <h2 className={s.quickHead}>Quick <span className="gold">Filters</span></h2>
      <div className={s.chips}>
        {categories.map((c) => (
          <button key={c} type="button"
            className={`${s.chip} ${active === c ? s.chipActive : ''}`}
            onClick={() => { setActive(c); setVisible(PAGE) }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {shown.length === 0 ? (
        <p className={s.empty}>No projects match your search yet.</p>
      ) : (
        <div className={s.grid}>
          {shown.map((p) => (
            <article key={p.title} className={s.card}>
              <div className={s.cardImg} />
              <div className={s.cardTags}>{p.tags.map((t) => <span key={t} className={s.tagGold}>{t}</span>)}</div>
              <h3 className={s.cardTitle}>{p.title}</h3>
              <p className={s.cardDesc}>{p.desc}</p>
              <span className={s.cardDate}>{p.date}</span>
              <AudioPlayer durationLabel={p.duration} />
              <Link href={`/work/${p.slug}`} className="btn btnSolid" style={{ width: '100%' }}>View Project</Link>
            </article>
          ))}
        </div>
      )}

      {visible < filtered.length && (
        <div className={s.loadMoreWrap}>
          <button className="btn btnOutline" onClick={() => setVisible((v) => v + PAGE)}>Load More Projects</button>
        </div>
      )}
    </>
  )
}