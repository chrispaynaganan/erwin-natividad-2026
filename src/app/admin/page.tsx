import Link from 'next/link'
import { getSessionProfile } from '@/lib/auth'

const cards = [
  { href: '/admin/content', title: 'Content', desc: 'Edit homepage text, services, featured work, testimonials, client logos, and the nav logo.' },
  { href: '/admin/bookings', title: 'Bookings', desc: 'Discovery-call requests and the waitlist queue.' },
  { href: '/admin/subscribers', title: 'Subscribers', desc: 'Newsletter sign-ups and their status.' },
  { href: '/admin/blog', title: 'Blog', desc: 'Write and publish posts.' },
]

export default async function AdminDashboard() {
  const session = await getSessionProfile()
  return (
    <div style={{ maxWidth: 920 }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 600, letterSpacing: '-0.01em' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: '0.9rem' }}>
        Welcome back, {session?.profile.full_name ?? session?.user.email}. Jump into a section below.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginTop: 24 }}>
        {cards.map((c) => (
          <Link key={c.href} href={c.href}
            style={{ display: 'block', padding: 20, borderRadius: 16, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{c.title}</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{c.desc}</p>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 28, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Analytics (plays, subscribers, recent bookings) will surface here once the database is connected.
      </p>
    </div>
  )
}