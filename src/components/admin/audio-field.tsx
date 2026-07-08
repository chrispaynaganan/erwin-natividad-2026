'use client'

import { useRef, useState } from 'react'
import { IconUpload, IconX, IconLoader2, IconMusic } from '@tabler/icons-react'
import { convertToAAC } from '@/lib/audio/convert'

export type AudioValue = { path: string; url?: string; durationSecs: number; fileName: string }

// Audio picker used across the admin: mirrors ImageField's pattern.
// Converts any browser-playable audio file to AAC (.m4a) in-browser via
// ffmpeg.wasm, then uploads the already-converted file.
//
// For PRIVATE buckets (episode-audio), value.url is undefined — there's
// nothing to preview or play directly; the private path is stored and
// playback goes through a signed URL minted server-side. For PUBLIC buckets
// (project-audio), value.url is a real playable URL, same as ImageField's
// value.
export function AudioField({ label, value, onChange, folder = 'episodes', bucket = 'episode-audio', hint }: {
  label: string
  value: AudioValue | null
  onChange: (v: AudioValue | null) => void
  folder?: string
  bucket?: string
  hint?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState<'idle' | 'converting' | 'uploading'>('idle')
  const [progress, setProgress] = useState(0)
  const [err, setErr] = useState<string | null>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setErr(null)
    setProgress(0)
    try {
      setStage('converting')
      const { file: aac, durationSecs } = await convertToAAC(file, setProgress)

      setStage('uploading')
      const fd = new FormData()
      fd.set('file', aac)
      fd.set('bucket', bucket)
      fd.set('folder', folder)
      const res = await fetch('/api/upload/audio', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Upload failed.')

      onChange({ path: data.path, url: data.url, durationSecs, fileName: aac.name })
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Conversion or upload failed.')
    } finally {
      setBusy(false)
      setStage('idle')
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {value ? (
          <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            <IconMusic size={16} stroke={1.75} />
            <span style={{ fontSize: '0.8rem', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value.fileName}</span>
            {value.durationSecs > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDuration(value.durationSecs)}</span>
            )}
            {value.url && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <audio controls src={value.url} style={{ height: 28, maxWidth: 200 }} />
            )}
            <button type="button" aria-label="Remove audio" onClick={() => onChange(null)}
              style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <IconX size={12} stroke={2} />
            </button>
          </span>
        ) : (
          <span style={{ height: 40, padding: '0 14px', borderRadius: 8, border: '1px dashed var(--border)', display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>No audio uploaded</span>
        )}

        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', font: 'inherit', fontSize: '0.82rem', cursor: busy ? 'wait' : 'pointer' }}>
          {busy ? <IconLoader2 size={15} stroke={1.75} className="spin" /> : <IconUpload size={15} stroke={1.75} />}
          {stage === 'converting' && `Converting\u2026 ${Math.round(progress * 100)}%`}
          {stage === 'uploading' && 'Uploading\u2026'}
          {stage === 'idle' && (value ? 'Replace audio' : 'Upload audio')}
        </button>
        <input ref={inputRef} type="file" accept="audio/*" onChange={onFile} style={{ display: 'none' }} />
      </div>

      <span style={{ display: 'block', fontSize: '0.75rem', color: err ? '#C0392B' : 'var(--text-muted)', marginTop: 6 }}>
        {err ?? hint ?? 'Any audio file works \u2014 it\u2019s converted to AAC (.m4a) in your browser before upload. First conversion loads a ~25MB engine, so it may take a moment.'}
      </span>
      <style>{`.spin { animation: enspin 0.9s linear infinite; } @keyframes enspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = Math.round(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}