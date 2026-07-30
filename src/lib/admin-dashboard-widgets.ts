// Shared between src/app/admin/page.tsx (server: fetches metrics, reads the
// saved layout) and src/components/admin/dashboard-grid.tsx (client: renders
// and edits the grid). Keeping this in one plain .ts file means both sides
// agree on exactly which widgets exist without duplicating the list.

export const ALL_WIDGET_KEYS = [
  'bookings',
  'subscribers',
  'content',
  'blog',
  'podcasts',
  'projects',
  'payments',
  'seo',
  'settings',
] as const

export type WidgetKey = (typeof ALL_WIDGET_KEYS)[number]

export type LayoutItem = { i: WidgetKey; x: number; y: number; w: number; h: number }

export type DashboardLayout = {
  visible: WidgetKey[]
  layout: LayoutItem[]
}

// Static copy/links — anything that doesn't depend on live data. Metrics
// (the actual numbers) are computed server-side in page.tsx and passed in
// separately, since they need a live Supabase query, not just config.
export const WIDGET_META: Record<WidgetKey, { title: string; href: string; description: string }> = {
  bookings: { title: 'Bookings', href: '/admin/bookings', description: 'Discovery calls via Calendly and contact-form messages.' },
  subscribers: { title: 'Subscribers', href: '/admin/subscribers', description: 'Newsletter sign-ups and their status.' },
  content: { title: 'Content', href: '/admin/content', description: 'Homepage text, services, featured work, testimonials, client logos, and the nav logo.' },
  blog: { title: 'Blog', href: '/admin/blog', description: 'Write and publish posts.' },
  podcasts: { title: 'Podcasts', href: '/admin/shows', description: 'Shows and episodes.' },
  projects: { title: 'Projects', href: '/admin/projects', description: 'Voiceover work samples shown on /work.' },
  payments: { title: 'Payments', href: '/admin/payments', description: 'Revenue this month.' },
  seo: { title: 'SEO Health', href: '/admin/seo', description: 'Search titles, descriptions, and share images.' },
  settings: { title: 'Settings', href: '/admin/settings', description: 'Profile, notifications, defaults, and appearance.' },
}

// 12-column grid. Row height is set on the grid itself (dashboard-grid.tsx);
// h is in row units, not pixels.
export const DEFAULT_LAYOUT: LayoutItem[] = [
  { i: 'bookings', x: 0, y: 0, w: 4, h: 3 },
  { i: 'subscribers', x: 4, y: 0, w: 4, h: 3 },
  { i: 'content', x: 8, y: 0, w: 4, h: 3 },
  { i: 'blog', x: 0, y: 3, w: 4, h: 3 },
  { i: 'podcasts', x: 4, y: 3, w: 4, h: 3 },
  { i: 'projects', x: 8, y: 3, w: 4, h: 3 },
  { i: 'payments', x: 0, y: 6, w: 4, h: 3 },
  { i: 'seo', x: 4, y: 6, w: 4, h: 3 },
  { i: 'settings', x: 8, y: 6, w: 4, h: 3 },
]

export const DEFAULT_VISIBLE_WIDGETS: WidgetKey[] = [...ALL_WIDGET_KEYS]

export function defaultDashboardLayout(): DashboardLayout {
  return { visible: DEFAULT_VISIBLE_WIDGETS, layout: DEFAULT_LAYOUT }
}

// Metrics shape — computed live in page.tsx from real tables (bookings,
// newsletter_subscribers, blog_posts, shows, episodes, projects, payments).
// `payments` is nullable because reading it requires admin+ (RLS: "payments:
// admin read") — a viewer/editor session simply won't have this populated.
export type DashboardMetrics = {
  bookings: { thisWeek: number; waitlisted: number; needsReply: number }
  subscribers: { total: number; subscribed: number; pending: number }
  blog: { published: number; drafts: number }
  podcasts: { shows: number; episodesMissingAudio: number }
  projects: { published: number; featured: number; missingAudio: number }
  payments: { thisMonthCents: number; countThisMonth: number } | null
}