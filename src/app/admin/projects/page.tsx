import Link from 'next/link'
import { listProjects } from '@/lib/projects-db/store'
import { ProjectList } from './project-list'

export const metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const projects = await listProjects()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-h2)' }}>Projects</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            {'Manage the work samples shown on /work. Mark one \u201Cfeatured\u201D to spotlight it on the homepage.'}
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn btnSolid">New project</Link>
      </div>

      <ProjectList projects={projects} />
    </div>
  )
}