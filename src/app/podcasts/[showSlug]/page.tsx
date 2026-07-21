import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getShow, getShows } from '@/lib/shows'
import { getEpisodesForShow } from '@/lib/episodes'
import { PodcastEpisodeList } from '@/components/podcast-episode-list'
import { ShowPlayPill } from '@/components/show-play-pill'
import s from '../podcasts.module.css'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const shows = await getShows()
  return shows.map((s) => ({ showSlug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ showSlug: string }> }) {
  const { showSlug } = await params
  const show = await getShow(showSlug)
  return { title: show ? show.title : 'Show' }
}

export default async function ShowDetail({ params }: { params: Promise<{ showSlug: string }> }) {
  const { showSlug } = await params
  const show = await getShow(showSlug)
  if (!show) notFound()
  const episodes = await getEpisodesForShow(show.id)

  const featured = show.featuredEpisodeId
    ? episodes.find((e) => e.id === show.featuredEpisodeId) ?? episodes[0]
    : episodes[0]

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <nav className={s.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/podcasts">Podcasts</Link><span>/</span>
        <span className={s.crumbCurrent}>{show.title}</span>
      </nav>

      <div className={s.showHeader}>
        <div className={s.showHeaderArt}>{show.coverUrl ? <img src={show.coverUrl} alt="" /> : <div className={s.showArtFallback} />}</div>
        <div>
          <h1 className={s.showHeaderTitle}>{show.title}</h1>
          {show.description && <p className={s.showHeaderDesc}>{show.description}</p>}
          {episodes.length > 0 && featured && (
            <ShowPlayPill episode={featured} showTitle={show.title} showSlug={show.slug} episodes={episodes} />
          )}
        </div>
      </div>

      <h2 className={s.episodesHeading}>Episodes</h2>
      <PodcastEpisodeList episodes={episodes} showTitle={show.title} showSlug={show.slug} />
    </main>
  )
}