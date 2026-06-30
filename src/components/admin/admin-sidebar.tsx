'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { AppRole } from '@/lib/auth'

type Item = { href: string; label: string; min: AppRole; group: string }

const items: Item[] = [
  { href: '/admin', label: 'Dashboard', min: 'viewer', group: 'Overview' },
  { href: '/admin/content', label: 'Content', min: 'editor', group: 'Site' },
  { href: '/admin/bookings', label: 'Bookings', min: 'editor', group: 'Site' },
  { href: '/admin/subscribers', label: 'Subscribers', min: 'editor', group: 'Site' },
  { href: '/admin/blog', label: 'Blog', min: 'editor', group: 'Content' },
  { href: '/admin/episodes', label: 'Episodes', min: 'editor', group: 'Content' },
  { href: '/admin/shows', label: 'Shows', min: 'editor', group: 'Content' },
  { href: '/admin/members', label: 'Members', min: 'admin', group: 'Admin' },
  { href: '/admin/payments', label: 'Payments', min: 'admin', group: 'Admin' },
  { href: '/admin/team', label: 'Team', min: 'admin', group: 'Admin' },
  { href: '/admin/settings', label: 'Settings', min: 'admin', group: 'Admin' },
]

const RANK: Record<AppRole, number> = { member: 0, viewer: 1, editor: 2, admin: 3, owner: 4 }

export function AdminSidebar({ role }: { role: AppRole }) {
  const pathname = usePathname()
  const visible = items.filter((i) => RANK[role] >= RANK[i.min])
  const groups = Array.from(new Set(visible.map((i) => i.group)))

  return (
    <aside style={{ width: 220, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--surface)', minHeight: '100vh', padding: '20px 0' }}>
      <div style={{ padding: '0 20px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', color: 'var(--btn-fg)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>en</span>
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Admin</span>
      </div>
      <nav>
        {groups.map((g) => (
          <div key={g} style={{ marginBottom: 14 }}>
            <p style={{ padding: '0 20px', fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>{g}</p>
            {visible.filter((i) => i.group === g).map((i) => {
              const active = pathname === i.href || (i.href !== '/admin' && pathname.startsWith(i.href))
              return (
                <Link key={i.href} href={i.href}
                  style={{ display: 'block', margin: '0 10px', padding: '8px 12px', borderRadius: 8, fontSize: '0.875rem',
                    color: active ? 'var(--btn-fg)' : 'var(--text)',
                    background: active ? 'var(--accent-soft)' : 'transparent',
                    fontWeight: active ? 600 : 400 }}>
                  {i.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}