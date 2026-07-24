import Link from 'next/link'
import { requireRole } from '@/lib/auth'
import { getSiteContent } from '@/lib/content/store'
import { listBlogPosts } from '@/lib/blog-db/store'
import s from './seo-health.module.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'SEO health' }

const TITLE_LIMIT = 60
const DESC_LIMIT = 160

const PAGES = [
  { key: 'home', label: 'Home' },
  { key: 'services', label: 'Services' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'faq', label: 'FAQ' },
]

type Cell = { status: 'set' | 'default' | 'warning'; label: string; detail?: string }

type Row = {
  key: string
  label: string
  href: string
  note?: string
  nested?: boolean
  title: Cell
  description: Cell
  image: Cell
}

// Empty is not an error — it means the page inherits the site default.
// Only an over-limit value gets flagged, because that one gets truncated.
function cell(value: string | undefined, limit?: number): Cell {
  const text = (value ?? '').trim()
  if (!text) return { status: 'default', label: 'Default' }
  if (limit && text.length > limit) {
    return { status: 'warning', label: 'Too long', detail: `${text.length} characters` }
  }
  return { status: 'set', label: 'Set', detail: text }
}

function Status({ cell }: { cell: Cell }) {
  return (
    <span className={`${s.status} ${s[cell.status]}`} title={cell.detail}>
      {cell.label}
    </span>
  )
}

export default async function SeoHealthPage() {
  await requireRole('editor')

  const [content, posts] = await Promise.all([
    getSiteContent(),
    listBlogPosts().catch(() => []),
  ])

  const seoFor = (key: string) =>
    ((content as any)?.[key]?.seo ?? {}) as Record<string, string>

  const rows: Row[] = PAGES.map(({ key, label }) => {
    const seo = seoFor(key)
    return {
      key,
      label,
      href: `/admin/content?page=${key}`,
      title: cell(seo.metaTitle, TITLE_LIMIT),
      description: cell(seo.metaDescription, DESC_LIMIT),
      image: cell(seo.ogImageUrl),
    }
  })

  const needsWork = posts.filter((p) => !p.meta_title || !p.meta_description)
  const blogSeo = seoFor('blog')

  rows.push({
    key: 'blog',
    label: 'Blog',
    href: '/admin/content?page=blog',
    note: posts.length
      ? `${needsWork.length} of ${posts.length} posts need metadata`
      : 'No posts yet',
    title: cell(blogSeo.metaTitle, TITLE_LIMIT),
    description: cell(blogSeo.metaDescription, DESC_LIMIT),
    image: cell(blogSeo.ogImageUrl),
  })

  // Only posts needing attention are listed. This list shrinks as you fix them.
  for (const post of needsWork) {
    rows.push({
      key: `post-${post.id}`,
      label: post.title ?? post.slug,
      href: `/admin/blog/${post.id}`,
      nested: true,
      title: cell(post.meta_title ?? undefined, TITLE_LIMIT),
      description: cell(post.meta_description ?? undefined, DESC_LIMIT),
      image: cell(undefined),
    })
  }

  const pageRows = rows.filter((r) => !r.nested)
  const total = pageRows.length
  const setCount = (field: 'title' | 'description' | 'image') =>
    pageRows.filter((r) => r[field].status === 'set').length

  const metrics: [string, number][] = [
    ['Search titles', setCount('title')],
    ['Descriptions', setCount('description')],
    ['Share images', setCount('image')],
  ]

  return (
    <div className={s.page}>
      <header className={s.header}>
        <h1 className={s.title}>SEO health</h1>
        <p className={s.subtitle}>
          Pages without custom metadata fall back to site defaults. That&rsquo;s
          fine &mdash; this is just what&rsquo;s set.
        </p>
      </header>

      <div className={s.metrics}>
        {metrics.map(([label, value]) => (
          <div key={label} className={s.metric}>
            <span className={s.metricLabel}>{label}</span>
            <span className={s.metricValue}>
              {value}
              <span className={s.metricTotal}>of {total}</span>
            </span>
          </div>
        ))}
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.pageCol}>Page</th>
              <th>Title</th>
              <th>Description</th>
              <th>Image</th>
              <th className={s.actionCol} />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className={row.nested ? `${s.row} ${s.nested}` : s.row}>
                <td className={s.pageCell}>
                  <span className={s.pageLabel}>{row.label}</span>
                  {row.note ? <span className={s.pageHint}>{row.note}</span> : null}
                </td>
                <td><Status cell={row.title} /></td>
                <td><Status cell={row.description} /></td>
                <td><Status cell={row.image} /></td>
                <td className={s.actionCell}>
                  <Link href={row.href} className={s.edit}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}