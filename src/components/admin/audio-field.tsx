import { NextResponse } from 'next/server'
import { getSessionProfile, hasMinRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

// Audio upload endpoint for the admin panel — sibling to /api/upload
// (images), same auth model.
// - Editors and above only.
// - Expects an ALREADY-CONVERTED AAC (.m4a) file. Conversion happens
//   client-side via ffmpeg.wasm (see lib/audio/convert.ts) — there's no
//   fast, dependency-light server-side equivalent to `sharp` for audio here,
//   so the browser does the transcoding before the file is ever sent.
// - Bucket-aware: `episode-audio` is PRIVATE (premium gating — see doc 02,
//   "Premium audio never leaks"), so only a Storage path is returned there,
//   never a public URL. `project-audio` (portfolio demos) and
//   `show-intro-audio` (show intro clips — no premium gating, meant to play
//   for anyone) are PUBLIC — a public URL is returned for both.
//
// This route no longer accepts the file body directly. Vercel Functions cap
// request bodies at ~4.5MB regardless of any in-app size limit, so actual
// audio bytes never pass through here — this route only mints a short-lived
// signed upload URL/token, and the browser uploads straight to Supabase
// Storage using it (see audio-field.tsx).
export const runtime = 'nodejs'

const AUDIO_BUCKETS: Record<string, { public: boolean }> = {
  'episode-audio': { public: false },
  'project-audio': { public: true },
  'show-intro-audio': { public: true },
}

export async function POST(req: Request) {
  const session = await getSessionProfile()
  if (!session || !hasMinRole(session.profile.role, 'editor')) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
  }

  const { bucket, folder: rawFolder, fileName } = await req.json().catch(() => ({}))
  const folder = (String(rawFolder ?? 'misc').replace(/[^a-zA-Z0-9-_]/g, '') || 'misc').toLowerCase()

  const bucketConfig = AUDIO_BUCKETS[bucket]
  if (!bucketConfig) return NextResponse.json({ error: 'Unknown audio bucket.' }, { status: 400 })
  if (!fileName || !/\.m4a$/i.test(fileName)) {
    return NextResponse.json({ error: 'Expected an AAC (.m4a) file — conversion should happen before upload.' }, { status: 400 })
  }

  const path = `${folder}/${crypto.randomUUID()}.m4a`

  const db = createAdminClient()
  const { data, error } = await db.storage.from(bucket).createSignedUploadUrl(path)
  if (error || !data) {
    console.error('[upload-audio] sign error:', error)
    return NextResponse.json({ error: 'Could not prepare upload: ' + (error?.message ?? 'unknown error') }, { status: 500 })
  }

  if (bucketConfig.public) {
    const { data: pub } = db.storage.from(bucket).getPublicUrl(path)
    return NextResponse.json({ path, token: data.token, url: pub.publicUrl })
  }

  // Private bucket — no getPublicUrl call, no url in the response.
  return NextResponse.json({ path, token: data.token })
}