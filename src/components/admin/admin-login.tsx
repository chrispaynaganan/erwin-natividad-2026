'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// Inline credentials screen shown at /admin when no one is signed in.
export function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      // Watchdog: if Supabase can't be reached, surface a message instead of spinning forever.
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out reaching Supabase')), 12000),
      )
      const { error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        timeout,
      ])
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      // Hard reload so the server re-reads the fresh session cookie and renders the panel.
      window.location.assign('/admin')
    } catch (err) {
      setError(
        (err instanceof Error ? err.message : 'Sign-in failed') +
        ' — check your Supabase URL/keys in .env.local, then stop and restart the dev server (Ctrl+C, then npm run dev).',
      )
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ width: '100%', maxWidth: 380, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem', boxShadow: 'var(--shadow)' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 600, textAlign: 'center', letterSpacing: '-0.01em' }}>Admin</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.9rem' }}>Sign in to continue</p>

        {error && (
          <p role="alert" style={{ marginTop: '1.25rem', color: '#C0392B', textAlign: 'center', fontSize: '0.85rem', lineHeight: 1.5 }}>{error}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem', marginTop: '1.5rem' }}>
          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email</span>
            <input type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Password</span>
            <input type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </label>
          <button type="submit" disabled={loading} className="btn btnSolid" style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <Link href="/forgot-password" style={{ color: 'var(--accent-soft)' }}>Forgot password?</Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '0.6rem 0.75rem', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', background: 'var(--bg)', color: 'var(--text)',
  font: 'inherit', fontSize: '0.9rem',
} as const