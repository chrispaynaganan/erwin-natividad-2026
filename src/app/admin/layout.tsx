import { requireRole } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export const metadata = { robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Must be staff (viewer or higher). Members/anon are redirected.
  const { profile } = await requireRole('viewer')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <AdminSidebar role={profile.role} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
        <footer style={{ padding: '1rem 2rem', borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>v0.1.0</span>
          <span><a href="/admin/settings">Documentation</a> · <a href="/admin/settings">Support</a></span>
        </footer>
      </div>
    </div>
  )
}
