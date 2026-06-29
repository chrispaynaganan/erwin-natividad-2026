'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AudioPlayer } from './audio-player'
import { type Project } from '@/lib/projects'
import s from '@/app/work/work.module.css'

const PAGE = 6

export function ProjectsExplorer({ projects, categories }: { projects: Project[]; categories: string[] }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('All')
  const [visible, setVisible] = useState(PAGE)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      const inCat = active === 'All' || p.tags.some((t) => t.toLowerCase() === active.toLowerCase())
      const inSearch = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      return inCat && inSearch
    })
  }, [projects, query, active])

  const shown = filtered.slice(0, visible)

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
        <button className="btn btnSolid" type="button" aria-label="Filters">
          {'\u2261'} Filters
        </button>
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