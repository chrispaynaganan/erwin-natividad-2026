# 01 — Foundation: Sitemap & Information Architecture

> **Project:** `erwin-natividad-2026` · Podcast agency website
> **Client:** Erwin Natividad (Durham, North Carolina, USA)
> **Agreement:** CPD-26-00001 · Package: Growth Business (Platform-level scope)
> **Service Provider:** Chris Paynaganan — chrispaynaganan.com
> **Status:** Foundation phase — structure locked, visual layer pending brand confirmation

---

## 1. Context

A hand-coded, B2B-leaning podcast agency website. The agency's focus is **dubbing and commercial podcast production** — the primary audience is brands, sponsors, and agencies, with a secondary public/listener audience for the agency's own published episodes and any gated premium content.

Because the signed Scope of Work (Schedule A) includes **Stripe**, **user accounts/profiles**, and the full **Admin CMS**, this is architected as a Platform-level application, not a brochure site. The structure below reflects that: a public marketing + content surface, an authenticated member surface (accounts, gated content, billing), and a private role-protected admin.

### Locked decisions feeding this foundation
| Concern | Decision |
|---|---|
| Newsletter | MailerLite (double opt-in) |
| Booking | Calendly / Cal.com embed *or* custom Supabase flow — embed assumed for v1 |
| Payments | Stripe (subscriptions + one-off) |
| Auth | Supabase Auth, role-based |
| Backend | Supabase (Postgres + Auth + Storage) |
| Hosting | Vercel |
| Audio editing | **Out of scope** (Schedule A exclusion #4) |

### Still blocking the *visual* layer only (not this foundation)
Agency name, accent color, typeface confirmation, logo, content categories, podcast host platform. None of these block sitemap, IA, or the database — they are resolved before the design-token pass.

---

## 2. Sitemap

```
PUBLIC (unauthenticated, indexable)
/                            Home — hero, positioning, featured work, latest episodes, CTA
├── /about                   Studio story, team, approach, credentials
├── /services                Packages & offerings (production, dubbing, commercial)
├── /work                    Portfolio / case studies of produced work
│   └── /work/[slug]         Individual project case study
├── /podcast                 Show hub — all published episodes, search & filter
│   ├── /podcast/[show]       Show landing (supports multiple shows)
│   └── /podcast/[show]/[episode]   Episode detail + full player + show notes
├── /blog                    Content hub — articles & show notes
│   ├── /blog/[slug]          Article detail
│   └── /blog/category/[cat]  Category-filtered listing
├── /book                    Booking / discovery (multi-step or Calendly embed)
├── /contact                 Contact form + details
├── /pricing                 Membership / premium tiers (Stripe)
├── /privacy                 Privacy Policy (RA 10173 + general)
└── /terms                   Terms of Service

AUTHENTICATED — MEMBER (listener/subscriber, role = member)
/login                       Sign in
/signup                      Create account
/forgot-password             Password reset request
/reset-password              Password reset (token)
/account                     Account home
├── /account/profile         Profile details, avatar
├── /account/membership      Plan, status, manage via Stripe portal
├── /account/billing         Invoices / payment history (read-only)
└── /account/library         Saved / in-progress episodes (resume positions)
/members                     Gated premium episode area (membership required)

ADMIN — PRIVATE (role ≥ viewer; fully Erwin-owned, no Chris branding)
/admin                       Dashboard — analytics overview
├── /admin/episodes          Episode management (list / new / edit)
├── /admin/shows             Show management (multi-show)
├── /admin/blog              Blog post management (list / new / edit)
├── /admin/bookings          Booking inbox + status pipeline
├── /admin/subscribers       Newsletter subscribers + MailerLite sync
├── /admin/members           Member / user management
├── /admin/payments          Stripe subscriptions & transaction log (read)
├── /admin/team              Team management — invite, assign roles (owner/admin only)
└── /admin/settings          Site settings, integrations, brand config

UTILITY
/sitemap.xml                 Generated XML sitemap
/robots.txt                  Crawl rules (disallow /admin, /account)
/404, /500                   Error states
```

---

## 3. URL & slug conventions

- All routes lowercase, hyphen-delimited; no trailing slashes.
- Content slugs are stable and human-readable, generated from the title at creation and **never auto-changed on edit** (avoids breaking shared links / SEO). A slug change is a deliberate action with an optional 301.
- Episode canonical path: `/podcast/[show-slug]/[episode-slug]`. Episodes are never addressed by raw ID publicly.
- `/admin/*` and `/account/*` are `noindex` and excluded from `sitemap.xml`; `/admin/*` is additionally disallowed in `robots.txt`.
- Premium-gated episodes still have a public URL (for SEO + share), but the body/player is replaced with a paywall component for non-members. **Never leak premium audio URLs to unauthenticated clients** — signed URLs only, issued server-side after a membership check.

---

## 4. Navigation model

**Primary nav (public):** Home · About · Services · Work · Podcast · Blog · `Book a call` (accent CTA).
On scroll: condensed sticky header. Mobile: full-screen drawer.

**Member nav (when authenticated):** primary nav + account menu (avatar → Account, Membership, Library, Sign out). Members see a `Members` entry once they hold an active subscription.

**Footer nav:** Brand column · Company (Home, About, Work, Blog, Contact) · Services (packages + Book a call) · Newsletter signup. Bottom bar: dynamic-year copyright · "Made by Chris Paynaganan" (public site only — confirm with Erwin) · Privacy · Terms.

**Admin nav:** left sidebar — Dashboard, Episodes, Shows, Blog, Bookings, Subscribers, Members, Payments, Team, Settings. Team is hidden for roles below admin. Admin footer carries a version number + Docs/Support links and **zero Chris branding** (the admin is wholly Erwin's, per the design spec).

---

## 5. Page inventory

| Route | Template | Auth | Primary purpose |
|---|---|---|---|
| `/` | Marketing | Public | Convert visitors to a booked call |
| `/about` | Marketing | Public | Build trust / credentials |
| `/services` | Marketing | Public | Explain offerings, route to booking |
| `/work`, `/work/[slug]` | Portfolio | Public | Proof of work |
| `/podcast`, `/podcast/[show]` | Listing | Public | Browse shows/episodes |
| `/podcast/[show]/[episode]` | Episode detail | Public (premium gated) | Listen + show notes |
| `/blog`, `/blog/[slug]`, `/blog/category/[cat]` | Content | Public | SEO + content marketing |
| `/book` | Form / embed | Public | Capture qualified leads |
| `/contact` | Form | Public | General contact |
| `/pricing` | Marketing | Public | Sell memberships |
| `/login`, `/signup`, password flows | Auth | Public | Account access |
| `/account/*` | App | Member | Self-service account |
| `/members` | App | Member (active sub) | Premium content |
| `/privacy`, `/terms` | Legal | Public | Compliance |
| `/admin` | Admin | Viewer+ | Ops dashboard |
| `/admin/episodes`, `/shows`, `/blog`, `/bookings`, `/subscribers`, `/members`, `/payments` | Admin | Role-gated | Manage content & data |
| `/admin/team` | Admin | Owner/Admin | Team & roles |
| `/admin/settings` | Admin | Admin | Configuration |

---

## 6. Roles & access matrix

Five application roles, lowest to highest privilege:

| Role | Who | Public site | Member area | Admin |
|---|---|---|---|---|
| `member` | Listener / subscriber | ✅ | ✅ (own account, premium if subscribed) | ❌ |
| `viewer` | Staff — read only | ✅ | ✅ | Read-only admin |
| `editor` | Staff — content | ✅ | ✅ | Manage episodes, blog, bookings, subscribers |
| `admin` | Staff — full ops | ✅ | ✅ | All editor rights + members, payments, settings, invite team |
| `owner` | Erwin | ✅ | ✅ | Everything, including assigning `admin` and transferring ownership |

**Capability detail (admin surface):**

| Capability | viewer | editor | admin | owner |
|---|:--:|:--:|:--:|:--:|
| View dashboard / analytics | ✅ | ✅ | ✅ | ✅ |
| Create / edit episodes, shows, blog | — | ✅ | ✅ | ✅ |
| Publish / unpublish content | — | ✅ | ✅ | ✅ |
| Manage bookings (status changes) | — | ✅ | ✅ | ✅ |
| Manage newsletter subscribers | — | ✅ | ✅ | ✅ |
| View members & payments | — | — | ✅ | ✅ |
| Edit site settings / integrations | — | — | ✅ | ✅ |
| Invite team & assign roles (≤ editor) | — | — | ✅ | ✅ |
| Assign `admin` role / transfer ownership | — | — | — | ✅ |

This matrix is the human-readable source of truth; the database (doc 02) enforces it via Row Level Security so the rules can't be bypassed from the client.

---

## 7. Content model (overview)

Detailed in `02-database-schema.md`. At a glance, the system manages: **shows → episodes** (with premium gating, transcripts, show notes), **blog posts** with **categories/tags**, **bookings**, **newsletter subscribers**, **members** (profiles), **memberships/subscriptions + payments** (Stripe-driven), **team invitations**, and a key/value **settings** store. Listening **progress** and episode **plays** support the resume feature and the analytics dashboard.

---

## 8. SEO foundation (structural)

- Semantic HTML5 landmarks on every template; one `<h1>` per page.
- Per-route metadata + Open Graph + Twitter cards; episode and article pages emit JSON-LD (`PodcastEpisode`, `BlogPosting`).
- Generated `sitemap.xml` includes only public, published, indexable URLs.
- `robots.txt` disallows `/admin` and `/account`.
- Canonical URLs on all content; premium pages remain indexable with a paywall body (Google "flexible sampling" pattern).

---

## 9. What this foundation unblocks next

1. **Dev scaffolding** — repo `erwin-natividad-2026`, Supabase project, Vercel project, app skeleton matching the routes above.
2. **Schema migration** — apply `supabase/migrations/0001_initial_schema.sql` (doc 02).
3. **/admin shell** — role-gated layout + the nine admin sections as empty routes, ready for UI.
4. **UI integration** — drop the existing responsive designs onto these routes.

*Visual tokens (color, type, logo) are applied during UI integration once Erwin confirms the brand.*
