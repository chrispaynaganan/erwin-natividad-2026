import { getSessionProfile, hasMinRole } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { SignOutButton } from '@/components/signout-button'
import { AdminLogin } from '@/components/admin/admin-login'

export const metadata = { robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionProfile()

  // Not signed in -> show the credentials screen right here at /admin.
  if (!session) {
    return <AdminLogin />
  }

  // Signed in but not staff -> blocked (shouldn't happen in single-account setup).
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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <AdminSidebar role={session.profile.role} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 2rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Signed in as {session.profile.full_name ?? 'staff'} · <span style={{ color: 'var(--accent-soft)' }}>{session.profile.role}</span>
          </span>
          <SignOutButton />
        </header>
        <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
        <footer style={{ padding: '0.85rem 2rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          Erwin Natividad · admin v0.1.0
        </footer>
      </div>
    </div>
  )
}