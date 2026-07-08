-- =====================================================================
-- erwin-natividad-2026 — service_role grants repair
-- Migration: 0005_service_role_grants.sql
--
-- Root cause: 0002's grants block covered anon/authenticated but the
-- service-role client (used by admin server actions, e.g. saving site
-- content) hit "permission denied for table settings" — service_role
-- had no table-level grants either. RLS bypass and Postgres grants are
-- separate layers; bypassing RLS doesn't imply table access.
-- Safe to re-run.
-- =====================================================================

grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant all on all functions in schema public to service_role;

alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant all on functions to service_role;

notify pgrst, 'reload schema';