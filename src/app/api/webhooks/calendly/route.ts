// src/app/api/webhooks/calendly/route.ts
//
// Receives Calendly's invitee.created / invitee.canceled events and mirrors
// them into public.bookings, so confirmed discovery calls show up in
// /admin/bookings alongside contact-form messages.
//
// Calendly's own "Limit the frequency of bookings" setting on the Discovery
// Call event type (Availability tab, paid plans) is what actually enforces
// the weekly cap now — this route only records what Calendly already
// decided to allow. It does not re-check or re-enforce any cap.
//
// One-time setup required outside this codebase: register this endpoint
// with Calendly (see the note at the bottom of this file).

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const SIGNING_KEY = process.env.CALENDLY_WEBHOOK_SIGNING_KEY
const TOLERANCE_SECONDS = 300 // reject anything older than 5 minutes — guards against replay

function verifySignature(rawBody: string, header: string | null): boolean {
  if (!SIGNING_KEY || !header) return false

  const parts = Object.fromEntries(
    header.split(',').map((piece) => {
      const [k, v] = piece.split('=')
      return [k, v]
    }),
  )
  const { t, v1 } = parts
  if (!t || !v1) return false

  const age = Math.abs(Date.now() / 1000 - Number(t))
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS) return false

  const expected = crypto.createHmac('sha256', SIGNING_KEY).update(`${t}.${rawBody}`).digest('hex')

  const a = Buffer.from(expected, 'hex')
  const b = Buffer.from(v1, 'hex')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

type QA = { question: string; answer: string }

function findAnswer(qas: QA[] | undefined, ...needles: string[]): string | null {
  if (!qas) return null
  const hit = qas.find((qa) => needles.some((n) => qa.question.toLowerCase().includes(n)))
  return hit?.answer?.trim() || null
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('Calendly-Webhook-Signature')

  if (!verifySignature(rawBody, signature)) {
    console.warn('[calendly webhook] signature verification failed')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: { event?: string; payload?: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const kind = event.event
  const payload = event.payload as
    | {
        uri?: string
        email?: string
        name?: string
        timezone?: string
        event?: string
        questions_and_answers?: QA[]
        scheduled_event?: { start_time?: string }
      }
    | undefined

  if (!kind || !payload) {
    return NextResponse.json({ error: 'Unrecognized payload' }, { status: 400 })
  }

  const db = createAdminClient()

  if (kind === 'invitee.created') {
    const qas = payload.questions_and_answers
    const startTime = payload.scheduled_event?.start_time

    let preferredDate: string | null = null
    let preferredTime: string | null = null
    if (startTime) {
      const d = new Date(startTime)
      preferredDate = d.toISOString().slice(0, 10)
      preferredTime = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: payload.timezone || 'UTC',
      })
    }

    const message = qas?.length ? qas.map((qa) => `${qa.question}\n${qa.answer}`).join('\n\n') : null

    const { error } = await db.from('bookings').upsert(
      {
        full_name: payload.name ?? 'Unknown',
        email: payload.email ?? '',
        company: findAnswer(qas, 'company', 'brand'),
        service_interest: findAnswer(qas, 'need', 'project', 'looking for'),
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        timezone: payload.timezone ?? null,
        message,
        referral_source: 'discovery_call',
        // Calendly only creates this row once a real slot is booked, so
        // there's no "new / awaiting confirmation" step the way the old
        // request form had — it's confirmed from the moment it exists.
        status: 'confirmed',
        waitlisted: false,
        calendly_event_uri: payload.event ?? null,
        calendly_invitee_uri: payload.uri ?? null,
      },
      { onConflict: 'calendly_invitee_uri' },
    )

    if (error) {
      console.error('[calendly webhook] insert failed', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  } else if (kind === 'invitee.canceled') {
    const { error } = await db
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('calendly_invitee_uri', payload.uri ?? '')

    if (error) {
      console.error('[calendly webhook] cancel update failed', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }
  // Other event kinds (e.g. invitee_no_show) are ignored for now.

  return NextResponse.json({ ok: true })
}

// ---------------------------------------------------------------------
// One-time setup (not part of this codebase — run once from your machine):
//
// curl -X POST https://api.calendly.com/webhook_subscriptions \
//   -H "Authorization: Bearer <CALENDLY_PERSONAL_ACCESS_TOKEN>" \
//   -H "Content-Type: application/json" \
//   -d '{
//     "url": "https://your-deployed-site.com/api/webhooks/calendly",
//     "events": ["invitee.created", "invitee.canceled"],
//     "organization": "https://api.calendly.com/organizations/<your-org-uuid>",
//     "scope": "organization",
//     "signing_key": "<same value you set as CALENDLY_WEBHOOK_SIGNING_KEY>"
//   }'
//
// Find your organization URI via GET https://api.calendly.com/users/me.
// ---------------------------------------------------------------------