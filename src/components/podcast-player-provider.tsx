'use client'
import { createContext, useContext, useRef, useState, useCallback } from 'react'
import type { PublicEpisode } from '@/lib/episodes'

type NowPlaying = { episode: PublicEpisode; showTitle: string } | null

type PlayerState = {
  nowPlaying: NowPlaying
  playing: boolean
  current: number
  duration: number
  loading: boolean
  locked: boolean
  play: (episode: PublicEpisode, showTitle: string) => void
  toggle: () => void
  seek: (secs: number) => void
  skip: (delta: number) => void
}

const PlayerContext = createContext<PlayerState | null>(null)

export function usePodcastPlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePodcastPlayer must be used within PodcastPlayerProvider')
  return ctx
}

// Mounted once, high in the tree (inside SiteChrome, above page content) so
// the <audio> element and playback state survive client-side navigation
// between /podcasts pages — this is what makes the mini-player feel like
// Apple Podcasts instead of resetting every time you tap into a show.
export function PodcastPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loading, setLoading] = useState(false)
  const [locked, setLocked] = useState(false)

  const play = useCallback(async (episode: PublicEpisode, showTitle: string) => {
    const sameEpisode = nowPlaying?.episode.id === episode.id
    if (sameEpisode) {
      const a = audioRef.current
      if (a) { playing ? a.pause() : a.play(); setPlaying((p) => !p) }
      return
    }

    setLoading(true)
    setLocked(false)
    setNowPlaying({ episode, showTitle })
    setPlaying(false)
    setCurrent(0)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowPlaying, playing])

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

  const skip = useCallback((delta: number) => {
    const a = audioRef.current
    if (a) a.currentTime = Math.max(0, Math.min((a.duration || 0), a.currentTime + delta))
  }, [])

  return (
    <PlayerContext.Provider value={{ nowPlaying, playing, current, duration, loading, locked, play, toggle, seek, skip }}>
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />
      {children}
    </PlayerContext.Provider>
  )
}