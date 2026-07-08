-- =====================================================================
-- erwin-natividad-2026 — Portfolio projects
-- Migration: 0007_projects.sql
--
-- New table: this didn't exist before. The homepage's "Featured Work" tab
-- in Content 2.0 only manages 3 static teaser cards inside the settings
-- JSON blob — there was no real, addable/removable library of work
-- samples, and /work had no CMS behind it at all. `projects` fills that
-- gap. Same status/RLS shape as `blog_posts` and `shows`.
--
-- `is_featured` is the flag the homepage's Featured Work section will use
-- once it's migrated to read from this table instead of the settings blob
-- (follow-up work, not done in this migration).
--
-- Audio demos are PUBLIC (project-audio bucket) — unlike episode-audio,
-- there's no premium gating; anyone should be able to play a demo. So a
-- public URL is stored directly in `audio_url`, not a private path.
-- Safe to re-run.
-- =====================================================================

create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  tags          text[] not null default '{}',
  body          text,
  date_label    text,                          -- informal display date, e.g. "March 2026"
  audio_url     text,                          -- public URL (project-audio bucket)
  duration_secs int,
  cover_url     text,
  is_featured   boolean not null default false,
  status        content_status not null default 'draft',
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists projects_published_idx on public.projects (status, sort_order);

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

drop policy if exists "projects: public read published" on public.projects;
create policy "projects: public read published" on public.projects for select
  using (status = 'published' or public.is_staff());

drop policy if exists "projects: editor write" on public.projects;
create policy "projects: editor write" on public.projects for all
  using (public.is_editor()) with check (public.is_editor());

-- ---- project-audio bucket (public) --------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-audio', 'project-audio', true, 209715200, array['audio/*'])  -- 200 MB
on conflict (id) do nothing;

drop policy if exists "storage: project-audio public read" on storage.objects;
create policy "storage: project-audio public read" on storage.objects
  for select using (bucket_id = 'project-audio');

drop policy if exists "storage: project-audio editor insert" on storage.objects;
create policy "storage: project-audio editor insert" on storage.objects
  for insert with check (bucket_id = 'project-audio' and public.is_editor());

drop policy if exists "storage: project-audio editor update" on storage.objects;
create policy "storage: project-audio editor update" on storage.objects
  for update using (bucket_id = 'project-audio' and public.is_editor())
  with check (bucket_id = 'project-audio' and public.is_editor());

drop policy if exists "storage: project-audio editor delete" on storage.objects;
create policy "storage: project-audio editor delete" on storage.objects
  for delete using (bucket_id = 'project-audio' and public.is_editor());

notify pgrst, 'reload schema';