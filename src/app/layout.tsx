import { getSessionProfile, hasMinRole } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { SignOutButton } from '@/components/signout-button'
import { AdminLogin } from '@/components/admin/admin-login'
import { AdminMain } from '@/components/admin/admin-main'
import s from './admin-shell.module.css'

export const metadata = { robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionProfile()

  if (!session) {
    return <AdminLogin />
  }

  if (!hasMinRole(session.profile.role, 'viewer')) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', background: 'var(--bg)', color: 'var(--text)' }}>
        <div style={{ textAlign: 'center' }}>
          <h1>No admin access</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.25rem' }}>
            This account isn&rsquo;t authorized for the admin panel.
          </p>
          <SignOutButton />
        </div>
      </div>
    )
  }

  return (
    <div className={s.shell}>
      <AdminSidebar role={session.profile.role} />
      <div className={s.body}>
        <header className={s.header}>
          <span className={s.who}>
            Signed in as {session.profile.full_name ?? 'staff'} · <span className={s.role}>{session.profile.role}</span>
          </span>
          <SignOutButton />
        </header>
        <AdminMain>{children}</AdminMain>
        <footer className={s.footer}>Erwin Natividad · admin v0.1.0</footer>
      </div>
    </div>
  )
}