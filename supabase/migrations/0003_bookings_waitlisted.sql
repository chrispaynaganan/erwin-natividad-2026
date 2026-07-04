-- 0003_bookings_waitlisted.sql
-- Catch-up: the live dev DB was created from a pre-waitlist draft of 0001.
-- The repo's 0001 already includes this column, so this is a no-op on any
-- database created fresh from the current files (hence IF NOT EXISTS).

alter table public.bookings
  add column if not exists waitlisted boolean not null default false;

notify pgrst, 'reload schema';