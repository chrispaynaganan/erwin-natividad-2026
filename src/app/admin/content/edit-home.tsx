'use client'

import { useState } from 'react'
import { ImageField } from '@/components/admin/image-field'
import type { ServiceItem, WorkItem, Testimonial, LogoItem } from '@/lib/content/site-content'
import { Field, LinkField, TagsField, ItemShell, AddButton, HeadFields, move, type EditorProps } from './fields'
import { IconTrash } from '@tabler/icons-react'
import s from './content.module.css'

type TabKey = 'hero' | 'whatido' | 'work' | 'testimonials' | 'logos' | 'meet' | 'cta'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'whatido', label: 'What I Do' },
  { key: 'work', label: 'Featured Work' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'logos', label: 'Client Logos' },
  { key: 'meet', label: 'Meet Erwin' },
  { key: 'cta', label: 'Call to Action' },
]

const blankService = (): ServiceItem => ({ title: 'New service', body: '', primary: { label: 'Learn More', href: '/services' }, secondary: { label: '', href: '' } })
const blankWork = (): WorkItem => ({ tags: [], title: 'New project', body: '', date: '' })
const blankTestimonial = (): Testimonial => ({ text: '', name: 'New client', role: '' })
const blankLogo = (): LogoItem => ({ name: 'New company', imageUrl: '' })

export function EditHome({ c, edit }: EditorProps) {
  const [tab, setTab] = useState<TabKey>('hero')
  return (
    <>
      <nav className={s.tabs}>
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={tab === t.key ? `${s.tab} ${s.tabActive}` : s.tab}>{t.label}</button>
        ))}
      </nav>

      <div className={s.panel}>
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

        {tab === 'whatido' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>What I Do</h2>
            <HeadFields head={c.home.whatIDo} onChange={(h) => edit((d) => { Object.assign(d.home.whatIDo, h) })} />
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
              <AddButton label="Add service" onClick={() => edit((d) => { d.home.whatIDo.items.push(blankService()) })} />
            </div>
          </section>
        )}

        {tab === 'work' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Featured Work</h2>
            <HeadFields head={c.home.featuredWork} onChange={(h) => edit((d) => { Object.assign(d.home.featuredWork, h) })} />
            <LinkField label={'\u201CView all\u201D button'} value={c.home.featuredWork.viewAll} onChange={(v) => edit((d) => { d.home.featuredWork.viewAll = v })} />
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
              <AddButton label="Add project" onClick={() => edit((d) => { d.home.featuredWork.items.push(blankWork()) })} />
            </div>
          </section>
        )}

        {tab === 'testimonials' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Testimonials</h2>
            <p className={s.hint}>Also shown on the About page.</p>
            <HeadFields head={c.home.testimonials} onChange={(h) => edit((d) => { Object.assign(d.home.testimonials, h) })} />
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
              <AddButton label="Add testimonial" onClick={() => edit((d) => { d.home.testimonials.items.push(blankTestimonial()) })} />
            </div>
          </section>
        )}

        {tab === 'logos' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Client Logos</h2>
            <Field label="Section label" value={c.home.logos.label} onChange={(v) => edit((d) => { d.home.logos.label = v })} />
            <p className={s.hint}>Upload a logo (converted to WebP automatically) or paste a hosted image URL. Names are used for accessibility.</p>
            <div className={s.items}>
              {c.home.logos.items.map((it, i) => (
                <ItemShell key={i} title={it.name || `Logo ${i + 1}`} i={i} count={c.home.logos.items.length}
                  onUp={() => edit((d) => move(d.home.logos.items, i, -1))}
                  onDown={() => edit((d) => move(d.home.logos.items, i, 1))}
                  onRemove={() => edit((d) => { d.home.logos.items.splice(i, 1) })}>
                  <Field label="Company name" value={it.name} onChange={(v) => edit((d) => { d.home.logos.items[i].name = v })} />
                  <ImageField label="Logo image" folder="logos" value={it.imageUrl}
                    onChange={(v) => edit((d) => { d.home.logos.items[i].imageUrl = v })} />
                </ItemShell>
              ))}
              <AddButton label="Add logo" onClick={() => edit((d) => { d.home.logos.items.push(blankLogo()) })} />
            </div>
          </section>
        )}

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
            <AddButton label="Add paragraph" onClick={() => edit((d) => { d.home.meet.body.push('') })} />
            <LinkField label="Button" value={c.home.meet.cta} onChange={(v) => edit((d) => { d.home.meet.cta = v })} />
          </section>
        )}

        {tab === 'cta' && (
          <section className={s.card}>
            <h2 className={s.cardTitle}>Call to Action</h2>
            <p className={s.hint}>Also shown at the bottom of the Services and Blog pages.</p>
            <HeadFields head={c.home.cta} onChange={(h) => edit((d) => { Object.assign(d.home.cta, h) })} />
            <Field label="Email field placeholder" value={c.home.cta.emailPlaceholder} onChange={(v) => edit((d) => { d.home.cta.emailPlaceholder = v })} />
            <LinkField label="Button" value={c.home.cta.button} onChange={(v) => edit((d) => { d.home.cta.button = v })} />
          </section>
        )}
      </div>
    </>
  )
}