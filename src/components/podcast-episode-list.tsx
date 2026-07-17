'use client'
import { useState } from 'react'
import { IconPlayerPlay, IconPlayerPause, IconLock, IconSearch } from '@tabler/icons-react'
import type { PublicEpisode } from '@/lib/episodes'
import { usePodcastPlayer } from './podcast-player-provider'
import s from '@/app/podcasts/podcasts.module.css'

const fmt = (secs: number | null) => {
  if (!secs) return '—'
  const m = Math.floor(secs / 60)
  const s2 = Math.round(secs % 60).toString().padStart(2, '0')
  return `${m}:${s2}`
}
const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString() : '')

export function PodcastEpisodeList({ episodes, showTitle }: { episodes: PublicEpisode[]; showTitle: string }) {
  const [query, setQuery] = useState('')
  const { nowPlaying, playing, play } = usePodcastPlayer()

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
              <div key={ep.id} className={s.episodeRow}>
                <button
                  type="button"
                  className={s.episodePlayBtn}
                  aria-label={isActivePlaying ? 'Pause' : 'Play'}
                  onClick={() => play(ep, showTitle)}
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
    </>
  )
}