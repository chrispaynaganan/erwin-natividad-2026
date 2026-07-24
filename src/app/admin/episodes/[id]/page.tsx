import { notFound } from 'next/navigation'
import { getEpisode, listShows, listEpisodesForShow } from '@/lib/episodes/store'
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

  // Siblings power the prev/next pager. Same ordering as the merged list,
  // so "next" here means the same thing it looks like there.
  const siblings = episode ? await listEpisodesForShow(episode.show_id) : []
  const index = siblings.findIndex((e) => e.id === episode?.id)

  const prev = index > 0 ? siblings[index - 1] : null
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null

  return (
    <EpisodeForm
      episode={episode}
      shows={shows}
      initialShowId={show}
      prev={prev ? { id: prev.id, title: prev.title } : null}
      next={next ? { id: next.id, title: next.title } : null}
      position={index >= 0 ? { current: index + 1, total: siblings.length } : null}
    />
  )
}