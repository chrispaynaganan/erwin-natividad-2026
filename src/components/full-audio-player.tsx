'use client'
import { IconPlayerPlay, IconPlayerPause, IconRewindBackward10, IconRewindForward10, IconVolume } from '@tabler/icons-react'
import { useRef, useState } from 'react'

export function FullAudioPlayer({ src, durationLabel }: { src?: string; durationLabel?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(279)

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`
  const total = !src && durationLabel ? durationLabel : fmt(duration)

  const toggle = () => { const a = audioRef.current; if (a && src) { playing ? a.pause() : a.play() } setPlaying((p) => !p) }
  const skip = (d: number) => { const a = audioRef.current; if (a && src) a.currentTime = Math.max(0, a.currentTime + d) }

  const round = { width: 44, height: 44, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as const

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, flexWrap: 'wrap' }}>
      {src && (
        <audio ref={audioRef} src={src}
          onTimeUpdate={(e) => { const a = e.currentTarget; setCurrent(a.currentTime); setProgress((a.currentTime / (a.duration || 1)) * 100) }}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} onEnded={() => setPlaying(false)} />
      )}
      <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} style={{ ...round, background: 'var(--btn-bg)', color: 'var(--btn-fg)', border: 'none' }}>{playing ? <IconPlayerPause size={18} stroke={1.75} /> : <IconPlayerPlay size={18} stroke={1.75} />}</button>
      <button onClick={() => skip(-10)} aria-label="Back 10 seconds" style={round}><IconRewindBackward10 size={18} stroke={1.75} /></button>
      <button onClick={() => skip(10)} aria-label="Forward 10 seconds" style={round}><IconRewindForward10 size={18} stroke={1.75} /></button>
      <div style={{ flex: 1, minWidth: 160, display: 'grid', gap: 6 }}>
        <div style={{ height: 6, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>{fmt(current)}</span><span>{total}</span>
        </div>
      </div>
      <span aria-hidden style={{ color: 'var(--text-muted)', display: 'inline-flex' }}><IconVolume size={18} stroke={1.75} /></span>
    </div>
  )
}