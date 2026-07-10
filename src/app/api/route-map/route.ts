// Drop this in as src/app/api/route-map/route.ts
//
// Middleware runs on the Edge and can't hit Postgres directly with low latency,
// so it fetches this instead — a plain JSON endpoint with a short revalidate window.

import { NextResponse } from 'next/server'
import { getRouteMap } from '@/lib/routes'

export const revalidate = 30

export async function GET() {
  const routes = await getRouteMap()
  return NextResponse.json(routes)
}