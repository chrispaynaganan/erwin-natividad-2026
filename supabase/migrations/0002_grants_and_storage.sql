-- =====================================================================
-- erwin-natividad-2026 — Grants & Storage
-- Migration: 0002_grants_and_storage.sql
--
-- 1) Default privileges for anon/authenticated on the public schema.
--    Root cause of the "permission denied for table profiles" login bug:
--    0001 created tables without Supabase's default grants, so RLS never
--    even got evaluated. Grants open the door to the TABLE; RLS still
--    decides which ROWS each user can touch. This file makes the fix
--    reproducible for the production project.
--
-- 2) Storage buckets (episode-audio private; art/media/avatars public)
--    plus storage.objects policies that mirror the app's security model:
--    editors manage media, premium audio reads are membership-gated
--    exactly like the episodes table policy.
--
-- Safe to re-run: grants are idempotent, buckets use ON CONFLICT,
-- policies are dropped before create.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) GRANTS  (already applied manually to the dev project on 2026-07-03;
--    included here so production gets them automatically)
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant all on all tables    in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all functions in schema public to anon, authenticated;

alter default privileges in schema public grant all on tables    to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;
alter default privileges in schema public grant all on functions to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2) STORAGE BUCKETS
--    episode-audio : PRIVATE — served only via signed URLs from
--                    /api/audio/[episodeId] after the membership check.
--    episode-art, show-art, blog-media, avatars : public read.
--    Size limits keep an accidental 2 GB upload from eating the quota.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('episode-audio', 'episode-audio', false, 314572800, array['audio/*']),          -- 300 MB
  ('episode-art',   'episode-art',   true,   10485760, array['image/*']),          -- 10 MB
  ('show-art',      'show-art',      true,   10485760, array['image/*']),          -- 10 MB
  ('blog-media',    'blog-media',    true,   15728640, array['image/*']),          -- 15 MB
  ('avatars',       'avatars',       true,    5242880, array['image/*'])           -- 5 MB
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 3) STORAGE POLICIES (storage.objects)
-- ---------------------------------------------------------------------

-- ---- Public read for the public buckets ------------------------------
drop policy if exists "storage: public buckets read" on storage.objects;
create policy "storage: public buckets read" on storage.objects
  for select using (
    bucket_id in ('episode-art', 'show-art', 'blog-media', 'avatars')
  );

-- ---- Editors and above manage all media buckets ----------------------
drop policy if exists "storage: editor insert" on storage.objects;
create policy "storage: editor insert" on storage.objects
  for insert with check (
    bucket_id in ('episode-audio', 'episode-art', 'show-art', 'blog-media', 'avatars')
    and public.is_editor()
  );

drop policy if exists "storage: editor update" on storage.objects;
create policy "storage: editor update" on storage.objects
  for update using (
    bucket_id in ('episode-audio', 'episode-art', 'show-art', 'blog-media', 'avatars')
    and public.is_editor()
  )
  with check (
    bucket_id in ('episode-audio', 'episode-art', 'show-art', 'blog-media', 'avatars')
    and public.is_editor()
  );

drop policy if exists "storage: editor delete" on storage.objects;
create policy "storage: editor delete" on storage.objects
  for delete using (
    bucket_id in ('episode-audio', 'episode-art', 'show-art', 'blog-media', 'avatars')
    and public.is_editor()
  );

-- ---- Members may manage their own avatar (folder = their user id) ----
drop policy if exists "storage: avatars own insert" on storage.objects;
create policy "storage: avatars own insert" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage: avatars own update" on storage.objects;
create policy "storage: avatars own update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "storage: avatars own delete" on storage.objects;
create policy "storage: avatars own delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---- Premium audio: read gate mirrors the episodes table policy ------
-- Signed-URL creation in /api/audio/[episodeId] runs as the requesting
-- user, so this SELECT policy is what actually authorizes the signing.
-- A row must exist in episodes pointing at this object, be published,
-- and be either free or unlocked by an active membership. Staff see all.
drop policy if exists "storage: episode audio gated read" on storage.objects;
create policy "storage: episode audio gated read" on storage.objects
  for select using (
    bucket_id = 'episode-audio'
    and (
      public.is_staff()
      or exists (
        select 1 from public.episodes e
        where e.audio_path = storage.objects.name
          and e.status = 'published'
          and (e.is_premium = false or public.has_active_membership())
      )
    )
  );