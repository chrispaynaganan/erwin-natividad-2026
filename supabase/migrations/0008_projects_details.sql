-- =====================================================================
-- erwin-natividad-2026 — Project detail fields
-- Migration: 0008_projects_details.sql
--
-- The existing /work + /work/[slug] pages (built before this backend
-- existed) expect a richer shape than 0007 created: a short card
-- description PLUS a separate multi-paragraph detail body, and a set of
-- spec-sheet fields (client, studio, length, age range, character, genre,
-- deliverables) shown in the detail page's sidebar.
--
-- `body` (0007) is renamed to `description` to disambiguate it from the
-- new `paragraphs` array, which holds the full detail-page content.
-- `date_label` is reused for both the card's date and the detail sidebar's
-- "Completed" field — the static data had these as always-identical
-- values, so no separate column was added for it.
-- Safe to re-run (guards on column existence where it matters).
-- =====================================================================

alter table public.projects rename column body to description;

alter table public.projects
  add column if not exists paragraphs      text[] not null default '{}',
  add column if not exists client          text,
  add column if not exists studio          text,
  add column if not exists length_label    text,   -- e.g. "180 minutes total" — distinct from duration_secs (the playable demo's own length)
  add column if not exists age_range       text,
  add column if not exists voice_character text,   -- named to avoid any ambiguity with the SQL "character" type
  add column if not exists genre           text,
  add column if not exists deliverables    text;

notify pgrst, 'reload schema';