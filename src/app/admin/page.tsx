import { getSessionProfile, hasMinRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { DashboardGrid } from '@/components/admin/dashboard-grid'
import { defaultDashboardLayout, type DashboardLayout, type DashboardMetrics } from '@/lib/admin-dashboard-widgets'

export const dynamic = 'force-dynamic'

const WINDOW_DAYS = 7

function startOfMonthISO() {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
}

async function loadMetrics(
  supabase: Awaited<ReturnType<typeof createClient>>,
  canReadPayments: boolean,
): Promise<DashboardMetrics> {
  const since7 = new Date(Date.now() - WINDOW_DAYS * 86400000).toISOString()

  const [
    bookingsWeek, bookingsWaitlisted, bookingsNew,
    subsTotal, subsSubscribed, subsPending,
    blogPublished, blogDrafts,
    showsPublished, episodesMissingAudio,
    projectsPublished, projectsFeatured, projectsMissingAudio,
    paymentsRows,
  ] = await Promise.all([
    supabase.from('bookings').select('id', { count: 'exact', head: true })
      .eq('referral_source', 'discovery_call').neq('status', 'cancelled').gte('created_at', since7),
    supabase.from('bookings').select('id', { count: 'exact', head: true })
      .eq('waitlisted', true).neq('status', 'completed').neq('status', 'cancelled'),
    supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'new'),

    supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
    supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'subscribed'),
    supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'pending'),

    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),

    supabase.from('shows').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('episodes').select('id', { count: 'exact', head: true }).is('audio_path', null),

    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('is_featured', true),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'published').is('audio_url', null),

    canReadPayments
      ? supabase.from('payments').select('amount_cents').eq('status', 'succeeded').gte('created_at', startOfMonthISO())
      : Promise.resolve({ data: null, error: null } as { data: { amount_cents: number }[] | null; error: null }),
  ])

  return {
    bookings: {
      thisWeek: bookingsWeek.count ?? 0,
      waitlisted: bookingsWaitlisted.count ?? 0,
      needsReply: bookingsNew.count ?? 0,
    },
    subscribers: {
      total: subsTotal.count ?? 0,
      subscribed: subsSubscribed.count ?? 0,
      pending: subsPending.count ?? 0,
    },
    blog: {
      published: blogPublished.count ?? 0,
      drafts: blogDrafts.count ?? 0,
    },
    podcasts: {
      shows: showsPublished.count ?? 0,
      episodesMissingAudio: episodesMissingAudio.count ?? 0,
    },
    projects: {
      published: projectsPublished.count ?? 0,
      featured: projectsFeatured.count ?? 0,
      missingAudio: projectsMissingAudio.count ?? 0,
    },
    payments: canReadPayments
      ? {
          thisMonthCents: (paymentsRows.data ?? []).reduce((sum, r) => sum + (r.amount_cents ?? 0), 0),
          countThisMonth: (paymentsRows.data ?? []).length,
        }
      : null,
  }
}

export default async function AdminDashboard() {
  const session = await getSessionProfile()
  const supabase = await createClient()

  const canReadPayments = !!session && hasMinRole(session.profile.role, 'admin')
  const metrics = await loadMetrics(supabase, canReadPayments)

  // Explicit query rather than assuming getSessionProfile() already selects
  // this column — it's a new field (0015_dashboard_layout.sql) and
  // lib/auth.ts's own select list wasn't something this change could verify.
  let initialLayout: DashboardLayout = defaultDashboardLayout()
  if (session?.user.id) {
    const { data } = await supabase
      .from('profiles')
      .select('dashboard_layout')
      .eq('id', session.user.id)
      .maybeSingle()
    const saved = data?.dashboard_layout as DashboardLayout | null | undefined
    if (saved && Array.isArray(saved.visible) && Array.isArray(saved.layout)) {
      initialLayout = saved
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 600, letterSpacing: '-0.01em' }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: '0.9rem' }}>
        Welcome back, {session?.profile.full_name ?? session?.user.email}. Here&rsquo;s what&rsquo;s going on across the site.
      </p>

      <DashboardGrid metrics={metrics} initialLayout={initialLayout} />
    </div>
  )
}