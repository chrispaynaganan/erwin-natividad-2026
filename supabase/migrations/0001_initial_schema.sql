-- =====================================================================
-- erwin-natividad-2026 — Initial schema
-- Supabase / PostgreSQL
-- Migration: 0001_initial_schema.sql
--
-- Covers: profiles & roles, shows & episodes (with premium gating),
-- blog + categories/tags, bookings, newsletter subscribers, Stripe
-- memberships/plans/payments, team invitations, listening progress,
-- episode plays (analytics), and a key/value settings store.
--
-- Security model: Row Level Security is enabled on every table. Role
-- checks run through SECURITY DEFINER helper functions so that policies
-- never recurse on the profiles table. All Stripe-owned tables are
-- written only by the service role (webhooks); clients can read their own.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------
create extension if not exists "pgcrypto";      -- gen_random_uuid()
create extension if not exists "citext";         -- case-insensitive email

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------
create type app_role         as enum ('member', 'viewer', 'editor', 'admin', 'owner');
create type content_status   as enum ('draft', 'scheduled', 'published', 'archived');
create type booking_status   as enum ('new', 'contacted', 'confirmed', 'completed', 'cancelled');
create type sub_status        as enum ('pending', 'subscribed', 'unsubscribed', 'bounced');
create type membership_status as enum ('trialing', 'active', 'past_due', 'canceled', 'incomplete');
create type invite_status     as enum ('pending', 'accepted', 'revoked', 'expired');
create type category_kind     as enum ('episode', 'blog');

-- ---------------------------------------------------------------------
-- Shared trigger: keep updated_at current
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- PROFILES & ROLES
-- One row per auth user. role drives every access decision.
-- =====================================================================
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        app_role    not null default 'member',
  full_name   text,
  avatar_url  text,
  bio         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_profiles_updated
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Role helper functions (SECURITY DEFINER -> bypass RLS, no recursion)
-- ---------------------------------------------------------------------
create or replace function public.current_app_role()
returns app_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Numeric rank so we can express "at least editor", etc.
create or replace function public.role_rank(r app_role)
returns int
language sql immutable
as $$
  select case r
    when 'member' then 0
    when 'viewer' then 1
    when 'editor' then 2
    when 'admin'  then 3
    when 'owner'  then 4
  end;
$$;

create or replace function public.has_min_role(min_role app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select coalesce(public.role_rank(public.current_app_role()) >= public.role_rank(min_role), false);
$$;

create or replace function public.is_staff()  returns boolean
language sql stable as $$ select public.has_min_role('viewer'); $$;

create or replace function public.is_editor() returns boolean
language sql stable as $$ select public.has_min_role('editor'); $$;

create or replace function public.is_admin()  returns boolean
language sql stable as $$ select public.has_min_role('admin'); $$;

create or replace function public.is_owner()  returns boolean
language sql stable as $$ select public.has_min_role('owner'); $$;

-- =====================================================================
-- MEMBERSHIP PLANS, MEMBERSHIPS & PAYMENTS (Stripe-driven)
-- Written exclusively by the service role via Stripe webhooks.
-- =====================================================================
create table public.plans (
  id              uuid primary key default gen_random_uuid(),
  name            text    not null,
  description     text,
  stripe_price_id text    unique,
  amount_cents    int     not null,
  currency        text    not null default 'usd',
  "interval"      text    not null default 'month',   -- month | year | one_time
  features        jsonb   not null default '[]'::jsonb,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_plans_updated
  before update on public.plans
  for each row execute function public.set_updated_at();

create table public.memberships (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references public.profiles (id) on delete cascade,
  plan_id                uuid references public.plans (id) on delete set null,
  stripe_customer_id     text,
  stripe_subscription_id text unique,
  status                 membership_status not null default 'incomplete',
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create unique index memberships_user_active_idx
  on public.memberships (user_id)
  where status in ('trialing', 'active', 'past_due');

create trigger trg_memberships_updated
  before update on public.memberships
  for each row execute function public.set_updated_at();

create table public.payments (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid references public.profiles (id) on delete set null,
  membership_id            uuid references public.memberships (id) on delete set null,
  stripe_payment_intent_id text unique,
  amount_cents             int  not null,
  currency                 text not null default 'usd',
  status                   text not null,            -- succeeded | pending | failed | refunded
  description              text,
  created_at               timestamptz not null default now()
);

create index payments_user_idx on public.payments (user_id, created_at desc);

-- Does the current user hold a membership that grants premium access?
create or replace function public.has_active_membership()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.memberships m
    where m.user_id = auth.uid()
      and m.status in ('trialing', 'active')
      and (m.current_period_end is null or m.current_period_end > now())
  );
$$;

-- =====================================================================
-- SHOWS & EPISODES
-- =====================================================================
create table public.shows (
  id          uuid primary key default gen_random_uuid(),
  title       text    not null,
  slug        text    not null unique,
  description text,
  cover_url   text,
  status      content_status not null default 'draft',
  sort_order  int     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_shows_updated
  before update on public.shows
  for each row execute function public.set_updated_at();

create table public.episodes (
  id             uuid primary key default gen_random_uuid(),
  show_id        uuid not null references public.shows (id) on delete cascade,
  title          text not null,
  slug           text not null,
  description    text,
  show_notes     text,
  transcript     text,
  audio_path     text,                         -- Storage object path (not a public URL)
  duration_secs  int,
  episode_number int,
  season         int,
  cover_url      text,
  is_premium     boolean not null default false,
  status         content_status not null default 'draft',
  published_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (show_id, slug)
);

create index episodes_show_idx      on public.episodes (show_id);
create index episodes_published_idx on public.episodes (status, published_at desc);

create trigger trg_episodes_updated
  before update on public.episodes
  for each row execute function public.set_updated_at();

-- =====================================================================
-- CATEGORIES, TAGS, BLOG
-- =====================================================================
create table public.categories (
  id    uuid primary key default gen_random_uuid(),
  kind  category_kind not null,
  name  text not null,
  slug  text not null,
  color text,
  unique (kind, slug)
);

create table public.tags (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  excerpt      text,
  body         text,
  cover_url    text,
  author_id    uuid references public.profiles (id) on delete set null,
  category_id  uuid references public.categories (id) on delete set null,
  status       content_status not null default 'draft',
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index blog_published_idx on public.blog_posts (status, published_at desc);

create trigger trg_blog_updated
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

create table public.blog_post_tags (
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  tag_id  uuid not null references public.tags (id)       on delete cascade,
  primary key (post_id, tag_id)
);

-- =====================================================================
-- BOOKINGS  (public can insert; staff can read/manage)
-- =====================================================================
create table public.bookings (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text not null,
  email               citext not null,
  company             text,
  phone               text,
  website             text,
  service_interest    text,
  preferred_date      date,
  preferred_time      text,
  timezone            text,
  message             text,
  referral_source     text,
  status              booking_status not null default 'new',
  waitlisted          boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index bookings_status_idx on public.bookings (status, created_at desc);

create trigger trg_bookings_updated
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- =====================================================================
-- NEWSLETTER SUBSCRIBERS  (public insert; staff read/manage; MailerLite sync)
-- =====================================================================
create table public.newsletter_subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           citext not null unique,
  status          sub_status not null default 'pending',
  source          text,
  mailerlite_id   text,
  subscribed_at   timestamptz,
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now()
);

-- =====================================================================
-- TEAM INVITATIONS  (admin/owner only)
-- =====================================================================
create table public.team_invitations (
  id          uuid primary key default gen_random_uuid(),
  email       citext not null,
  role        app_role not null default 'viewer',
  invited_by  uuid references public.profiles (id) on delete set null,
  token       text not null unique default encode(gen_random_bytes(24), 'hex'),
  status      invite_status not null default 'pending',
  expires_at  timestamptz not null default (now() + interval '7 days'),
  created_at  timestamptz not null default now()
);

-- =====================================================================
-- LISTENING PROGRESS (logged-in resume) & EPISODE PLAYS (analytics)
-- =====================================================================
create table public.episode_progress (
  user_id          uuid not null references public.profiles (id) on delete cascade,
  episode_id       uuid not null references public.episodes (id) on delete cascade,
  position_secs    int  not null default 0,
  completed        boolean not null default false,
  updated_at       timestamptz not null default now(),
  primary key (user_id, episode_id)
);

create table public.episode_plays (
  id          bigint generated always as identity primary key,
  episode_id  uuid references public.episodes (id) on delete set null,
  user_id     uuid references public.profiles (id) on delete set null,
  played_at   timestamptz not null default now()
);

create index episode_plays_episode_idx on public.episode_plays (episode_id, played_at desc);

-- =====================================================================
-- SITE SETTINGS  (key/value; admin-managed, public-readable subset)
-- =====================================================================
create table public.settings (
  key         text primary key,
  value       jsonb not null,
  is_public   boolean not null default false,
  updated_at  timestamptz not null default now()
);

create trigger trg_settings_updated
  before update on public.settings
  for each row execute function public.set_updated_at();

-- Seed: max discovery-call requests accepted per rolling week before new
-- submissions are placed on a waitlist instead. Editable in admin Settings.
insert into public.settings (key, value, is_public)
values ('discovery_weekly_cap', '3'::jsonb, false)
on conflict (key) do nothing;

-- =====================================================================
-- ROW LEVEL SECURITY
-- =====================================================================
alter table public.profiles               enable row level security;
alter table public.plans                  enable row level security;
alter table public.memberships            enable row level security;
alter table public.payments               enable row level security;
alter table public.shows                  enable row level security;
alter table public.episodes               enable row level security;
alter table public.categories             enable row level security;
alter table public.tags                   enable row level security;
alter table public.blog_posts             enable row level security;
alter table public.blog_post_tags         enable row level security;
alter table public.bookings               enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.team_invitations       enable row level security;
alter table public.episode_progress       enable row level security;
alter table public.episode_plays          enable row level security;
alter table public.settings               enable row level security;

-- ---- PROFILES -------------------------------------------------------
create policy "profiles: read own"        on public.profiles for select using (id = auth.uid());
create policy "profiles: staff read all"  on public.profiles for select using (public.is_staff());
create policy "profiles: update own"      on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = public.current_app_role());   -- cannot self-escalate role
create policy "profiles: admin manage"    on public.profiles for update using (public.is_admin());

-- ---- PLANS (public catalog of active plans; admins manage) ----------
create policy "plans: public read active" on public.plans for select using (is_active or public.is_staff());
create policy "plans: admin write"        on public.plans for all    using (public.is_admin()) with check (public.is_admin());

-- ---- MEMBERSHIPS (own read; staff>=admin read; writes via service role)
create policy "memberships: read own"     on public.memberships for select using (user_id = auth.uid());
create policy "memberships: admin read"   on public.memberships for select using (public.is_admin());

-- ---- PAYMENTS (own read; admin read; writes via service role) -------
create policy "payments: read own"        on public.payments for select using (user_id = auth.uid());
create policy "payments: admin read"      on public.payments for select using (public.is_admin());

-- ---- SHOWS ----------------------------------------------------------
create policy "shows: public read published" on public.shows for select
  using (status = 'published' or public.is_staff());
create policy "shows: editor write"          on public.shows for all
  using (public.is_editor()) with check (public.is_editor());

-- ---- EPISODES -------------------------------------------------------
-- Public can read published, non-premium episodes. Premium requires an
-- active membership. Staff see everything. (Audio is served via signed
-- URLs generated server-side after this same check — see doc 02.)
create policy "episodes: public read"     on public.episodes for select using (
  public.is_staff()
  or (
    status = 'published'
    and (is_premium = false or public.has_active_membership())
  )
);
create policy "episodes: editor write"    on public.episodes for all
  using (public.is_editor()) with check (public.is_editor());

-- ---- CATEGORIES & TAGS (public read; editor manage) -----------------
create policy "categories: public read"   on public.categories for select using (true);
create policy "categories: editor write"  on public.categories for all using (public.is_editor()) with check (public.is_editor());
create policy "tags: public read"         on public.tags for select using (true);
create policy "tags: editor write"        on public.tags for all using (public.is_editor()) with check (public.is_editor());

-- ---- BLOG -----------------------------------------------------------
create policy "blog: public read published" on public.blog_posts for select
  using (status = 'published' or public.is_staff());
create policy "blog: editor write"          on public.blog_posts for all
  using (public.is_editor()) with check (public.is_editor());
create policy "blog_tags: public read"      on public.blog_post_tags for select using (true);
create policy "blog_tags: editor write"     on public.blog_post_tags for all
  using (public.is_editor()) with check (public.is_editor());

-- ---- BOOKINGS (anyone may submit; staff read/manage) ----------------
create policy "bookings: public insert"   on public.bookings for insert with check (true);
create policy "bookings: staff read"      on public.bookings for select using (public.is_staff());
create policy "bookings: editor manage"   on public.bookings for update using (public.is_editor()) with check (public.is_editor());

-- ---- NEWSLETTER (anyone may subscribe; staff read/manage) -----------
create policy "subs: public insert"       on public.newsletter_subscribers for insert with check (true);
create policy "subs: staff read"          on public.newsletter_subscribers for select using (public.is_staff());
create policy "subs: editor manage"       on public.newsletter_subscribers for update using (public.is_editor()) with check (public.is_editor());

-- ---- TEAM INVITATIONS (admin/owner only) ----------------------------
create policy "invites: admin all"        on public.team_invitations for all
  using (public.is_admin()) with check (public.is_admin());

-- ---- EPISODE PROGRESS (own only) ------------------------------------
create policy "progress: own all"         on public.episode_progress for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- EPISODE PLAYS (anyone may log a play; staff read) --------------
create policy "plays: public insert"      on public.episode_plays for insert with check (true);
create policy "plays: staff read"         on public.episode_plays for select using (public.is_staff());

-- ---- SETTINGS (public subset readable; admin writes) ----------------
create policy "settings: public read"     on public.settings for select using (is_public or public.is_staff());
create policy "settings: admin write"     on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- =====================================================================
-- SEED — minimal bootstrap (no PII)
-- After deploy: promote Erwin to owner with
--   update public.profiles set role = 'owner' where id = '<erwin-auth-uid>';
-- =====================================================================
insert into public.settings (key, value, is_public) values
  ('site_name',        '"Erwin Natividad — Podcast Agency"'::jsonb, true),
  ('booking_provider', '"calendly"'::jsonb,                          false),
  ('newsletter_provider', '"mailerlite"'::jsonb,                     false)
on conflict (key) do nothing;