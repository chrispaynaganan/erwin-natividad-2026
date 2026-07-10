-- Adds per-admin preferences to profiles: notification toggles, timezone,
-- and preferred date display format. Written by the user themselves via the
-- session client — the existing "profiles: update own" RLS policy already
-- covers this (it only blocks a user from changing their own `role`).

alter table public.profiles
  add column if not exists notify_new_booking boolean not null default true,
  add column if not exists notify_new_subscriber boolean not null default true,
  add column if not exists notify_new_contact boolean not null default true,
  add column if not exists timezone text not null default 'America/New_York',
  add column if not exists date_format text not null default 'MMM D, YYYY';

alter table public.profiles
  add constraint profiles_date_format_check
  check (date_format in ('MMM D, YYYY', 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'));

-- PostgREST caches the schema — reload so the new columns are visible
-- immediately (per §9's documented PGRST204 gotcha).
notify pgrst, 'reload schema';