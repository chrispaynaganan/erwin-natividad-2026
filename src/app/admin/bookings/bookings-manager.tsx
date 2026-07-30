'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  IconChevronDown, IconArrowUpCircle, IconSearch, IconMail, IconPhone,
  IconWorld, IconCircleCheck, IconAlertTriangle, IconCalendarStats,
} from '@tabler/icons-react'
import { setBookingStatus, promoteFromWaitlist, type ActionResult } from './actions'
import { BOOKING_STATUSES, type BookingRow, type BookingStatus } from './types'
import s from './bookings.module.css'

type TabKey = 'active' | 'waitlist' | 'archive'
type SourceKey = 'all' | 'discovery_call' | 'contact_form'

const WINDOW_DAYS = 7

const isArchived = (r: BookingRow) => r.status === 'completed' || r.status === 'cancelled'
const tabOf = (r: BookingRow): TabKey => (isArchived(r) ? 'archive' : r.waitlisted ? 'waitlist' : 'active')

const sourceLabel = (src: string | null) =>
  src === 'discovery_call' ? 'Discovery call' : src === 'contact_form' ? 'Contact form' : 'Other'

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

const fmtPreferred = (r: BookingRow) =>
  [r.preferred_date, r.preferred_time, r.timezone].filter(Boolean).join(' \u00b7 ') || '—'

export function BookingsManager({ initial }: { initial: BookingRow[] }) {
  const [rows, setRows] = useState<BookingRow[]>(initial)
  const [tab, setTab] = useState<TabKey>('active')
  const [source, setSource] = useState<SourceKey>('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [msg, setMsg] = useState<ActionResult | null>(null)
  const [pending, start] = useTransition()

  // Informational only — the real weekly limit lives in Calendly's own
  // event settings (Availability → Limit the frequency of bookings), not
  // here. This just reflects how many confirmed discovery calls landed via
  // Calendly in the last 7 days.
  const weekCount = useMemo(() => {
    const since = Date.now() - WINDOW_DAYS * 86400000
    return rows.filter((r) =>
      r.referral_source === 'discovery_call' && r.status !== 'cancelled' &&
      Date.parse(r.created_at) >= since,
    ).length
  }, [rows])

  const counts = useMemo(() => {
    const c = { active: 0, waitlist: 0, archive: 0 }
    for (const r of rows) c[tabOf(r)]++
    return c
  }, [rows])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (tabOf(r) !== tab) return false
      if (source !== 'all' && r.referral_source !== source) return false
      if (!q) return true
      return [r.full_name, r.email, r.company, r.service_interest]
        .some((v) => v && v.toLowerCase().includes(q))
    })
  }, [rows, tab, source, query])

  function patchRow(id: string, patch: Partial<BookingRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function changeStatus(id: string, status: BookingStatus) {
    const before = rows.find((r) => r.id === id)?.status
    patchRow(id, { status }) // optimistic
    setMsg(null)
    start(async () => {
      const res = await setBookingStatus(id, status)
      setMsg(res)
      if (!res.ok && before) patchRow(id, { status: before }) // roll back
    })
  }

  function promote(id: string) {
    setMsg(null)
    start(async () => {
      const res = await promoteFromWaitlist(id)
      setMsg(res)
      if (res.ok) patchRow(id, { waitlisted: false })
    })
  }

  return (
    <div className={s.wrap}>
      <header className={s.head}>
        <div>
          <h1 className={s.h1}>Bookings</h1>
          <p className={s.sub}>Discovery calls booked via Calendly and contact-form messages. New submissions land here automatically.</p>
        </div>

        <div className={s.capBox}>
          <span className={s.capLabel}><IconCalendarStats size={15} stroke={1.75} /> Discovery calls this week</span>
          <span className={s.capValue}><strong>{weekCount}</strong></span>
          <span className={s.capHint}>
            The weekly limit is set in Calendly (Discovery Call event → Availability → Limit the
            frequency of bookings) — this number is just a record of what came through, not a control.
          </span>
        </div>
      </header>

      {msg && (
        <p className={msg.ok ? s.ok : s.err} role="status">
          {msg.ok ? <IconCircleCheck size={16} stroke={1.75} /> : <IconAlertTriangle size={16} stroke={1.75} />} {msg.message}
        </p>
      )}

      <div className={s.toolbar}>
        <nav className={s.tabs}>
          {([
            ['active', `Active (${counts.active})`],
            ['waitlist', `Waitlist (${counts.waitlist})`],
            ['archive', `Archive (${counts.archive})`],
          ] as [TabKey, string][]).map(([key, label]) => (
            <button key={key} type="button" onClick={() => { setTab(key); setOpenId(null) }}
              className={tab === key ? `${s.tab} ${s.tabActive}` : s.tab}>{label}</button>
          ))}
        </nav>

        <div className={s.filters}>
          {([
            ['all', 'All sources'],
            ['discovery_call', 'Discovery calls'],
            ['contact_form', 'Contact messages'],
          ] as [SourceKey, string][]).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setSource(key)}
              className={source === key ? `${s.chip} ${s.chipActive}` : s.chip}>{label}</button>
          ))}
          <span className={s.searchWrap}>
            <IconSearch size={15} stroke={1.75} className={s.searchIcon} />
            <input className={s.search} placeholder={'Search name, email, company…'} value={query}
              onChange={(e) => setQuery(e.target.value)} aria-label="Search bookings" />
          </span>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className={s.empty}>
          {tab === 'active' && 'No active requests right now. New Calendly bookings and contact-form messages will appear here.'}
          {tab === 'waitlist' && 'The waitlist is empty. New discovery-call bookings go through Calendly now, so nothing new gets waitlisted — this tab only holds requests from before the switch.'}
          {tab === 'archive' && 'Nothing archived yet — completed and cancelled requests end up here.'}
        </p>
      ) : (
        <div className={s.list}>
          {shown.map((r) => {
            const open = openId === r.id
            return (
              <article key={r.id} className={s.card}>
                <button type="button" className={s.cardHead} aria-expanded={open}
                  onClick={() => setOpenId(open ? null : r.id)}>
                  <span className={s.who}>
                    <span className={s.name}>{r.full_name}</span>
                    <span className={s.email}>{r.email}</span>
                  </span>
                  <span className={`${s.badge} ${r.referral_source === 'discovery_call' ? s.badgeGold : s.badgePlain}`}>
                    {sourceLabel(r.referral_source)}
                  </span>
                  {r.calendly_invitee_uri && <span className={s.badge}>Via Calendly</span>}
                  {r.service_interest && <span className={s.interest}>{r.service_interest}</span>}
                  <span className={s.date}>{fmtDateTime(r.created_at)}</span>
                  <span className={`${s.chev} ${open ? s.chevOpen : ''}`}><IconChevronDown size={16} stroke={1.75} /></span>
                </button>

                <div className={s.cardRow}>
                  <label className={s.statusWrap}>
                    <span className={s.statusLabel}>Status</span>
                    <select className={`${s.statusSelect} ${s['st_' + r.status]}`} value={r.status}
                      onChange={(e) => changeStatus(r.id, e.target.value as BookingStatus)} disabled={pending}>
                      {BOOKING_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </label>

                  {r.waitlisted && !isArchived(r) && (
                    <button type="button" className={s.promoteBtn} onClick={() => promote(r.id)} disabled={pending}>
                      <IconArrowUpCircle size={16} stroke={1.75} /> Promote to active
                    </button>
                  )}

                  <a className={s.replyBtn} href={`mailto:${r.email}?subject=${encodeURIComponent('Re: your request — Erwin Natividad')}`}>
                    <IconMail size={16} stroke={1.75} /> Reply
                  </a>
                </div>

                {open && (
                  <div className={s.detail}>
                    <div className={s.detailGrid}>
                      <div><span className={s.dLabel}>Company</span><span className={s.dValue}>{r.company || '—'}</span></div>
                      <div><span className={s.dLabel}>Preferred time</span><span className={s.dValue}>{fmtPreferred(r)}</span></div>
                      <div>
                        <span className={s.dLabel}>Phone</span>
                        <span className={s.dValue}>{r.phone
                          ? <a className={s.dLink} href={`tel:${r.phone}`}><IconPhone size={14} stroke={1.75} /> {r.phone}</a>
                          : '—'}</span>
                      </div>
                      <div>
                        <span className={s.dLabel}>Website</span>
                        <span className={s.dValue}>{r.website
                          ? <a className={s.dLink} href={r.website} target="_blank" rel="noreferrer"><IconWorld size={14} stroke={1.75} /> {r.website}</a>
                          : '—'}</span>
                      </div>
                    </div>
                    <div className={s.message}>
                      <span className={s.dLabel}>Message</span>
                      <p className={s.messageText}>{r.message || '—'}</p>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}