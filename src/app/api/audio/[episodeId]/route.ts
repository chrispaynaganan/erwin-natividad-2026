import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Returns a short-lived signed URL for an episode's audio.
// Premium episodes require an active membership. The membership check mirrors
// the RLS policy on public.episodes so the file gate and the row gate agree.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ episodeId: string }> }
) {
  const { episodeId } = await params
  const supabase = await createClient()

  // RLS already hides premium episodes from non-members, so a row coming back
  // here means the caller is allowed to read it.
  const { data: episode, error } = await supabase
    .from('episodes')
    .select('id, audio_path, is_premium, status')
    .eq('id', episodeId)
    .single()

  if (error || !episode || !episode.audio_path) {
    return new NextResponse('Not found', { status: 404 })
  }

  const { data: signed, error: signErr } = await supabase
    .storage
    .from('episode-audio')
    .createSignedUrl(episode.audio_path, 60 * 60) // 1 hour

  if (signErr || !signed) {
    return new NextResponse('Unable to sign audio URL', { status: 500 })
  }

  return NextResponse.json({ url: signed.signedUrl })
}
