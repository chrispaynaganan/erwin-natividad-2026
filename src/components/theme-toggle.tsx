'use client'
import { useEffect, useState } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'

// Light/dark toggle. Persists to localStorage; the inline script in layout.tsx
// applies the saved theme before paint to avoid a flash.
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as 'light' | 'dark') || 'light'
    setTheme(current)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
    setTheme(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: 'none',
        background: 'var(--surface-2)', color: 'var(--text)', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
      }}
    >
      {theme === 'dark' ? <IconSun size={18} stroke={1.75} /> : <IconMoon size={18} stroke={1.75} />}
    </button>
  )
}