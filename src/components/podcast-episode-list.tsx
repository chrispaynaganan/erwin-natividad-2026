'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { IconPlayerPlay, IconPlayerPause, IconLock, IconSearch } from '@tabler/icons-react'
import type { PublicEpisode } from '@/lib/episodes'
import { usePodcastPlayer } from './podcast-player-provider'
import { EpisodeDetailModal } from './episode-detail-modal'
import s from '@/app/podcasts/podcasts.module.css'

const fmt = (secs: number | null) => {
  if (!secs) return '—'
  const m = Math.floor(secs / 60)
  const s2 = Math.round(secs % 60).toString().padStart(2, '0')
  return `${m}:${s2}`
}
const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString() : '')

export function PodcastEpisodeList({
  episodes,
  showTitle,
  showSlug,
}: {
  episodes: PublicEpisode[]
  showTitle: string
  showSlug: string
}) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<PublicEpisode | null>(null)
  const { nowPlaying, playing, play } = usePodcastPlayer()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Deep-link support: /podcasts/[showSlug]?episode=[slug] opens the modal
  // directly — this is what ShareButton links to, since there's no
  // dedicated episode page anymore.
  useEffect(() => {
    const slug = searchParams.get('episode')
    if (!slug) return
    const match = episodes.find((e) => e.slug === slug)
    if (match) setSelected(match)
  }, [searchParams, episodes])

  function openEpisode(ep: PublicEpisode) {
    setSelected(ep)
    router.replace(`/podcasts/${showSlug}?episode=${ep.slug}`, { scroll: false })
  }

  function closeModal() {
    setSelected(null)
    router.replace(`/podcasts/${showSlug}`, { scroll: false })
  }

  const filtered = episodes.filter((e) => {
    const q = query.trim().toLowerCase()
    return !q || e.title.toLowerCase().includes(q) || (e.description ?? '').toLowerCase().includes(q)
  })

  return (
    <>
      <div className={s.searchWrap} style={{ maxWidth: 420, marginBottom: 28 }}>
        <span className={s.searchIcon} aria-hidden><IconSearch size={18} stroke={1.75} /></span>
        <input className={s.searchInput} placeholder="Search episodes..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <p className={s.empty}>No episodes match your search yet.</p>
      ) : (
        <div className={s.episodeList}>
          {filtered.map((ep) => {
            const isActive = nowPlaying?.episode.id === ep.id
            const isActivePlaying = isActive && playing
            return (
              <div key={ep.id} className={s.episodeRow} onClick={() => openEpisode(ep)} style={{ cursor: 'pointer' }}>
                <button
                  type="button"
                  className={s.episodePlayBtn}
                  aria-label={isActivePlaying ? 'Pause' : 'Play'}
                  onClick={(e) => { e.stopPropagation(); play(ep, showTitle, showSlug, episodes) }}
                >
                  {ep.isPremium ? <IconLock size={17} stroke={1.75} /> : isActivePlaying ? <IconPlayerPause size={17} stroke={1.75} /> : <IconPlayerPlay size={17} stroke={1.75} />}
                </button>
                <div className={s.episodeMeta}>
                  <div className={s.episodeTitle}>
                    {ep.episodeNumber != null && <span className={s.episodeNum}>#{ep.episodeNumber}</span>} {ep.title}
                    {ep.isPremium && <span className={s.episodeBadge}>Members Only</span>}
                  </div>
                  {ep.description && <p className={s.episodeDesc}>{ep.description}</p>}
                  <div className={s.episodeSub}>
                    <span>{fmtDate(ep.publishedAt)}</span>
                    <span>·</span>
                    <span>{fmt(ep.durationSecs)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selected && (
        <EpisodeDetailModal episode={selected} showTitle={showTitle} showSlug={showSlug} episodes={episodes} onClose={closeModal} />
      )}
    </>
  )
}