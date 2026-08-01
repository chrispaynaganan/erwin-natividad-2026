import { NextResponse } from 'next/server'
import { getSessionProfile, hasMinRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const AUDIO_BUCKETS: Record<string, { public: boolean }> = {
  'episode-audio': { public: false },
  'project-audio': { public: true },
  'show-intro-audio': { public: true },
}

// Issues a short-lived signed upload URL instead of accepting the file body
// directly — Vercel Functions cap request bodies at ~4.5MB regardless of any
// in-app size limit, so the actual audio bytes must go client → Supabase
// Storage directly, never through this function.
export async function POST(req: Request) {
  const session = await getSessionProfile()
  if (!session || !hasMinRole(session.profile.role, 'editor')) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
  }

  const { bucket, folder: rawFolder, fileName } = await req.json()
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

  const url = bucketConfig.public ? db.storage.from(bucket).getPublicUrl(path).data.publicUrl : undefined
  return NextResponse.json({ path, token: data.token, url })
}