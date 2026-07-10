// Full replacement for middleware.ts at the project root.
// CORRECTED from the earlier version — no _pages/ folder needed, no folder moves at all.
// Physical pages stay exactly where they are (e.g. src/app/work-with-me/page.tsx).

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SKIP_PREFIXES = ['/_next', '/api', '/admin', '/favicon.ico']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const seg = pathname.split('/').filter(Boolean)[0]
  if (!seg) return NextResponse.next()

  let routes: { id: string; slug: string }[] = []
  try {
    const res = await fetch(`${req.nextUrl.origin}/api/route-map`, {
      next: { revalidate: 30 },
    })
    if (res.ok) routes = await res.json()
  } catch {
    return NextResponse.next()
  }

  // Only rewrite when the requested segment is a RENAMED slug — i.e. someone
  // is hitting the NEW slug, which differs from the page's original/stable id.
  // If slug === id (never renamed — the default state right after migrating),
  // do nothing: Next's normal file-based routing already serves it correctly.
  const match = routes.find((r) => r.slug === seg)
  if (match && match.id !== seg) {
    const rest = pathname.slice(('/' + seg).length)
    return NextResponse.rewrite(new URL(`/${match.id}${rest}`, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|admin|favicon.ico).*)'],
}