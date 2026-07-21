'use client'
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react'
import type { PublicEpisode } from '@/lib/episodes'
import { usePodcastPlayer } from './podcast-player-provider'
import s from '@/app/podcasts/podcasts.module.css'

const fmt = (secs: number) => {
  if (!Number.isFinite(secs) || secs <= 0) return ''
  const m = Math.round(secs / 60)
  return `${m}m`
}

// Small inline play pill shown under a show's description — plays the
// show's latest episode, and reflects live progress if it's already the
// episode currently loaded in the persistent mini-player.
export function ShowPlayPill({
  episode,
  showTitle,
  showSlug,
  episodes,
}: {
  episode: PublicEpisode
  showTitle: string
  showSlug: string
  episodes: PublicEpisode[]
}) {
  const { nowPlaying, playing, current, duration, loading, play, toggle } = usePodcastPlayer()

  const isActive = nowPlaying?.episode.id === episode.id
  const isActivePlaying = isActive && playing
  const progress = isActive && duration ? (current / duration) * 100 : 0
  const label = isActive && duration ? fmt(duration - current) : fmt(episode.durationSecs ?? 0)

  const handleClick = () => {
    if (isActive) toggle()
    else play(episode, showTitle, showSlug, episodes)
  }

  return (
    <button type="button" className={s.showPlayPill} onClick={handleClick} disabled={isActive && loading}>
      <span className={s.showPlayBtn}>
        {isActive && loading ? (
          <span className={s.showPlaySpinner} />
        ) : isActivePlaying ? (
          <IconPlayerPause size={16} stroke={2} />
        ) : (
          <IconPlayerPlay size={16} stroke={2} />
        )}
      </span>
      <span className={s.showPlayTrack}>
        <span className={s.showPlayFill} style={{ width: `${progress}%` }} />
      </span>
      {label && <span className={s.showPlayDuration}>{label}</span>}
    </button>
  )
}