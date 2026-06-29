# erwin-natividad-2026

Podcast agency website for **Erwin Natividad** · built by **Chris Paynaganan**
Agreement CPD-26-00001 · Next.js + Supabase + Stripe, deployed on Vercel.

---

## What's in here

```
erwin-natividad-2026/
├── docs/                      # Foundation docs (sitemap/IA, DB schema) — case-study material
├── supabase/
│   └── migrations/
│       └── 0001_initial_schema.sql   # The full database + RLS
├── src/
│   ├── app/                   # All routes (public, account, members, admin, api)
│   ├── components/            # Site header/footer, admin sidebar
│   └── lib/
│       ├── supabase/          # client (browser), server, admin (service role), middleware
│       ├── auth.ts            # requireRole(), getSessionProfile()
│       └── stripe.ts
├── middleware.ts              # Session refresh + private-area gate
├── .env.local.example         # Copy to .env.local and fill in
└── package.json
```

The whole thing **already builds** (`npm run build` passes). It's a working skeleton: routes, auth, role gating, and the admin shell are wired. The visual layer (your Figma designs) drops onto the route stubs from here.

---

## Setup checklist

You'll do the account/credential steps (I can't create accounts or hold keys for you); everything else is code that's already here.

### 0. Prerequisites (one time on your machine)
- Install **Node.js 18.18+** (20 LTS recommended) — https://nodejs.org
- Install **VS Code** — and open this folder: `File > Open Folder…`

### 1. Run it locally
```bash
npm install          # pulls dependencies (~30s)
cp .env.local.example .env.local   # then fill in values (steps 2–3)
npm run dev          # http://localhost:3000
```
It will load with placeholder data and the warm placeholder palette. Sign-in/admin won't work until Supabase is connected (step 2).

### 2. Supabase (database + auth)  — *you create the project*
1. Create a project at https://supabase.com (free tier is fine to start).
2. **Project Settings → API**: copy the **Project URL**, the **anon public** key, and the **service_role** key.
3. Paste them into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
4. Apply the schema. Easiest path: open **SQL Editor** in Supabase, paste the contents of `supabase/migrations/0001_initial_schema.sql`, and run it. (Or use the Supabase CLI: `supabase db push`.)
5. Create the Storage buckets (Storage → New bucket): `episode-audio` (private), `episode-art`, `show-art`, `blog-media`, `avatars` (public).
6. Sign up once through the app at `/signup`, then make yourself owner — in the SQL Editor:
   ```sql
   update public.profiles set role = 'owner' where id = '<your-auth-user-id>';
   ```
   (Find the id under Authentication → Users.)

### 3. Stripe (payments)  — *you create the account*
1. Create/sign in at https://stripe.com, stay in **test mode** for now.
2. **Developers → API keys**: copy the **secret** and **publishable** keys into `.env.local`
   (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
3. For local webhook testing, install the Stripe CLI and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET`.
   (The webhook handler is stubbed — membership/payment sync logic is marked `TODO`.)

### 4. GitHub  — *you create the repo*
```bash
git init
git add .
git commit -m "Initial scaffold"
# create an empty repo named erwin-natividad-2026 on github.com, then:
git remote add origin https://github.com/<you>/erwin-natividad-2026.git
git push -u origin main
```

### 5. Vercel (hosting)  — *you create the project*
1. At https://vercel.com, **Add New → Project**, import the GitHub repo.
2. Add the same environment variables from `.env.local` (set `NEXT_PUBLIC_SITE_URL` to your real domain).
3. Deploy. Point Erwin's domain's DNS at Vercel when ready.
4. In Stripe, add a production webhook endpoint at `https://yourdomain/api/stripe/webhook` and copy that signing secret into Vercel's env vars.

---

## Roles

`member < viewer < editor < admin < owner`. New signups are `member`. Staff roles are assigned via the admin Team section (server-enforced). The `/admin` area requires `viewer`+; payments/members/team/settings require `admin`+. See `docs/02-database-schema.md` for the full access model.

---

## Still placeholder (swap when Erwin's brand is confirmed)
- Accent color and fonts in `src/app/globals.css`
- Logo, agency name, content categories
- Booking provider (Calendly embed assumed) and MailerLite wiring

## Ownership transfer (on final payment)
GitHub repo, Vercel project, Supabase org, and the Figma file all transfer to Erwin. The admin panel carries no Chris branding by design.
