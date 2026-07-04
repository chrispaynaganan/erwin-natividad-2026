'use client'

import { ImageField } from '@/components/admin/image-field'
import { Field } from './fields'
import type { EditorProps } from './fields'
import s from './content.module.css'

export function EditNav({ c, edit }: EditorProps) {
  return (
    <div className={s.panel}>
      <section className={s.card}>
        <h2 className={s.cardTitle}>Navigation</h2>
        <p className={s.hint}>
          The header shows the light logo on light backgrounds and the dark logo on dark backgrounds.
          Upload a transparent PNG or SVG {'\u2014'} raster uploads are converted to WebP and resized automatically.
        </p>
        <ImageField label="Logo (light background)" folder="nav" value={c.nav.logoLight}
          onChange={(v) => edit((d) => { d.nav.logoLight = v })} />
        <ImageField label="Logo (dark background)" folder="nav" value={c.nav.logoDark}
          onChange={(v) => edit((d) => { d.nav.logoDark = v })} />
        <div className={s.row2}>
          <Field label={'Header button \u2014 text'} value={c.nav.ctaLabel} onChange={(v) => edit((d) => { d.nav.ctaLabel = v })} />
          <Field label={'Header button \u2014 link'} value={c.nav.ctaHref} onChange={(v) => edit((d) => { d.nav.ctaHref = v })} placeholder="/work-with-me" />
        </div>
      </section>
    </div>
  )
}