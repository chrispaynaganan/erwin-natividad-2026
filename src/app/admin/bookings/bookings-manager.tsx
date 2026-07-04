'use client'

import { useMemo, useState, useTransition } from 'react'
import {
  IconChevronDown, IconArrowUpCircle, IconSearch, IconMail, IconPhone,
  IconWorld, IconCircleCheck, IconAlertTriangle, IconPencil,
} from '@tabler/icons-react'
import { setBookingStatus, promoteFromWaitlist, setWeeklyCap, type ActionResult } from './actions'
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
  [r.preferred_date, r.preferred_time, r.timezone].filter(Boolean).join(' \u00b7 ') || '\u2014'

export function BookingsManager({ initial, weeklyCap, canEditCap }: {
  initial: BookingRow[]; weeklyCap: number; canEditCap: boolean
}) {
  const [rows, setRows] = useState<BookingRow[]>(initial)
  const [tab, setTab] = useState<TabKey>('active')
  const [source, setSource] = useState<SourceKey>('all')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)
  const [msg, setMsg] = useState<ActionResult | null>(null)
  const [pending, start] = useTransition()

  // Cap widget state
  const [cap, setCap] = useState(weeklyCap)
  const [capEditing, setCapEditing] = useState(false)
  const [capDraft, setCapDraft] = useState(String(weeklyCap))

  // "This week: X of cap" — same rule as the public form's capacity gate:
  // active (non-waitlisted, non-cancelled) discovery requests in the rolling window.
  const weekCount = useMemo(() => {
    const since = Date.now() - WINDOW_DAYS * 86400000
    return rows.filter((r) =>
      r.referral_source === 'discovery_call' && !r.waitlisted && r.status !== 'cancelled' &&
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

  function saveCap() {
    const n = parseInt(capDraft, 10)
    setMsg(null)
    start(async () => {
      const res = await setWeeklyCap(n)
      setMsg(res)
      if (res.ok) { setCap(n); setCapEditing(false) }
    })
  }

  return (
    <div className={s.wrap}>
      <header className={s.head}>
        <div>
          <h1 className={s.h1}>Bookings</h1>
          <p className={s.sub}>Discovery-call requests and contact messages. New submissions land here automatically.</p>
        </div>

        <div className={s.capBox}>
          <span className={s.capLabel}>Discovery calls this week</span>
          <span className={s.capValue}>
            <strong className={weekCount >= cap ? s.capFull : undefined}>{weekCount}</strong> of{' '}
            {capEditing ? (
              <span className={s.capEditRow}>
                <input className={s.capInput} type="number" min={1} max={100} value={capDraft}
                  onChange={(e) => setCapDraft(e.target.value)} />
                <button type="button" className={s.capSave} onClick={saveCap} disabled={pending}>Save</button>
                <button type="button" className={s.capCancel} onClick={() => { setCapEditing(false); setCapDraft(String(cap)) }}>Cancel</button>
              </span>
            ) : (
              <>
                {cap}
                {canEditCap && (
                  <button type="button" className={s.capEditBtn} aria-label="Edit weekly cap"
                    onClick={() => setCapEditing(true)}>
                    <IconPencil size={14} stroke={1.75} />
                  </button>
                )}
              </>
            )}
          </span>
          <span className={s.capHint}>At the cap, new requests go to the waitlist.</span>
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
            <input className={s.search} placeholder={'Search name, email, company\u2026'} value={query}
              onChange={(e) => setQuery(e.target.value)} aria-label="Search bookings" />
          </span>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className={s.empty}>
          {tab === 'active' && 'No active requests right now. New submissions from the contact and Work With Me forms will appear here.'}
          {tab === 'waitlist' && 'The waitlist is empty.'}
          {tab === 'archive' && 'Nothing archived yet \u2014 completed and cancelled requests end up here.'}
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

                  <a className={s.replyBtn} href={`mailto:${r.email}?subject=${encodeURIComponent('Re: your request \u2014 Erwin Natividad')}`}>
                    <IconMail size={16} stroke={1.75} /> Reply
                  </a>
                </div>

                {open && (
                  <div className={s.detail}>
                    <div className={s.detailGrid}>
                      <div><span className={s.dLabel}>Company</span><span className={s.dValue}>{r.company || '\u2014'}</span></div>
                      <div><span className={s.dLabel}>Preferred time</span><span className={s.dValue}>{fmtPreferred(r)}</span></div>
                      <div>
                        <span className={s.dLabel}>Phone</span>
                        <span className={s.dValue}>{r.phone
                          ? <a className={s.dLink} href={`tel:${r.phone}`}><IconPhone size={14} stroke={1.75} /> {r.phone}</a>
                          : '\u2014'}</span>
                      </div>
                      <div>
                        <span className={s.dLabel}>Website</span>
                        <span className={s.dValue}>{r.website
                          ? <a className={s.dLink} href={r.website} target="_blank" rel="noreferrer"><IconWorld size={14} stroke={1.75} /> {r.website}</a>
                          : '\u2014'}</span>
                      </div>
                    </div>
                    <div className={s.message}>
                      <span className={s.dLabel}>Message</span>
                      <p className={s.messageText}>{r.message || '\u2014'}</p>
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