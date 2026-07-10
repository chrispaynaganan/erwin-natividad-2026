'use client'

import { useState, useTransition } from 'react'
import type { SessionProfile } from '@/lib/auth'
import { saveProfile, updateEmail, updatePassword, type SaveState } from './actions'

type Profile = SessionProfile['profile']

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'UTC',
]

const DATE_FORMATS: { value: string; label: string }[] = [
  { value: 'MMM D, YYYY', label: 'MMM D, YYYY  (Jan 5, 2026)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY  (01/05/2026)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY  (05/01/2026)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD  (2026-01-05)' },
]

// NOTE: these CSS variable names (--color-surface, --color-border, etc.)
// are inferred from the one confirmed real usage in this file's previous
// stub (`var(--color-text-muted)`) plus the token names documented in the
// project's brand-tokens table. I don't have globals.css itself to confirm
// the surface/border names exactly — if this section renders with no
// visible card background/border, that's the first thing to check.
const card: React.CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 12,
  padding: 24,
  marginTop: 24,
}
const label: React.CSSProperties = { display: 'block', fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 6 }
const input: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid var(--color-border)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
}
const field: React.CSSProperties = { marginBottom: 16 }
const row2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }

function StatusLine({ msg }: { msg: SaveState }) {
  if (!msg) return null
  return <p style={{ marginTop: 12, color: msg.ok ? 'var(--accent)' : '#c0392b', fontSize: 14 }}>{msg.message}</p>
}

export function SettingsForm({ email, profile }: { email: string; profile: Profile }) {
  return (
    <>
      <ProfileSection email={email} profile={profile} />
      <NotificationsSection profile={profile} />
      <DefaultsSection profile={profile} />
      <AppearanceComingSoon />
    </>
  )
}

function ProfileSection({ email, profile }: { email: string; profile: Profile }) {
  const [fullName, setFullName] = useState(profile.full_name ?? '')
  const [newEmail, setNewEmail] = useState(email)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [savingName, startName] = useTransition()
  const [savingEmail, startEmail] = useTransition()
  const [savingPassword, startPassword] = useTransition()
  const [nameMsg, setNameMsg] = useState<SaveState>(null)
  const [emailMsg, setEmailMsg] = useState<SaveState>(null)
  const [passwordMsg, setPasswordMsg] = useState<SaveState>(null)

  function saveName() {
    startName(async () => {
      const res = await saveProfile({
        full_name: fullName,
        timezone: profile.timezone,
        date_format: profile.date_format,
        notify_new_booking: profile.notify_new_booking,
        notify_new_subscriber: profile.notify_new_subscriber,
        notify_new_contact: profile.notify_new_contact,
      })
      setNameMsg(res)
    })
  }

  function saveEmail() {
    startEmail(async () => {
      setEmailMsg(await updateEmail(newEmail))
    })
  }

  function savePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, message: 'Passwords don\u2019t match.' })
      return
    }
    startPassword(async () => {
      const res = await updatePassword(newPassword)
      setPasswordMsg(res)
      if (res?.ok) { setNewPassword(''); setConfirmPassword('') }
    })
  }

  return (
    <section style={card}>
      <h2 style={{ marginTop: 0 }}>Profile</h2>

      <div style={field}>
        <label style={label}>Full name</label>
        <input style={input} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <button type="button" className="btn btnSolid" style={{ marginTop: 10 }} onClick={saveName} disabled={savingName}>
          {savingName ? 'Saving\u2026' : 'Save name'}
        </button>
        <StatusLine msg={nameMsg} />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '20px 0' }} />

      <div style={field}>
        <label style={label}>Email address</label>
        <input style={input} type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        <button type="button" className="btn btnOutline" style={{ marginTop: 10 }} onClick={saveEmail} disabled={savingEmail}>
          {savingEmail ? 'Sending\u2026' : 'Update email'}
        </button>
        <StatusLine msg={emailMsg} />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '20px 0' }} />

      <div style={row2}>
        <div style={field}>
          <label style={label}>New password</label>
          <input style={input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" />
        </div>
        <div style={field}>
          <label style={label}>Confirm new password</label>
          <input style={input} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
      </div>
      <button type="button" className="btn btnOutline" onClick={savePassword} disabled={savingPassword || !newPassword}>
        {savingPassword ? 'Updating\u2026' : 'Update password'}
      </button>
      <StatusLine msg={passwordMsg} />
    </section>
  )
}

function NotificationsSection({ profile }: { profile: Profile }) {
  const [notifyBooking, setNotifyBooking] = useState(profile.notify_new_booking)
  const [notifySubscriber, setNotifySubscriber] = useState(profile.notify_new_subscriber)
  const [notifyContact, setNotifyContact] = useState(profile.notify_new_contact)
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<SaveState>(null)

  function save() {
    start(async () => {
      const res = await saveProfile({
        full_name: profile.full_name ?? '',
        timezone: profile.timezone,
        date_format: profile.date_format,
        notify_new_booking: notifyBooking,
        notify_new_subscriber: notifySubscriber,
        notify_new_contact: notifyContact,
      })
      setMsg(res)
    })
  }

  return (
    <section style={card}>
      <h2 style={{ marginTop: 0 }}>Notifications</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginTop: -8, marginBottom: 16 }}>
        Email alerts require Resend to be configured (RESEND_API_KEY / BOOKING_NOTIFY_EMAIL) — these toggles are ready for when that\u2019s set up.
      </p>

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <input type="checkbox" checked={notifyBooking} onChange={(e) => setNotifyBooking(e.target.checked)} />
        Email me when a new booking comes in
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <input type="checkbox" checked={notifySubscriber} onChange={(e) => setNotifySubscriber(e.target.checked)} />
        Email me when someone subscribes to the newsletter
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <input type="checkbox" checked={notifyContact} onChange={(e) => setNotifyContact(e.target.checked)} />
        Email me when the contact form is submitted
      </label>

      <button type="button" className="btn btnSolid" onClick={save} disabled={pending}>
        {pending ? 'Saving\u2026' : 'Save notifications'}
      </button>
      <StatusLine msg={msg} />
    </section>
  )
}

function DefaultsSection({ profile }: { profile: Profile }) {
  const [timezone, setTimezone] = useState(profile.timezone)
  const [dateFormat, setDateFormat] = useState(profile.date_format)
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<SaveState>(null)

  function save() {
    start(async () => {
      const res = await saveProfile({
        full_name: profile.full_name ?? '',
        timezone,
        date_format: dateFormat,
        notify_new_booking: profile.notify_new_booking,
        notify_new_subscriber: profile.notify_new_subscriber,
        notify_new_contact: profile.notify_new_contact,
      })
      setMsg(res)
    })
  }

  return (
    <section style={card}>
      <h2 style={{ marginTop: 0 }}>Defaults</h2>
      <div style={row2}>
        <div style={field}>
          <label style={label}>Timezone</label>
          <select style={input} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
        <div style={field}>
          <label style={label}>Date format</label>
          <select style={input} value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
            {DATE_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      </div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 16 }}>
        Saved here for now — other admin pages (Bookings, Episodes, etc.) don\u2019t read this yet; wiring each of those up is a separate follow-up.
      </p>
      <button type="button" className="btn btnSolid" onClick={save} disabled={pending}>
        {pending ? 'Saving\u2026' : 'Save defaults'}
      </button>
      <StatusLine msg={msg} />
    </section>
  )
}

function AppearanceComingSoon() {
  return (
    <section style={card}>
      <h2 style={{ marginTop: 0 }}>Appearance</h2>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Theme is currently a per-browser preference (the moon/sun toggle, saved to localStorage). A saved
        default here is coming once we\u2019ve seen ThemeToggle and the root layout\u2019s no-flash init script \u2014
        wiring it in blind risks breaking that.
      </p>
    </section>
  )
}