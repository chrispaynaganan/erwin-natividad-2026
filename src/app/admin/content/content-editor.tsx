'use client'

import { useState, useTransition } from 'react'
import {
  IconDeviceFloppy, IconTrash, IconPlus, IconArrowUp, IconArrowDown,
  IconExternalLink, IconCircleCheck, IconAlertTriangle,
} from '@tabler/icons-react'
import { saveSiteContent, type SaveState } from './actions'
import type {
  SiteContent, ServiceItem, WorkItem, Testimonial, LogoItem, LinkItem,
} from '@/lib/content/site-content'
import s from './content.module.css'

type TabKey = 'hero' | 'whatido' | 'work' | 'testimonials' | 'logos' | 'meet' | 'cta' | 'nav'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'whatido', label: 'What I Do' },
  { key: 'work', label: 'Featured Work' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'logos', label: 'Client Logos' },
  { key: 'meet', label: 'Meet Erwin' },
  { key: 'cta', label: 'Call to Action' },
  { key: 'nav', label: 'Navigation' },
]

// --- small field primitives -------------------------------------------------
function Field({ label, value, onChange, textarea, rows, placeholder }: {
  label: string; value: string; onChange: (v: string) => void
  textarea?: boolean; rows?: number; placeholder?: string
}) {
  return (
    <label className={s.field}>
      <span className={s.label}>{label}</span>
      {textarea
        ? <textarea className={s.input} value={value} rows={rows ?? 3} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
        : <input className={s.input} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
    </label>
  )
}

function LinkField({ label, value, onChange }: { label: string; value: LinkItem; onChange: (v: LinkItem) => void }) {
  return (
    <div className={s.row2}>
      <Field label={`${label} — text`} value={value.label} onChange={(label2) => onChange({ ...value, label: label2 })} />
      <Field label={`${label} — link`} value={value.href} onChange={(href) => onChange({ ...value, href })} placeholder="/work-with-me" />
    </div>
  )
}

function TagsField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <Field
      label={`${label} (comma-separated)`}
      value={value.join(', ')}
      onChange={(raw) => onChange(raw.split(',').map((t) => t.trim()).filter(Boolean))}
    />
  )
}

function ItemShell({ title, i, count, onUp, onDown, onRemove, children }: {
  title: string; i: number; count: number
  onUp: () => void; onDown: () => void; onRemove: () => void; children: React.ReactNode
}) {
  return (
    <div className={s.itemCard}>
      <div className={s.itemHead}>
        <span className={s.itemTitle}>{title}</span>
        <div className={s.itemActions}>
          <button type="button" className={s.iconBtn} disabled={i === 0} onClick={onUp} aria-label="Move up"><IconArrowUp size={16} stroke={1.75} /></button>
          <button type="button" className={s.iconBtn} disabled={i === count - 1} onClick={onDown} aria-label="Move down"><IconArrowDown size={16} stroke={1.75} /></button>
          <button type="button" className={s.iconBtnDanger} onClick={onRemove} aria-label="Remove"><IconTrash size={16} stroke={1.75} /></button>
        </div>
      </div>
      {children}
    </div>
  )
}

// --- the editor -------------------------------------------------------------
export function ContentEditor({ initial }: { initial: SiteContent }) {
  const [c, setC] = useState<SiteContent>(initial)
  const [tab, setTab] = useState<TabKey>('hero')
  const [dirty, setDirty] = useState(false)
  const [msg, setMsg] = useState<SaveState>(null)
  const [pending, start] = useTransition()

  // Immutable editor: clone, mutate the draft, store.
  function edit(mut: (d: SiteContent) => void) {
    setC((prev) => { const next = structuredClone(prev); mut(next); return next })
    setDirty(true); setMsg(null)
  }

  function save() {
    start(async () => {
      const res = await saveSiteContent(c)
      setMsg(res)
      if (res?.ok) setDirty(false)
    })
  }

  // generic array helpers
  const move = <T,>(arr: T[], i: number, dir: -1 | 1) => { const j = i + dir; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]] }

  const blankService = (): ServiceItem => ({ title: 'New service', body: '', primary: { label: 'Learn More', href: '/services' }, secondary: { label: '', href: '' } })
  const blankWork = (): WorkItem => ({ tags: [], title: 'New project', body: '', date: '' })
  const blankTestimonial = (): Testimonial => ({ text: '', name: 'New client', role: '' })
  const blankLogo = (): LogoItem => ({ name: 'New company', imageUrl: '' })

  return (
    <div className={s.wrap}>
      <header className={s.head}>
        <div>
          <h1 className={s.h1}>Content</h1>
          <p className={s.sub}>Edit the words, links, and items that appear on the site. Branding and colors aren&rsquo;t editable here yet.</p>
        </div>
        <a className={s.viewLink} href="/" target="_blank" rel="noreferrer">View site <IconExternalLink size={15} stroke={1.75} /></a>
      </header>

      <nav className={s.tabs}>
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={tab === t.key ? `${s.tab} ${s.tabActive}` : s.tab}>{t.label}</button>
        ))}
      </nav>

      <div className={s.panel}>
        {/* ---------------- HERO ---------------- */}
        {tab === 'hero' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Hero</h2>
            <div className={s.row2}>
              <Field label="Name (line 1)" value={c.home.hero.name1} onChange={(v) => edit((d) => { d.home.hero.name1 = v })} />
              <Field label="Name (gold part)" value={c.home.hero.name2} onChange={(v) => edit((d) => { d.home.hero.name2 = v })} />
            </div>
            <TagsField label="Tag pills" value={c.home.hero.tags} onChange={(v) => edit((d) => { d.home.hero.tags = v })} />
            <Field label="Eyebrow" value={c.home.hero.eyebrow} onChange={(v) => edit((d) => { d.home.hero.eyebrow = v })} />
            <Field label="Intro paragraph" textarea rows={5} value={c.home.hero.body} onChange={(v) => edit((d) => { d.home.hero.body = v })} />
            <div className={s.row2}>
              <Field label="Featured label" value={c.home.hero.featuredLabel} onChange={(v) => edit((d) => { d.home.hero.featuredLabel = v })} />
              <Field label="Featured title" value={c.home.hero.featuredTitle} onChange={(v) => edit((d) => { d.home.hero.featuredTitle = v })} />
            </div>
            <LinkField label="Primary button" value={c.home.hero.ctaPrimary} onChange={(v) => edit((d) => { d.home.hero.ctaPrimary = v })} />
            <LinkField label="Secondary button" value={c.home.hero.ctaSecondary} onChange={(v) => edit((d) => { d.home.hero.ctaSecondary = v })} />
          </section>
        )}

        {/* ---------------- WHAT I DO ---------------- */}
        {tab === 'whatido' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>What I Do</h2>
            <div className={s.row2}>
              <Field label="Heading" value={c.home.whatIDo.title} onChange={(v) => edit((d) => { d.home.whatIDo.title = v })} />
              <Field label="Heading (gold part)" value={c.home.whatIDo.titleGold} onChange={(v) => edit((d) => { d.home.whatIDo.titleGold = v })} />
            </div>
            <Field label="Subtitle" textarea value={c.home.whatIDo.sub} onChange={(v) => edit((d) => { d.home.whatIDo.sub = v })} />
            <div className={s.items}>
              {c.home.whatIDo.items.map((it, i) => (
                <ItemShell key={i} title={it.title || `Service ${i + 1}`} i={i} count={c.home.whatIDo.items.length}
                  onUp={() => edit((d) => move(d.home.whatIDo.items, i, -1))}
                  onDown={() => edit((d) => move(d.home.whatIDo.items, i, 1))}
                  onRemove={() => edit((d) => { d.home.whatIDo.items.splice(i, 1) })}>
                  <Field label="Title" value={it.title} onChange={(v) => edit((d) => { d.home.whatIDo.items[i].title = v })} />
                  <Field label="Description" textarea value={it.body} onChange={(v) => edit((d) => { d.home.whatIDo.items[i].body = v })} />
                  <LinkField label="Primary button" value={it.primary} onChange={(v) => edit((d) => { d.home.whatIDo.items[i].primary = v })} />
                  <LinkField label="Secondary button" value={it.secondary} onChange={(v) => edit((d) => { d.home.whatIDo.items[i].secondary = v })} />
                </ItemShell>
              ))}
              <button type="button" className={s.addBtn} onClick={() => edit((d) => { d.home.whatIDo.items.push(blankService()) })}><IconPlus size={16} stroke={1.75} /> Add service</button>
            </div>
          </section>
        )}

        {/* ---------------- FEATURED WORK ---------------- */}
        {tab === 'work' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Featured Work</h2>
            <div className={s.row2}>
              <Field label="Heading" value={c.home.featuredWork.title} onChange={(v) => edit((d) => { d.home.featuredWork.title = v })} />
              <Field label="Heading (gold part)" value={c.home.featuredWork.titleGold} onChange={(v) => edit((d) => { d.home.featuredWork.titleGold = v })} />
            </div>
            <Field label="Subtitle" textarea value={c.home.featuredWork.sub} onChange={(v) => edit((d) => { d.home.featuredWork.sub = v })} />
            <LinkField label="“View all” button" value={c.home.featuredWork.viewAll} onChange={(v) => edit((d) => { d.home.featuredWork.viewAll = v })} />
            <div className={s.items}>
              {c.home.featuredWork.items.map((it, i) => (
                <ItemShell key={i} title={it.title || `Project ${i + 1}`} i={i} count={c.home.featuredWork.items.length}
                  onUp={() => edit((d) => move(d.home.featuredWork.items, i, -1))}
                  onDown={() => edit((d) => move(d.home.featuredWork.items, i, 1))}
                  onRemove={() => edit((d) => { d.home.featuredWork.items.splice(i, 1) })}>
                  <Field label="Title" value={it.title} onChange={(v) => edit((d) => { d.home.featuredWork.items[i].title = v })} />
                  <TagsField label="Tags" value={it.tags} onChange={(v) => edit((d) => { d.home.featuredWork.items[i].tags = v })} />
                  <Field label="Description" textarea value={it.body} onChange={(v) => edit((d) => { d.home.featuredWork.items[i].body = v })} />
                  <Field label="Date" value={it.date} onChange={(v) => edit((d) => { d.home.featuredWork.items[i].date = v })} placeholder="March 2026" />
                </ItemShell>
              ))}
              <button type="button" className={s.addBtn} onClick={() => edit((d) => { d.home.featuredWork.items.push(blankWork()) })}><IconPlus size={16} stroke={1.75} /> Add project</button>
            </div>
          </section>
        )}

        {/* ---------------- TESTIMONIALS ---------------- */}
        {tab === 'testimonials' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Testimonials</h2>
            <div className={s.row2}>
              <Field label="Heading" value={c.home.testimonials.title} onChange={(v) => edit((d) => { d.home.testimonials.title = v })} />
              <Field label="Heading (gold part)" value={c.home.testimonials.titleGold} onChange={(v) => edit((d) => { d.home.testimonials.titleGold = v })} />
            </div>
            <Field label="Subtitle" textarea value={c.home.testimonials.sub} onChange={(v) => edit((d) => { d.home.testimonials.sub = v })} />
            <div className={s.items}>
              {c.home.testimonials.items.map((it, i) => (
                <ItemShell key={i} title={it.name || `Testimonial ${i + 1}`} i={i} count={c.home.testimonials.items.length}
                  onUp={() => edit((d) => move(d.home.testimonials.items, i, -1))}
                  onDown={() => edit((d) => move(d.home.testimonials.items, i, 1))}
                  onRemove={() => edit((d) => { d.home.testimonials.items.splice(i, 1) })}>
                  <Field label="Quote" textarea rows={4} value={it.text} onChange={(v) => edit((d) => { d.home.testimonials.items[i].text = v })} />
                  <div className={s.row2}>
                    <Field label="Name" value={it.name} onChange={(v) => edit((d) => { d.home.testimonials.items[i].name = v })} />
                    <Field label="Role / company" value={it.role} onChange={(v) => edit((d) => { d.home.testimonials.items[i].role = v })} />
                  </div>
                </ItemShell>
              ))}
              <button type="button" className={s.addBtn} onClick={() => edit((d) => { d.home.testimonials.items.push(blankTestimonial()) })}><IconPlus size={16} stroke={1.75} /> Add testimonial</button>
            </div>
          </section>
        )}

        {/* ---------------- CLIENT LOGOS ---------------- */}
        {tab === 'logos' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Client Logos</h2>
            <Field label="Section label" value={c.home.logos.label} onChange={(v) => edit((d) => { d.home.logos.label = v })} />
            <p className={s.hint}>Paste a hosted image URL for each logo. Leave the URL blank to show a placeholder chip. Names are used for accessibility.</p>
            <div className={s.items}>
              {c.home.logos.items.map((it, i) => (
                <ItemShell key={i} title={it.name || `Logo ${i + 1}`} i={i} count={c.home.logos.items.length}
                  onUp={() => edit((d) => move(d.home.logos.items, i, -1))}
                  onDown={() => edit((d) => move(d.home.logos.items, i, 1))}
                  onRemove={() => edit((d) => { d.home.logos.items.splice(i, 1) })}>
                  <div className={s.row2}>
                    <Field label="Company name" value={it.name} onChange={(v) => edit((d) => { d.home.logos.items[i].name = v })} />
                    <Field label="Logo image URL" value={it.imageUrl} onChange={(v) => edit((d) => { d.home.logos.items[i].imageUrl = v })} placeholder="https://…/logo.png" />
                  </div>
                </ItemShell>
              ))}
              <button type="button" className={s.addBtn} onClick={() => edit((d) => { d.home.logos.items.push(blankLogo()) })}><IconPlus size={16} stroke={1.75} /> Add logo</button>
            </div>
          </section>
        )}

        {/* ---------------- MEET ERWIN ---------------- */}
        {tab === 'meet' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Meet Erwin</h2>
            <div className={s.row2}>
              <Field label="Heading" value={c.home.meet.title} onChange={(v) => edit((d) => { d.home.meet.title = v })} />
              <Field label="Heading (gold part)" value={c.home.meet.titleGold} onChange={(v) => edit((d) => { d.home.meet.titleGold = v })} />
            </div>
            <Field label="Pull quote" textarea value={c.home.meet.quote} onChange={(v) => edit((d) => { d.home.meet.quote = v })} />
            {c.home.meet.body.map((para, i) => (
              <div key={i} className={s.paraRow}>
                <Field label={`Paragraph ${i + 1}`} textarea rows={4} value={para} onChange={(v) => edit((d) => { d.home.meet.body[i] = v })} />
                <button type="button" className={s.iconBtnDanger} onClick={() => edit((d) => { d.home.meet.body.splice(i, 1) })} aria-label="Remove paragraph"><IconTrash size={16} stroke={1.75} /></button>
              </div>
            ))}
            <button type="button" className={s.addBtn} onClick={() => edit((d) => { d.home.meet.body.push('') })}><IconPlus size={16} stroke={1.75} /> Add paragraph</button>
            <LinkField label="Button" value={c.home.meet.cta} onChange={(v) => edit((d) => { d.home.meet.cta = v })} />
          </section>
        )}

        {/* ---------------- CTA ---------------- */}
        {tab === 'cta' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Call to Action</h2>
            <div className={s.row2}>
              <Field label="Heading" value={c.home.cta.title} onChange={(v) => edit((d) => { d.home.cta.title = v })} />
              <Field label="Heading (gold part)" value={c.home.cta.titleGold} onChange={(v) => edit((d) => { d.home.cta.titleGold = v })} />
            </div>
            <Field label="Subtitle" textarea value={c.home.cta.sub} onChange={(v) => edit((d) => { d.home.cta.sub = v })} />
            <Field label="Email field placeholder" value={c.home.cta.emailPlaceholder} onChange={(v) => edit((d) => { d.home.cta.emailPlaceholder = v })} />
            <LinkField label="Button" value={c.home.cta.button} onChange={(v) => edit((d) => { d.home.cta.button = v })} />
          </section>
        )}

        {/* ---------------- NAVIGATION ---------------- */}
        {tab === 'nav' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Navigation</h2>
            <p className={s.hint}>The header shows the light logo on light backgrounds and the dark logo on dark backgrounds. Use a transparent PNG or SVG URL.</p>
            <div className={s.row2}>
              <Field label="Logo (light background)" value={c.nav.logoLight} onChange={(v) => edit((d) => { d.nav.logoLight = v })} placeholder="/logo-light.png" />
              <Field label="Logo (dark background)" value={c.nav.logoDark} onChange={(v) => edit((d) => { d.nav.logoDark = v })} placeholder="/logo-dark.png" />
            </div>
            <LinkField label="Header button" value={{ label: c.nav.ctaLabel, href: c.nav.ctaHref }} onChange={(v) => edit((d) => { d.nav.ctaLabel = v.label; d.nav.ctaHref = v.href })} />
          </section>
        )}
      </div>

      {/* sticky save bar */}
      <div className={s.saveBar}>
        <div className={s.saveStatus}>
          {msg && (
            <span className={msg.ok ? s.ok : s.err}>
              {msg.ok ? <IconCircleCheck size={16} stroke={1.75} /> : <IconAlertTriangle size={16} stroke={1.75} />} {msg.message}
            </span>
          )}
          {!msg && dirty && <span className={s.hintInline}>Unsaved changes</span>}
        </div>
        <button type="button" className={`btn btnSolid ${s.saveBtn}`} onClick={save} disabled={pending || !dirty}>
          <IconDeviceFloppy size={16} stroke={1.75} /> {pending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}