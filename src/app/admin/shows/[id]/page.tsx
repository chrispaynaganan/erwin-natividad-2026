import { notFound } from 'next/navigation'
import { getShow } from '@/lib/shows/store'
import { ShowForm } from './show-form'

export const metadata = { title: 'Edit show' }

export default async function ShowEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const show = id === 'new' ? null : await getShow(id)
  if (id !== 'new' && !show) notFound()

  return <ShowForm show={show} />
}