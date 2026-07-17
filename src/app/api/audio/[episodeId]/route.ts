import { NextResponse } from 'next/server'
import { getSessionProfile, hasMinRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasActiveMembership } from '@/lib/membership'

// Episode playback endpoint. Mints a short-lived signed URL for the private
// `episode-audio` bucket — never a public URL, per doc 02 §1 ("Premium audio
// never leaks") and §5 ("policy and audio delivery can never drift apart").
//
// This route did not exist anywhere in the repo prior to this build — the
// upload side (/api/upload/audio) existed, but nothing served audio back.
// Built fresh here rather than guessed at, since this is the one thing
// standing between "premium gated" and an actual leak.
export const runtime = 'nodejs'
const SIGNED_URL_TTL = 60 * 60 // 1 hour

export async function GET(req: Request, { params }: { params: Promise<{ episodeId: string }> }) {
  const { episodeId } = await params
  const db = createAdminClient()

  const { data: episode, error } = await db
    .from('episodes')
    .select('id, audio_path, is_premium, status')
    .eq('id', episodeId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!episode || episode.status !== 'published') {
    return NextResponse.json({ error: 'Episode not found.' }, { status: 404 })
  }
  if (!episode.audio_path) {
    return NextResponse.json({ error: 'No audio uploaded for this episode.' }, { status: 404 })
  }

  if (episode.is_premium) {
    const session = await getSessionProfile()
    const isStaff = !!session && hasMinRole(session.profile.role, 'editor') // staff can preview premium episodes
    const isMember = !!session && (await hasActiveMembership(session.user.id))
    if (!isStaff && !isMember) {
      return NextResponse.json({ error: 'This episode requires an active membership.' }, { status: 403 })
    }
  }

  const { data: signed, error: signErr } = await db.storage
    .from('episode-audio')
    .createSignedUrl(episode.audio_path, SIGNED_URL_TTL)
  if (signErr || !signed) {
    return NextResponse.json({ error: 'Could not generate playback URL.' }, { status: 500 })
  }

  // Best-effort play log (episode_plays accepts public insert per doc 02 §4).
  // Fire-and-forget — a logging failure should never block playback.
  db.from('episode_plays').insert({ episode_id: episodeId }).then(({ error: logErr }) => {
    if (logErr) console.error('[episode_plays] log failed:', logErr.message)
  })

  return NextResponse.json({ url: signed.signedUrl })
}