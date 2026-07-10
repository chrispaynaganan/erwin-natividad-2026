-- Single source of truth for "friendly, admin-editable URL" <-> "stable internal page".
-- Buttons/links reference the stable `id` (never changes); the public-facing `slug`
-- can be renamed freely in admin and everything resolves correctly, no redeploy needed.

create table if not exists page_routes (
  id text primary key,                 -- stable internal key, referenced in code — NEVER renamed
  slug text not null unique,           -- public-facing path segment — this is what Erwin edits
  label text not null,                 -- friendly name shown in admin dropdowns, e.g. "Work With Me"
  updated_at timestamptz not null default now()
);

-- Seed with the pages that exist today. Add a row here for every static page
-- (services, booking, etc.) that should be independently renameable.
insert into page_routes (id, slug, label) values
  ('work-with-me', 'work-with-me', 'Work With Me'),
  ('work', 'work', 'Portfolio / Work')
on conflict (id) do nothing;

-- RLS: public can read (needed at request time by the route-map API + middleware),
-- only editor/service-role can write. Mirrors the pattern used for projects/episodes.
alter table page_routes enable row level security;

create policy "page_routes readable by anyone"
  on page_routes for select
  using (true);