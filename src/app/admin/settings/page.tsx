import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { getSiteContent } from '@/lib/content/store'
import { SettingsForm } from './settings-form'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await requireRole('admin')
  const { themeMode } = await getSiteContent()

  const supabase = await createClient()
  const { data: calendlyRow } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'calendly_url')
    .maybeSingle()
  const calendlyUrl = (typeof calendlyRow?.value === 'string' ? calendlyRow.value : '') || ''

  return (
    <div>
      <h1 style={{ fontSize: '28px' }}>Settings</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        Manage your profile, notifications, and admin dashboard preferences.
      </p>
      <SettingsForm
        email={session.user.email ?? ''}
        profile={session.profile}
        themeMode={themeMode}
        calendlyUrl={calendlyUrl}
      />
    </div>
  )
}