'use client'
import { IconPlayerPlay, IconPlayerPause, IconLock, IconLoader2 } from '@tabler/icons-react'
import type { PublicEpisode } from '@/lib/episodes'
import { usePodcastPlayer } from './podcast-player-provider'
import s from '@/app/podcasts/podcasts.module.css'

export function EpisodePlayPill({
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
  const { nowPlaying, playing, loading, locked, play } = usePodcastPlayer()
  const isActive = nowPlaying?.episode.id === episode.id
  const isActivePlaying = isActive && playing
  const isActiveLoading = isActive && loading
  const isActiveLocked = isActive && locked

  return (
    <button
      type="button"
      className={s.episodePlayBtn}
      onClick={() => play(episode, showTitle, showSlug, episodes)}
      aria-label={isActivePlaying ? 'Pause' : 'Play'}
      style={{ marginBottom: 20 }}
    >
      {isActiveLoading ? (
        <IconLoader2 size={17} stroke={1.75} className="spin" />
      ) : episode.isPremium && (isActiveLocked || !isActive) ? (
        <IconLock size={17} stroke={1.75} />
      ) : isActivePlaying ? (
        <IconPlayerPause size={17} stroke={1.75} />
      ) : (
        <IconPlayerPlay size={17} stroke={1.75} />
      )}
      <span style={{ marginLeft: 8 }}>
        {isActiveLoading ? 'Loading…' : isActiveLocked ? 'Members Only' : isActivePlaying ? 'Pause' : 'Play Episode'}
      </span>
    </button>
  )
}