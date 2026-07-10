// Full replacement for src/lib/projects.ts

import 'server-only'
import { createPublicClient } from '@/lib/supabase/public'

// Shared project catalog — used by /work (listing) and /work/[slug] (detail).
// This used to be a static array; it now reads from the `projects` table.
// The shape below is unchanged from the original static version (plus
// `audioUrl`, which the static data never had a slot for) so that
// ProjectsExplorer, AudioPlayer, and FullAudioPlayer need no changes.
export type Project = {
  slug: string
  title: string
  desc: string
  date: string
  duration: string
  tags: string[]
  audioUrl?: string
  client?: string
  completed?: string
  studio?: string
  length?: string
  ageRange?: string
  character?: string
  genre?: string
  deliverables?: string
  body?: string[]
}

function formatDuration(secs: number | null): string {
  if (!secs) return '0:00'
  const m = Math.floor(secs / 60)
  const s = Math.round(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

type Row = {
  slug: string
  title: string
  description: string | null
  date_label: string | null
  duration_secs: number | null
  tags: string[]
  audio_url: string | null
  client: string | null
  studio: string | null
  length_label: string | null
  age_range: string | null
  voice_character: string | null
  genre: string | null
  deliverables: string | null
  paragraphs: string[]
}

function toProject(row: Row): Project {
  return {
    slug: row.slug,
    title: row.title,
    desc: row.description ?? '',
    date: row.date_label ?? '',
    duration: formatDuration(row.duration_secs),
    tags: row.tags,
    audioUrl: row.audio_url ?? undefined,
    client: row.client ?? undefined,
    completed: row.date_label ?? undefined, // static data always had these identical
    studio: row.studio ?? undefined,
    length: row.length_label ?? undefined,
    ageRange: row.age_range ?? undefined,
    character: row.voice_character ?? undefined,
    genre: row.genre ?? undefined,
    deliverables: row.deliverables ?? undefined,
    body: row.paragraphs?.length ? row.paragraphs : undefined,
  }
}

const COLUMNS = 'slug, title, description, date_label, duration_secs, tags, audio_url, client, studio, length_label, age_range, voice_character, genre, deliverables, paragraphs'

// Public reads use a cookie-free anon client — these are always public,
// published-only content (enforced by RLS), and this needs to work at
// build time (generateStaticParams) as well as at request time, unlike the
// admin panel's reads which deliberately use the service-role client.
export async function getProjects(): Promise<Project[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('projects')
    .select(COLUMNS)
    .eq('status', 'published')
    .order('sort_order')
  if (error) throw new Error(error.message)
  return (data ?? []).map(toProject)
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('projects')
    .select(COLUMNS)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('sort_order')
    .limit(limit)
  if (error) throw new Error(error.message)
  return (data ?? []).map(toProject)
}

// NEW — backs the homepage Hero's single "spotlight" project. Distinct from
// is_featured (which drives the Featured Work grid): at most one row can ever
// have is_hero = true, enforced by a partial unique index (0009_hero_project.sql).
export async function getHeroProject(): Promise<Project | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('projects')
    .select(COLUMNS)
    .eq('status', 'published')
    .eq('is_hero', true)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? toProject(data) : null
}

export async function getProject(slug: string): Promise<Project | null> {
  const supabase = createPublicClient()
  const { data, error } = await supabase
    .from('projects')
    .select(COLUMNS)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data ? toProject(data) : null
}

export async function getAdjacent(slug: string): Promise<{ prev: Project | null; next: Project | null }> {
  const all = await getProjects()
  const i = all.findIndex((p) => p.slug === slug)
  return { prev: i > 0 ? all[i - 1] : null, next: i >= 0 && i < all.length - 1 ? all[i + 1] : null }
}