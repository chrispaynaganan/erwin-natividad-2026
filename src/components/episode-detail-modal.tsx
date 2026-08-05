'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { IconX, IconExternalLink, IconChevronRight } from '@tabler/icons-react'
import type { PublicEpisode } from '@/lib/episodes'
import { EpisodePlayPill } from './episode-play-pill'
import ShareButton from './share-button'
import { SITE_URL } from '@/lib/site-url'
import s from '@/app/podcasts/podcasts.module.css'

export function EpisodeDetailModal({
  episode, showTitle, showSlug, episodes, onClose,
}: {
  episode: PublicEpisode
  showTitle: string
  showSlug: string
  episodes: PublicEpisode[]
  onClose: () => void
}) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const fmtDateShort = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : ''
  const fmtDateFull = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'
  const fmtLen = (secs: number | null) => (secs ? `${Math.round(secs / 60)} min` : '—')

  return (
    <div className={s.modalOverlay} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={s.modalPanel} role="dialog" aria-modal="true" aria-label={episode.title}>
        <button type="button" className={s.modalClose} aria-label="Close" onClick={onClose}>
          <IconX size={18} stroke={1.75} />
        </button>

        <div className={s.modalHeader}>
          {episode.coverUrl && (
            <div className={s.modalArt}>
              <img src={episode.coverUrl} alt="" />
            </div>
          )}
          <div>
            <div className={s.modalDate}>{fmtDateShort(episode.publishedAt)}</div>
            <h2 className={s.modalTitle}>
              {episode.episodeNumber != null && <span className={s.episodeNum}>#{episode.episodeNumber} </span>}
              {episode.title}
            </h2>
            <Link href={`/podcasts/${showSlug}`} className={s.modalShowLink} onClick={onClose}>
              {showTitle} <IconChevronRight size={14} stroke={1.75} />
            </Link>
          </div>
        </div>

        <div className={s.modalActions}>
          <ShareButton url={`${SITE_URL}/podcasts/${showSlug}?episode=${episode.slug}`} title={episode.title} />
          <EpisodePlayPill episode={episode} showTitle={showTitle} showSlug={showSlug} episodes={episodes} />
        </div>

        {episode.description && <p className={s.modalDesc}>{episode.description}</p>}

        {episode.externalLinkUrl && (
          <a href={episode.externalLinkUrl} target="_blank" rel="noopener noreferrer" className={s.modalExternalLink}>
            {episode.externalLinkLabel ?? 'Watch on YouTube'} <IconExternalLink size={16} stroke={1.75} />
          </a>
        )}

        <div className={s.infoGrid}>
          <div>
            <div className={s.infoGridLabel}>Show</div>
            <div className={s.infoGridValue}>{showTitle}</div>
          </div>
          <div>
            <div className={s.infoGridLabel}>Published</div>
            <div className={s.infoGridValue}>{fmtDateFull(episode.publishedAt)}</div>
          </div>
          <div>
            <div className={s.infoGridLabel}>Length</div>
            <div className={s.infoGridValue}>{fmtLen(episode.durationSecs)}</div>
          </div>
          {episode.isPremium && (
            <div>
              <div className={s.infoGridLabel}>Access</div>
              <div className={s.infoGridValue}>Members Only</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}