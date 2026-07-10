// Drop in as src/app/admin/routes/routes-form.tsx
// ASSUMPTION: '@/app/admin/content/fields' exports a Field component shaped like
// <Field label value onChange placeholder /> — copied from project-form.tsx's usage.

'use client'

import { useState, useTransition } from 'react'
import { Field } from '@/app/admin/content/fields'
import { savePageRoute, type SaveState } from './actions'

type PageRoute = { id: string; slug: string; label: string }

export function RoutesForm({ routes }: { routes: PageRoute[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
      {routes.map((r) => (
        <RouteRow key={r.id} route={r} />
      ))}
    </div>
  )
}

function RouteRow({ route }: { route: PageRoute }) {
  const [slug, setSlug] = useState(route.slug)
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<SaveState>(null)

  function save() {
    start(async () => {
      setMsg(await savePageRoute(route.id, slug))
    })
  }

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
      <Field label={route.label} value={slug} onChange={setSlug} placeholder={route.slug} />
      <button
        type="button"
        className="btn btnSolid"
        onClick={save}
        disabled={pending || slug === route.slug}
      >
        {pending ? 'Saving…' : 'Save'}
      </button>
      {msg && <span style={{ color: msg.ok ? 'green' : 'crimson' }}>{msg.message}</span>}
    </div>
  )
}