'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { AppRole } from '@/lib/auth'

// Items gated by minimum role. Team/Payments/Members/Settings need admin.
const items: { href: string; label: string; min: AppRole }[] = [
  { href: '/admin', label: 'Dashboard', min: 'viewer' },
  { href: '/admin/episodes', label: 'Episodes', min: 'editor' },
  { href: '/admin/shows', label: 'Shows', min: 'editor' },
  { href: '/admin/blog', label: 'Blog', min: 'editor' },
  { href: '/admin/bookings', label: 'Bookings', min: 'editor' },
  { href: '/admin/subscribers', label: 'Subscribers', min: 'editor' },
  { href: '/admin/members', label: 'Members', min: 'admin' },
  { href: '/admin/payments', label: 'Payments', min: 'admin' },
  { href: '/admin/team', label: 'Team', min: 'admin' },
  { href: '/admin/settings', label: 'Settings', min: 'admin' },
]

const RANK: Record<AppRole, number> = { member: 0, viewer: 1, editor: 2, admin: 3, owner: 4 }

export function AdminSidebar({ role }: { role: AppRole }) {
  const pathname = usePathname()
  const visible = items.filter((i) => RANK[role] >= RANK[i.min])

  return (
    <aside style={{ width: 220, borderRight: '1px solid var(--color-border)', padding: '1.5rem 0', minHeight: '100vh' }}>
      <p style={{ padding: '0 1.5rem', fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Admin</p>
      <nav style={{ display: 'grid' }}>
        {visible.map((i) => {
          const active = pathname === i.href
          return (
            <Link
              key={i.href}
              href={i.href}
              style={{
                padding: '0.6rem 1.5rem',
                color: active ? 'var(--color-accent)' : 'var(--color-text)',
                background: active ? 'var(--color-bg-surface)' : 'transparent',
                fontWeight: active ? 600 : 400,
              }}
            >
              {i.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
