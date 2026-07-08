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
//   never a public URL. `project-audio` (portfolio demos) is PUBLIC — anyone
//   should be able to play a demo — so a public URL is returned for it.
export const runtime = 'nodejs'

const MAX_BYTES = 200 * 1024 * 1024 // generous cap for long-form episodes — confirm this matches each bucket's own file_size_limit

const AUDIO_BUCKETS: Record<string, { public: boolean }> = {
  'episode-audio': { public: false },
  'project-audio': { public: true },
}

export async function POST(req: Request) {
  const session = await getSessionProfile()
  if (!session || !hasMinRole(session.profile.role, 'editor')) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file')
  const bucket = String(form.get('bucket') ?? 'episode-audio')
  const folder = (String(form.get('folder') ?? 'misc').replace(/[^a-zA-Z0-9-_]/g, '') || 'misc').toLowerCase()

  const bucketConfig = AUDIO_BUCKETS[bucket]
  if (!bucketConfig) return NextResponse.json({ error: 'Unknown audio bucket.' }, { status: 400 })
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 })
  if (!/\.m4a$/i.test(file.name) && file.type !== 'audio/mp4') {
    return NextResponse.json({ error: 'Expected an AAC (.m4a) file \u2014 conversion should happen before upload.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Audio file is too large (max 200 MB).' }, { status: 400 })

  const body = Buffer.from(await file.arrayBuffer())
  const path = `${folder}/${crypto.randomUUID()}.m4a`

  const db = createAdminClient()
  const { error } = await db.storage.from(bucket).upload(path, body, {
    contentType: 'audio/mp4',
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) {
    console.error('[upload-audio] storage error:', error)
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 })
  }

  if (bucketConfig.public) {
    const { data } = db.storage.from(bucket).getPublicUrl(path)
    return NextResponse.json({ path, url: data.publicUrl })
  }

  // Private bucket — no getPublicUrl call, no url in the response.
  return NextResponse.json({ path })
}