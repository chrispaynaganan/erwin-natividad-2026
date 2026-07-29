'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef, useState } from 'react'
import type { AppRole } from '@/lib/auth'
import {
  LayoutDashboard,
  FileText,
  CalendarCheck,
  Users,
  Search,
  Newspaper,
  Mic,
  Briefcase,
  CreditCard,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import s from './admin-sidebar.module.css'

type Item = { href: string; label: string; min: AppRole; group: string; match?: string[]; icon: LucideIcon }

const items: Item[] = [
  { href: '/admin', label: 'Dashboard', min: 'viewer', group: 'Overview', icon: LayoutDashboard },
  { href: '/admin/content', label: 'Content', min: 'editor', group: 'Site', icon: FileText },
  { href: '/admin/bookings', label: 'Bookings', min: 'editor', group: 'Site', icon: CalendarCheck },
  { href: '/admin/subscribers', label: 'Subscribers', min: 'editor', group: 'Site', icon: Users },
  { href: '/admin/seo', label: 'SEO Health', min: 'editor', group: 'Site', icon: Search },
  { href: '/admin/blog', label: 'Blog', min: 'editor', group: 'Content', icon: Newspaper },
  { href: '/admin/shows', label: 'Podcasts', min: 'editor', group: 'Content', match: ['/admin/episodes'], icon: Mic },
  { href: '/admin/projects', label: 'Projects', min: 'editor', group: 'Content', icon: Briefcase },
  { href: '/admin/payments', label: 'Payments', min: 'admin', group: 'Admin', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', min: 'admin', group: 'Admin', icon: Settings },
]

const RANK: Record<AppRole, number> = { member: 0, viewer: 1, editor: 2, admin: 3, owner: 4 }

export function AdminSidebar({ role }: { role: AppRole }) {
  const pathname = usePathname()
  const visible = items.filter((i) => RANK[role] >= RANK[i.min])
  const groups = Array.from(new Set(visible.map((i) => i.group)))
  const navRef = useRef<HTMLElement>(null)
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null)

  const isActive = (item: Item) => {
    const prefixes = [item.href, ...(item.match ?? [])]
    return prefixes.some((p) => pathname === p || (p !== '/admin' && pathname.startsWith(p)))
  }

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const activeEl = nav.querySelector<HTMLElement>('[data-active="true"]')
    if (activeEl) {
      setIndicator({ top: activeEl.offsetTop, height: activeEl.offsetHeight })
    } else {
      setIndicator(null)
    }
  }, [pathname])

  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <span className={s.mark}>en</span>
        <span className={s.brandLabel}>Admin</span>
      </div>
      <nav ref={navRef} className={s.nav}>
        {indicator && (
          <span
            className={s.indicator}
            style={{ transform: `translateY(${indicator.top}px)`, height: indicator.height }}
            aria-hidden
          />
        )}
        {groups.map((g) => (
          <div key={g} className={s.group}>
            <p className={s.groupLabel}>{g}</p>
            {visible.filter((i) => i.group === g).map((i) => {
              const active = isActive(i)
              const Icon = i.icon
              return (
                <Link
                  key={i.href}
                  href={i.href}
                  data-active={active || undefined}
                  className={`${s.link} ${active ? s.linkActive : ''}`}
                >
                  <Icon className={s.icon} size={17} strokeWidth={2} aria-hidden />
                  <span>{i.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}