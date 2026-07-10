// Full replacement for src/lib/projects-db/store.ts

import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

export type ProjectRow = {
  id: string
  title: string
  slug: string
  tags: string[]
  description: string | null
  paragraphs: string[]
  date_label: string | null
  audio_url: string | null
  duration_secs: number | null
  cover_url: string | null
  client: string | null
  studio: string | null
  length_label: string | null
  age_range: string | null
  voice_character: string | null
  genre: string | null
  deliverables: string | null
  is_featured: boolean
  is_hero: boolean
  status: 'draft' | 'scheduled' | 'published' | 'archived'
  sort_order: number
  created_at: string
  updated_at: string
}

// Admin-side reads: service-role, same rationale as episodes/shows — gated
// by the /admin layout + explicit requireRole() in the mutating actions.
export async function listProjects(): Promise<ProjectRow[]> {
  const db = createAdminClient()
  const { data, error } = await db.from('projects').select('*').order('sort_order').order('title')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getProjectById(id: string): Promise<ProjectRow | null> {
  const db = createAdminClient()
  const { data, error } = await db.from('projects').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data
}