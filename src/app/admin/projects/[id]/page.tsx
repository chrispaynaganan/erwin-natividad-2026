import { notFound } from 'next/navigation'
import { getProjectById } from '@/lib/projects-db/store'
import { ProjectForm } from './project-form'

export const metadata = { title: 'Edit project' }

export default async function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = id === 'new' ? null : await getProjectById(id)
  if (id !== 'new' && !project) notFound()

  return <ProjectForm project={project} />
}