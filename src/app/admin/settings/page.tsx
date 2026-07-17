import { requireRole } from '@/lib/auth'
import { SettingsForm } from './settings-form'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await requireRole('viewer')

  return (
    <div>
      <h1 style={{ fontSize: '28px' }}>Settings</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        Manage your profile, notifications, and admin dashboard preferences.
      </p>
      <SettingsForm email={session.user.email ?? ''} profile={session.profile} />
    </div>
  )
}