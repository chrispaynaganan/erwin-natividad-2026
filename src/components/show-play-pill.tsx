'use client'
import { useRef, useState, useEffect } from 'react'
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react'
import s from '@/app/podcasts/podcasts.module.css'

const fmt = (secs: number) => {
  if (!Number.isFinite(secs) || secs <= 0) return ''
  const m = Math.round(secs / 60)
  return `${m}m`
}

// Standalone play pill for a show's intro clip — deliberately NOT wired
// into the episode player context (usePodcastPlayer). This is a separate,
// short-lived clip, not part of the episode queue, so it shouldn't
// interact with the persistent mini-player's prev/next or override
// whatever episode is currently playing there. It just owns its own
// <audio> element and local state.
export function ShowPlayPill({
  introAudioUrl,
  introDurationSecs,
}: {
  introAudioUrl: string
  introDurationSecs: number | null
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(introDurationSecs ?? 0)

  useEffect(() => {
    // Pause and reset if this pill unmounts (e.g. navigating away).
    return () => { audioRef.current?.pause() }
  }, [])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) a.pause(); else a.play()
    setPlaying((p) => !p)
  }

  const progress = duration ? (current / duration) * 100 : 0
  const label = duration ? fmt(duration - current) : ''

  return (
    <button type="button" className={s.showPlayPill} onClick={toggle}>
      <span className={s.showPlayBtn}>
        {playing ? <IconPlayerPause size={16} stroke={2} /> : <IconPlayerPlay size={16} stroke={2} />}
      </span>
      <span className={s.showPlayTrack}>
        <span className={s.showPlayFill} style={{ width: `${progress}%` }} />
      </span>
      {label && <span className={s.showPlayDuration}>{label}</span>}

      <audio
        ref={audioRef}
        src={introAudioUrl}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); setCurrent(0) }}
      />
    </button>
  )
}