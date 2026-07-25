import Link from 'next/link'
import { listProjects } from '@/lib/projects-db/store'
import { ProjectList } from './project-list'
import s from './projects.module.css'

export const metadata = { title: 'Projects' }
export const dynamic = 'force-dynamic'

const FEATURED_SLOTS = 3

export default async function ProjectsPage() {
  const projects = await listProjects()

  const published = projects.filter((p) => p.status === 'published').length
  const featured = projects.filter((p) => p.is_featured).length
  const hero = projects.find((p) => p.is_hero) ?? null

  return (
    <div>
      <header className={s.header}>
        <div>
          <h1 className={s.h1}>Projects</h1>
          <p className={s.sub}>
            Work samples shown on /work. Up to {FEATURED_SLOTS} featured projects appear on the
            homepage, ordered by sort order. One project can also be the hero spotlight.
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn btnSolid">New project</Link>
      </header>

      <div className={s.metrics}>
        <div className={s.metric}>
          <span className={s.metricLabel}>Published</span>
          <span className={s.metricValue}>
            {published}<span className={s.metricTotal}>of {projects.length}</span>
          </span>
        </div>
        <div className={s.metric}>
          <span className={s.metricLabel}>Featured</span>
          <span className={s.metricValue}>
            {featured}<span className={s.metricTotal}>of {FEATURED_SLOTS} slots</span>
          </span>
        </div>
        <div className={s.metric}>
          <span className={s.metricLabel}>Hero spotlight</span>
          <span className={s.metricValue} style={{ fontSize: '0.95rem', paddingTop: 6 }}>
            {hero ? hero.title : 'None set'}
          </span>
        </div>
      </div>

      <ProjectList projects={projects} featuredSlots={FEATURED_SLOTS} />
    </div>
  )
}