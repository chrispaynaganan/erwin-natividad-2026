-- =====================================================================
-- erwin-natividad-2026 — Site media bucket
-- Migration: 0004_site_media.sql
--
-- General-purpose public image bucket for site content managed through
-- the admin Content editor: nav logos, client logos, section images.
-- (episode-art / show-art / blog-media stay dedicated to their features.)
-- Safe to re-run.
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 10485760, array['image/*'])  -- 10 MB
on conflict (id) do nothing;

drop policy if exists "storage: site-media public read" on storage.objects;
create policy "storage: site-media public read" on storage.objects
  for select using (bucket_id = 'site-media');

drop policy if exists "storage: site-media editor insert" on storage.objects;
create policy "storage: site-media editor insert" on storage.objects
  for insert with check (bucket_id = 'site-media' and public.is_editor());

drop policy if exists "storage: site-media editor update" on storage.objects;
create policy "storage: site-media editor update" on storage.objects
  for update using (bucket_id = 'site-media' and public.is_editor())
  with check (bucket_id = 'site-media' and public.is_editor());

drop policy if exists "storage: site-media editor delete" on storage.objects;
create policy "storage: site-media editor delete" on storage.objects
  for delete using (bucket_id = 'site-media' and public.is_editor());

notify pgrst, 'reload schema';