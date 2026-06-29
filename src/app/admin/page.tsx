import { getSessionProfile } from '@/lib/auth'

export default async function AdminDashboard() {
  const session = await getSessionProfile()
  return (
    <div>
      <h1 style={{ fontSize: 'var(--text-h2)' }}>Dashboard</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
        Signed in as {session?.profile.full_name ?? session?.user.email} · role: {session?.profile.role}
      </p>
      <p style={{ marginTop: '1.5rem' }}>Analytics widgets land here (plays, subscribers, recent bookings).</p>
    </div>
  )
}
