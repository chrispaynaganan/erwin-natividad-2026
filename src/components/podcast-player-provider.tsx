'use client'
import { createContext, useContext, useRef, useState, useCallback } from 'react'
import type { PublicEpisode } from '@/lib/episodes'

type NowPlaying = { episode: PublicEpisode; showTitle: string; showSlug: string } | null

type PlayerState = {
  nowPlaying: NowPlaying
  playing: boolean
  current: number
  duration: number
  loading: boolean
  locked: boolean
  hasNext: boolean
  hasPrev: boolean
  play: (episode: PublicEpisode, showTitle: string, showSlug: string, queue?: PublicEpisode[]) => void
  toggle: () => void
  seek: (secs: number) => void
  next: () => void
  prev: () => void
  close: () => void
}

const PlayerContext = createContext<PlayerState | null>(null)

export function usePodcastPlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePodcastPlayer must be used within PodcastPlayerProvider')
  return ctx
}

// Mounted once, high in the tree (inside SiteChrome, above page content) so
// the <audio> element and playback state survive client-side navigation.
export function PodcastPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)
  const [queue, setQueue] = useState<PublicEpisode[]>([])
  const [queueIndex, setQueueIndex] = useState(0)

  // Shared loader used by play(), next(), and prev() — fetches the signed
  // playback URL for an episode and starts it, without touching the queue.
  const loadAndPlay = useCallback(async (episode: PublicEpisode, showTitle: string, showSlug: string) => {
    setLoading(true)
    setLocked(false)
    setNowPlaying({ episode, showTitle, showSlug })
    setPlaying(false)
    setCurrent(0)
    setDuration(0)

    try {
      const res = await fetch(`/api/audio/${episode.id}`)
      const json = await res.json()
      if (!res.ok) {
        setLocked(res.status === 403)
        setLoading(false)
        return
      }
      const a = audioRef.current
      if (a) {
        a.src = json.url
        await a.play()
        setPlaying(true)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const play = useCallback((episode: PublicEpisode, showTitle: string, showSlug: string, newQueue?: PublicEpisode[]) => {
    const sameEpisode = nowPlaying?.episode.id === episode.id
    if (sameEpisode) {
      const a = audioRef.current
      if (a) { playing ? a.pause() : a.play(); setPlaying((p) => !p) }
      return
    }

    if (newQueue && newQueue.length) {
      setQueue(newQueue)
      const idx = newQueue.findIndex((e) => e.id === episode.id)
      setQueueIndex(idx >= 0 ? idx : 0)
    } else if (nowPlaying?.showSlug !== showSlug) {
      // No queue passed and we're switching shows — fall back to a single-item queue.
      setQueue([episode])
      setQueueIndex(0)
    }

    loadAndPlay(episode, showTitle, showSlug)
  }, [nowPlaying, playing, loadAndPlay])

  const goToIndex = useCallback((index: number) => {
    if (!nowPlaying || index < 0 || index >= queue.length) return
    setQueueIndex(index)
    loadAndPlay(queue[index], nowPlaying.showTitle, nowPlaying.showSlug)
  }, [nowPlaying, queue, loadAndPlay])

  const next = useCallback(() => goToIndex(queueIndex + 1), [goToIndex, queueIndex])
  const prev = useCallback(() => goToIndex(queueIndex - 1), [goToIndex, queueIndex])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playing) a.pause(); else a.play()
    setPlaying((p) => !p)
  }, [playing])

  const seek = useCallback((secs: number) => {
    const a = audioRef.current
    if (a) a.currentTime = secs
  }, [])

  const close = useCallback(() => {
    const a = audioRef.current
    if (a) { a.pause(); a.removeAttribute('src'); a.load() }
    setNowPlaying(null)
    setPlaying(false)
    setCurrent(0)
    setDuration(0)
    setLocked(false)
    setQueue([])
    setQueueIndex(0)
  }, [])

  const hasNext = queueIndex < queue.length - 1
  const hasPrev = queueIndex > 0

  return (
    <PlayerContext.Provider value={{ nowPlaying, playing, current, duration, loading, locked, hasNext, hasPrev, play, toggle, seek, next, prev, close }}>
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => { if (queueIndex < queue.length - 1) goToIndex(queueIndex + 1); else setPlaying(false) }}
      />
      {children}
    </PlayerContext.Provider>
  )
}