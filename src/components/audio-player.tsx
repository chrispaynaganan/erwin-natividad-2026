'use client'
import { useRef, useState } from 'react'

// Compact audio player matching the design (play/pause, progress, time, volume).
// Pass src to make it play real audio; without src it shows the control UI.
export function AudioPlayer({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(12)

  function fmt(s: number) {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  function toggle() {
    const a = audioRef.current
    if (a && src) {
      if (playing) a.pause()
      else a.play()
    }
    setPlaying((p) => !p)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
      {src && (
        <audio ref={audioRef} src={src}
          onTimeUpdate={(e) => { const a = e.currentTarget; setCurrent(a.currentTime); setProgress((a.currentTime / (a.duration || 1)) * 100) }}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setPlaying(false)} />
      )}
      <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}
        style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', border: 'none', background: 'var(--btn-bg)', color: 'var(--btn-fg)', cursor: 'pointer', flexShrink: 0 }}>
        {playing ? '\u275A\u275A' : '\u25B6'}
      </button>
      <div style={{ flex: 1, display: 'grid', gap: 4 }}>
        <div style={{ height: 4, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>{fmt(current)}</span><span>{fmt(duration)}</span>
        </div>
      </div>
      <span aria-hidden style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{'\u{1F50A}'}</span>
    </div>
  )
}