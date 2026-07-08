-- =====================================================================
-- erwin-natividad-2026 — Episode, show, and blog media buckets
-- Migration: 0006_episode_media_buckets.sql
--
-- Root cause: doc 02 (§6, "Storage buckets") documented episode-audio,
-- episode-art, show-art, and blog-media as "configured at scaffolding" —
-- but only site-media was actually created, in 0004. Audio upload was
-- failing with an opaque error because .storage.from('episode-audio')
-- had no bucket to target at all.
--
-- episode-audio is PRIVATE (per doc 02 §5 — "Premium audio never leaks").
-- No public/staff SELECT policy is added: playback goes through signed
-- URLs minted server-side via the service-role client, which bypasses
-- these policies entirely, the same way createAdminClient() already
-- does for every write in this migration's sibling buckets.
--
-- episode-art, show-art, and blog-media are public, same shape as
-- site-media.
-- Safe to re-run.
-- =====================================================================

-- ---- episode-audio (private) -----------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('episode-audio', 'episode-audio', false, 209715200, array['audio/*'])  -- 200 MB
on conflict (id) do nothing;

drop policy if exists "storage: episode-audio staff read" on storage.objects;
create policy "storage: episode-audio staff read" on storage.objects
  for select using (bucket_id = 'episode-audio' and public.is_staff());

drop policy if exists "storage: episode-audio editor insert" on storage.objects;
create policy "storage: episode-audio editor insert" on storage.objects
  for insert with check (bucket_id = 'episode-audio' and public.is_editor());

drop policy if exists "storage: episode-audio editor update" on storage.objects;
create policy "storage: episode-audio editor update" on storage.objects
  for update using (bucket_id = 'episode-audio' and public.is_editor())
  with check (bucket_id = 'episode-audio' and public.is_editor());

drop policy if exists "storage: episode-audio editor delete" on storage.objects;
create policy "storage: episode-audio editor delete" on storage.objects
  for delete using (bucket_id = 'episode-audio' and public.is_editor());

-- ---- episode-art (public) ---------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('episode-art', 'episode-art', true, 10485760, array['image/*'])  -- 10 MB
on conflict (id) do nothing;

drop policy if exists "storage: episode-art public read" on storage.objects;
create policy "storage: episode-art public read" on storage.objects
  for select using (bucket_id = 'episode-art');

drop policy if exists "storage: episode-art editor insert" on storage.objects;
create policy "storage: episode-art editor insert" on storage.objects
  for insert with check (bucket_id = 'episode-art' and public.is_editor());

drop policy if exists "storage: episode-art editor update" on storage.objects;
create policy "storage: episode-art editor update" on storage.objects
  for update using (bucket_id = 'episode-art' and public.is_editor())
  with check (bucket_id = 'episode-art' and public.is_editor());

drop policy if exists "storage: episode-art editor delete" on storage.objects;
create policy "storage: episode-art editor delete" on storage.objects
  for delete using (bucket_id = 'episode-art' and public.is_editor());

-- ---- show-art (public) --------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('show-art', 'show-art', true, 10485760, array['image/*'])  -- 10 MB
on conflict (id) do nothing;

drop policy if exists "storage: show-art public read" on storage.objects;
create policy "storage: show-art public read" on storage.objects
  for select using (bucket_id = 'show-art');

drop policy if exists "storage: show-art editor insert" on storage.objects;
create policy "storage: show-art editor insert" on storage.objects
  for insert with check (bucket_id = 'show-art' and public.is_editor());

drop policy if exists "storage: show-art editor update" on storage.objects;
create policy "storage: show-art editor update" on storage.objects
  for update using (bucket_id = 'show-art' and public.is_editor())
  with check (bucket_id = 'show-art' and public.is_editor());

drop policy if exists "storage: show-art editor delete" on storage.objects;
create policy "storage: show-art editor delete" on storage.objects
  for delete using (bucket_id = 'show-art' and public.is_editor());

-- ---- blog-media (public) -------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-media', 'blog-media', true, 10485760, array['image/*'])  -- 10 MB
on conflict (id) do nothing;

drop policy if exists "storage: blog-media public read" on storage.objects;
create policy "storage: blog-media public read" on storage.objects
  for select using (bucket_id = 'blog-media');

drop policy if exists "storage: blog-media editor insert" on storage.objects;
create policy "storage: blog-media editor insert" on storage.objects
  for insert with check (bucket_id = 'blog-media' and public.is_editor());

drop policy if exists "storage: blog-media editor update" on storage.objects;
create policy "storage: blog-media editor update" on storage.objects
  for update using (bucket_id = 'blog-media' and public.is_editor())
  with check (bucket_id = 'blog-media' and public.is_editor());

drop policy if exists "storage: blog-media editor delete" on storage.objects;
create policy "storage: blog-media editor delete" on storage.objects
  for delete using (bucket_id = 'blog-media' and public.is_editor());

notify pgrst, 'reload schema';