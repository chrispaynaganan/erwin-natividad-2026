-- 0013_bookings_calendly.sql
--
-- Adds Calendly linkage so discovery-call bookings synced in via
-- /api/webhooks/calendly can be matched again on cancellation, and so
-- webhook retries don't create duplicate rows (upsert on
-- calendly_invitee_uri).
--
-- A plain `unique` column (not a partial index) is used deliberately —
-- Postgres treats multiple NULLs as distinct under a unique constraint,
-- so old contact-form / pre-Calendly rows (which have no Calendly uris)
-- are unaffected, while every Calendly-sourced row still gets a real
-- uniqueness guarantee that upsert(..., { onConflict: 'calendly_invitee_uri' })
-- can target directly.

alter table public.bookings
  add column if not exists calendly_event_uri text,
  add column if not exists calendly_invitee_uri text unique;

comment on column public.bookings.calendly_event_uri is
  'Calendly scheduled-event URI (shared by every invitee of that same event).';
comment on column public.bookings.calendly_invitee_uri is
  'Calendly invitee URI — unique per booking. Used by the webhook to upsert on creation and to find the row again on cancellation.';

notify pgrst, 'reload schema';