import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { getSessionProfile, hasMinRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

// Image upload endpoint for the admin panel.
// - Editors and above only.
// - Everything raster (PNG, JPG, GIF, ...) is converted to WebP server-side.
// - SVGs pass through untouched (vector art shouldn't be rasterized).
// - Images are capped at 2000px on the long edge and stored with a 1-year
//   cache header under a random UUID filename.
export const runtime = 'nodejs'

const BUCKETS = new Set(['site-media', 'blog-media', 'episode-art', 'show-art'])
const MAX_BYTES = 10 * 1024 * 1024 // matches the buckets' file_size_limit

export async function POST(req: Request) {
  const session = await getSessionProfile()
  if (!session || !hasMinRole(session.profile.role, 'editor')) {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 401 })
  }

  const form = await req.formData()
  const file = form.get('file')
  const bucket = String(form.get('bucket') ?? 'site-media')
  const folder = (String(form.get('folder') ?? 'misc').replace(/[^a-zA-Z0-9-_]/g, '') || 'misc').toLowerCase()

  if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 })
  if (!BUCKETS.has(bucket)) return NextResponse.json({ error: 'Unknown bucket.' }, { status: 400 })
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Image is too large (max 10 MB).' }, { status: 400 })

  let body: Buffer
  let contentType: string
  let ext: string

  try {
    const input = Buffer.from(await file.arrayBuffer())
    if (file.type === 'image/svg+xml') {
      body = input
      contentType = 'image/svg+xml'
      ext = 'svg'
    } else {
      body = await sharp(input, { animated: file.type === 'image/gif' })
        .rotate() // respect EXIF orientation
        .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer()
      contentType = 'image/webp'
      ext = 'webp'
    }
  } catch (e) {
    console.error('[upload] conversion failed:', e)
    return NextResponse.json({ error: 'Could not process this image \u2014 is the file valid?' }, { status: 422 })
  }

  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const db = createAdminClient()
  const { error } = await db.storage.from(bucket).upload(path, body, {
    contentType,
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) {
    console.error('[upload] storage error:', error)
    return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 })
  }

  const { data } = db.storage.from(bucket).getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl, path })
}