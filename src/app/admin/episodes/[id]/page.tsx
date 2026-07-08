import { notFound } from 'next/navigation'
import { getEpisode, listShows } from '@/lib/episodes/store'
import { EpisodeForm } from './episode-form'

export const metadata = { title: 'Edit episode' }

export default async function EpisodeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const shows = await listShows()
  const episode = id === 'new' ? null : await getEpisode(id)
  if (id !== 'new' && !episode) notFound()

  return <EpisodeForm episode={episode} shows={shows} />
}