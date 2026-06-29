'use client'
import { useState } from 'react'

// "My Journey" prose — full on desktop, clamped with a "See full read" on mobile.
export function Journey({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className={`jrny ${open ? 'jrnyOpen' : ''}`}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ color: 'var(--text-muted)', marginBottom: 14, fontSize: '0.95rem', lineHeight: 1.75, maxWidth: '64ch' }}>{p}</p>
        ))}
      </div>
      {!open && (
        <button className="jrnyBtn btn btnOutline" style={{ marginTop: 8 }} onClick={() => setOpen(true)}>See full read</button>
      )}
      <style>{`
        @media (max-width: 768px) {
          .jrny:not(.jrnyOpen) { max-height: 280px; overflow: hidden;
            -webkit-mask-image: linear-gradient(to bottom, #000 60%, transparent);
            mask-image: linear-gradient(to bottom, #000 60%, transparent); }
          .jrnyBtn { display: inline-flex; }
        }
        @media (min-width: 769px) { .jrnyBtn { display: none; } }
      `}</style>
    </div>
  )
}