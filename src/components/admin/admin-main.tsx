'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import s from './admin-main.module.css'

// Keys on the route so each admin page fades/slides in on navigation —
// one quiet, consistent transition rather than a jump cut between pages.
// Note: children are NOT remounted (no `key={pathname}`) — only the
// animation replays, via a class toggle + forced reflow, so page state
// deeper in the tree doesn't get torn down on every nav.
export function AdminMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    el.classList.remove(s.pageIn)
    // Force a reflow so the browser registers the class removal before
    // it's re-added — otherwise React batches both and no animation plays.
    void el.offsetWidth
    el.classList.add(s.pageIn)
  }, [pathname])

  return (
    <main ref={mainRef} className={s.pageIn} style={{ flex: 1, padding: '2rem' }}>
      {children}
    </main>
  )
}