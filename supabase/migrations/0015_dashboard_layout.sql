-- 0015_dashboard_layout.sql
--
-- Stores each admin's personalized dashboard widget layout (which widgets
-- are visible, and their grid position/size) so it persists across visits
-- and devices — same rationale as timezone/date_format in 0011: this is a
-- personal preference on the user's own profile, not site-wide config.
--
-- Nullable: null means "no saved layout yet, use the built-in default"
-- (DEFAULT_LAYOUT / DEFAULT_VISIBLE_WIDGETS in
-- src/lib/admin-dashboard-widgets.ts).

alter table public.profiles
  add column if not exists dashboard_layout jsonb;

comment on column public.profiles.dashboard_layout is
  'Personal admin dashboard widget layout: { visible: WidgetKey[], layout: {i,x,y,w,h}[] }. Null = use the built-in default.';