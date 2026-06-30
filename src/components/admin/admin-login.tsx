'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Inline credentials screen shown at /admin when no one is signed in.
// No public chrome, no Chris branding — this is Erwin's panel.
export function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    // Session cookie is set; re-render the layout (now authenticated).
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', background: 'var(--color-bg)' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', textAlign: 'center' }}>Admin</h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Sign in to continue</p>

        {error && (
          <p role="alert" style={{ marginTop: '1.25rem', color: '#b3261e', textAlign: 'center' }}>{error}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem', marginTop: '1.5rem' }}>
          <label style={{ display: 'grid', gap: '0.3rem' }}>
            <span>Email</span>
            <input type="email" required autoComplete="email" value={email}
              onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.3rem' }}>
            <span>Password</span>
            <input type="password" required autoComplete="current-password" value={password}
              onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </label>
          <button type="submit" disabled={loading} style={{ ...btnStyle, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={{ marginTop: '1.25rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <Link href="/forgot-password">Forgot password?</Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = { padding: '0.6rem 0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', background: 'var(--color-bg-surface)', font: 'inherit' } as const
const btnStyle = { padding: '0.7rem 1rem', background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', font: 'inherit' } as const