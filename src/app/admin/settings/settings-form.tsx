'use client'

import { useState, useTransition } from 'react'
import type { SessionProfile } from '@/lib/auth'
import type { ThemeMode } from '@/lib/content/site-content'
import { saveProfile, updateEmail, updatePassword, saveThemeMode, saveCalendlyUrl, type SaveState } from './actions'
import s from './settings.module.css'

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

const TABS = ['Profile', 'Notifications', 'Defaults', 'Appearance'] as const
type Tab = typeof TABS[number]

function StatusLine({ msg }: { msg: SaveState }) {
  if (!msg) return null
  return <p className={msg.ok ? s.statusOk : s.statusErr}>{msg.message}</p>
}

export function SettingsForm({
  email, profile, themeMode, calendlyUrl,
}: { email: string; profile: Profile; themeMode: ThemeMode; calendlyUrl: string }) {
  const [active, setActive] = useState<Tab>('Profile')

  return (
    <>
      <div className={s.tabs} role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active === tab}
            className={`${s.tab} ${active === tab ? s.tabActive : ''}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === 'Profile' && <ProfileSection email={email} profile={profile} />}
      {active === 'Notifications' && <NotificationsSection profile={profile} />}
      {active === 'Defaults' && <DefaultsSection profile={profile} calendlyUrl={calendlyUrl} />}
      {active === 'Appearance' && <AppearanceSection themeMode={themeMode} />}
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
      setPasswordMsg({ ok: false, message: 'Passwords don’t match.' })
      return
    }
    startPassword(async () => {
      const res = await updatePassword(newPassword)
      setPasswordMsg(res)
      if (res?.ok) { setNewPassword(''); setConfirmPassword('') }
    })
  }

  return (
    <section className={s.card}>
      <h2 style={{ marginTop: 0 }}>Profile</h2>

      <div className={s.field}>
        <label className={s.label}>Full name</label>
        <input className={s.input} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <button type="button" className="btn btnSolid" style={{ marginTop: 10 }} onClick={saveName} disabled={savingName}>
          {savingName ? 'Saving…' : 'Save name'}
        </button>
        <StatusLine msg={nameMsg} />
      </div>

      <hr className={s.hr} />

      <div className={s.field}>
        <label className={s.label}>Email address</label>
        <input className={s.input} type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        <button type="button" className="btn btnOutline" style={{ marginTop: 10 }} onClick={saveEmail} disabled={savingEmail}>
          {savingEmail ? 'Sending…' : 'Update email'}
        </button>
        <StatusLine msg={emailMsg} />
      </div>

      <hr className={s.hr} />

      <div className={s.row2}>
        <div className={s.field}>
          <label className={s.label}>New password</label>
          <input className={s.input} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" />
        </div>
        <div className={s.field}>
          <label className={s.label}>Confirm new password</label>
          <input className={s.input} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
      </div>
      <button type="button" className="btn btnOutline" onClick={savePassword} disabled={savingPassword || !newPassword}>
        {savingPassword ? 'Updating…' : 'Update password'}
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
    <section className={s.card}>
      <h2 style={{ marginTop: 0 }}>Notifications</h2>
      <p className={s.hint} style={{ marginTop: -8, marginBottom: 16 }}>
        Email alerts require Resend to be configured (RESEND_API_KEY / BOOKING_NOTIFY_EMAIL) — these toggles are ready for when that’s set up.
      </p>

      <label className={s.checkboxRow}>
        <input type="checkbox" checked={notifyBooking} onChange={(e) => setNotifyBooking(e.target.checked)} />
        Email me when a new booking comes in
      </label>
      <label className={s.checkboxRow}>
        <input type="checkbox" checked={notifySubscriber} onChange={(e) => setNotifySubscriber(e.target.checked)} />
        Email me when someone subscribes to the newsletter
      </label>
      <label className={s.checkboxRow} style={{ marginBottom: 16 }}>
        <input type="checkbox" checked={notifyContact} onChange={(e) => setNotifyContact(e.target.checked)} />
        Email me when the contact form is submitted
      </label>

      <button type="button" className="btn btnSolid" onClick={save} disabled={pending}>
        {pending ? 'Saving…' : 'Save notifications'}
      </button>
      <StatusLine msg={msg} />
    </section>
  )
}

function DefaultsSection({ profile, calendlyUrl }: { profile: Profile; calendlyUrl: string }) {
  const [timezone, setTimezone] = useState(profile.timezone)
  const [dateFormat, setDateFormat] = useState(profile.date_format)
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<SaveState>(null)

  const [calendly, setCalendly] = useState(calendlyUrl)
  const [savingCalendly, startCalendly] = useTransition()
  const [calendlyMsg, setCalendlyMsg] = useState<SaveState>(null)

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

  function saveCalendly() {
    startCalendly(async () => {
      setCalendlyMsg(await saveCalendlyUrl(calendly))
    })
  }

  return (
    <section className={s.card}>
      <h2 style={{ marginTop: 0 }}>Defaults</h2>
      <div className={s.row2}>
        <div className={s.field}>
          <label className={s.label}>Timezone</label>
          <select className={s.input} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </div>
        <div className={s.field}>
          <label className={s.label}>Date format</label>
          <select className={s.input} value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
            {DATE_FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      </div>
      <p className={s.hint} style={{ marginBottom: 16 }}>
        Saved here for now — other admin pages (Bookings, Episodes, etc.) don’t read this yet; wiring each of those up is a separate follow-up.
      </p>
      <button type="button" className="btn btnSolid" onClick={save} disabled={pending}>
        {pending ? 'Saving…' : 'Save defaults'}
      </button>
      <StatusLine msg={msg} />

      <hr className={s.hr} />

      <div className={s.field}>
        <label className={s.label}>Discovery Call link (Calendly)</label>
        <input
          className={s.input}
          value={calendly}
          onChange={(e) => setCalendly(e.target.value)}
          placeholder="https://calendly.com/your-handle/discovery-call"
        />
        <p className={s.hint} style={{ marginTop: 6 }}>
          This is the scheduling widget shown on the public Work With Me page. The weekly booking
          limit itself is set separately, directly on this event in Calendly (Availability →
          Limit the frequency of bookings) — changing this link doesn’t affect that limit.
        </p>
        <button type="button" className="btn btnSolid" style={{ marginTop: 10 }} onClick={saveCalendly} disabled={savingCalendly}>
          {savingCalendly ? 'Saving…' : 'Save Calendly link'}
        </button>
        <StatusLine msg={calendlyMsg} />
      </div>
    </section>
  )
}

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'toggle', label: 'Navbar toggle' },
  { value: 'light', label: 'Light mode only' },
  { value: 'dark', label: 'Dark mode only' },
]

function AppearanceSection({ themeMode }: { themeMode: ThemeMode }) {
  const [selected, setSelected] = useState<ThemeMode>(themeMode)
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<SaveState>(null)

  function choose(mode: ThemeMode) {
    if (mode === selected) return
    if (mode !== 'toggle') {
      const label = mode === 'dark' ? 'dark' : 'light'
      const proceed = confirm(
        `Switching to ${label} mode only will remove the theme toggle from the site’s navigation bar — every visitor will see the site in ${label} mode, with no way to switch. Continue?`
      )
      if (!proceed) return
    }
    setSelected(mode)
    setMsg(null)
  }

  function save() {
    start(async () => {
      const res = await saveThemeMode(selected)
      setMsg(res)
    })
  }

  return (
    <section className={s.card}>
      <h2 style={{ marginTop: 0 }}>Appearance</h2>
      <p className={s.hint} style={{ marginBottom: 16 }}>
        This controls the theme on the public site — not just this admin dashboard.
      </p>

      <div className={s.themeGrid}>
        {THEME_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`${s.themeCard} ${selected === opt.value ? s.themeCardActive : ''}`}
            onClick={() => choose(opt.value)}
          >
            {selected === opt.value && <span className={s.themeCheck}>✓</span>}
            <span className={s.themePreview} data-preview={opt.value}>
              <span className={s.themePreviewBar} />
              <span className={s.themePreviewBar} />
            </span>
            <span className={s.themeLabel}>{opt.label}</span>
          </button>
        ))}
      </div>

      {selected !== 'toggle' && (
        <p className={s.warnBanner}>
          Visitors won’t see a theme switch — the whole site will show in {selected} mode only.
        </p>
      )}

      <button
        type="button"
        className="btn btnSolid"
        onClick={save}
        disabled={pending || selected === themeMode}
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
      <StatusLine msg={msg} />
    </section>
  )
}