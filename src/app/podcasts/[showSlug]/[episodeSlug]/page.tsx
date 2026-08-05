import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getShow } from '@/lib/shows'
import { getEpisodeBySlug, getEpisodesForShow } from '@/lib/episodes'
import { EpisodePlayPill } from '@/components/episode-play-pill'
import ShareButton from '@/components/share-button'
import { IconExternalLink } from '@tabler/icons-react'
import { SITE_URL } from '@/lib/site-url'
import s from '../../podcasts.module.css'

export async function generateMetadata({ params }: { params: Promise<{ showSlug: string; episodeSlug: string }> }) {
  const { showSlug, episodeSlug } = await params
  const show = await getShow(showSlug)
  const ep = show ? await getEpisodeBySlug(show.id, episodeSlug) : null
  return { title: ep ? ep.title : 'Episode' }
}

export default async function EpisodeDetail({ params }: { params: Promise<{ showSlug: string; episodeSlug: string }> }) {
  const { showSlug, episodeSlug } = await params
  const show = await getShow(showSlug)
  if (!show) notFound()
  const episode = await getEpisodeBySlug(show.id, episodeSlug)
  if (!episode) notFound()
  const allEpisodes = await getEpisodesForShow(show.id)

  const fmtDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'
  const fmtLen = (secs: number | null) => (secs ? `${Math.round(secs / 60)} min` : '—')

  return (
    <main className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
      <nav className={s.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/podcasts">Podcasts</Link><span>/</span>
        <Link href={`/podcasts/${showSlug}`}>{show.title}</Link><span>/</span>
        <span className={s.crumbCurrent}>{episode.title}</span>
      </nav>

      <div className={s.episodeDetailTitleRow}>
        <h1 className={s.episodeDetailTitle}>
          {episode.episodeNumber != null && <span className={s.episodeNum}>#{episode.episodeNumber}</span>} {episode.title}
        </h1>
        <ShareButton url={`${SITE_URL}/podcasts/${showSlug}/${episode.slug}`} title={episode.title} />
      </div>

      <p className={s.showHeaderDesc}>
        <Link href={`/podcasts/${showSlug}`}>{show.title}</Link>
      </p>

      <EpisodePlayPill episode={episode} showTitle={show.title} showSlug={showSlug} episodes={allEpisodes} />

      {episode.description && <p className={s.episodeDetailDesc}>{episode.description}</p>}

      {episode.externalLinkUrl && (
        <a href={episode.externalLinkUrl} target="_blank" rel="noopener noreferrer" className={s.episodeExternalLink}>
          {episode.externalLinkLabel ?? 'Watch on YouTube'} <IconExternalLink size={16} stroke={1.75} />
        </a>
      )}

      <h2 className={s.episodesHeading}>Information</h2>
      <div className={s.infoCard}>
        <div className={s.infoRow}><span className={s.infoLabel}>Show</span><span className={s.infoValue}>{show.title}</span></div>
        <div className={s.infoRow}><span className={s.infoLabel}>Published</span><span className={s.infoValue}>{fmtDate(episode.publishedAt)}</span></div>
        <div className={s.infoRow}><span className={s.infoLabel}>Length</span><span className={s.infoValue}>{fmtLen(episode.durationSecs)}</span></div>
        {episode.isPremium && <div className={s.infoRow}><span className={s.infoLabel}>Access</span><span className={s.infoValue}>Members Only</span></div>}
      </div>
    </main>
  )
}