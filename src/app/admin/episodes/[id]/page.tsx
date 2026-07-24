import { notFound } from 'next/navigation'
import { getEpisode, listShows } from '@/lib/episodes/store'
import { EpisodeForm } from './episode-form'

export const metadata = { title: 'Edit episode' }

export default async function EpisodeEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ show?: string }>
}) {
  const [{ id }, { show }, shows] = await Promise.all([params, searchParams, listShows()])
  const episode = id === 'new' ? null : await getEpisode(id)
  if (id !== 'new' && !episode) notFound()

  return <EpisodeForm episode={episode} shows={shows} initialShowId={show} />
}