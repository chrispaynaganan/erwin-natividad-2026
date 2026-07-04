'use client'
import { useRef, useState } from 'react'
import { IconUpload, IconX, IconLoader2 } from '@tabler/icons-react'

// Image picker used across the admin: upload a file (converted to WebP
// automatically by /api/upload) or paste a hosted URL. Value is the URL.
export function ImageField({ label, value, onChange, folder = 'misc', bucket = 'site-media', hint }: {
  label: string
  value: string
  onChange: (url: string) => void
  folder?: string
  bucket?: string
  hint?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setErr(null)
    try {
      const fd = new FormData()
      fd.set('file', file)
      fd.set('bucket', bucket)
      fd.set('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Upload failed.')
      onChange(data.url)
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {value ? (
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" style={{ height: 48, maxWidth: 160, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface-2)', padding: 4 }} />
            <button type="button" aria-label="Remove image" onClick={() => onChange('')}
              style={{ position: 'absolute', top: -7, right: -7, width: 20, height: 20, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <IconX size={12} stroke={2} />
            </button>
          </span>
        ) : (
          <span style={{ height: 48, width: 72, borderRadius: 8, border: '1px dashed var(--border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.7rem' }}>none</span>
        )}

        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', font: 'inherit', fontSize: '0.82rem', cursor: busy ? 'wait' : 'pointer' }}>
          {busy ? <IconLoader2 size={15} stroke={1.75} className="spin" /> : <IconUpload size={15} stroke={1.75} />}
          {busy ? 'Uploading\u2026' : 'Upload image'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={'\u2026or paste an image URL'}
          style={{ flex: 1, minWidth: 200, padding: '9px 12px', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', font: 'inherit', fontSize: '0.85rem' }}
        />
      </div>

      <span style={{ display: 'block', fontSize: '0.75rem', color: err ? '#C0392B' : 'var(--text-muted)', marginTop: 6 }}>
        {err ?? hint ?? 'Uploads are converted to WebP and resized automatically.'}
      </span>
      <style>{`.spin { animation: enspin 0.9s linear infinite; } @keyframes enspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}