import { getSiteContent } from '@/lib/content/store'
import { listBlogPosts } from '@/lib/blog-db/store'

export const metadata = { title: 'SEO Health' }
export const dynamic = 'force-dynamic'

export default async function SeoHealthPage() {
  const content = await getSiteContent()
  const posts = await listBlogPosts()

  const pageRows = (['home', 'services', 'about', 'contact', 'faq'] as const).map((key) => ({
    label: key[0].toUpperCase() + key.slice(1),
    hasTitle: !!content[key].seo.metaTitle,
    hasDescription: !!content[key].seo.metaDescription,
    hasImage: !!content[key].seo.ogImageUrl,
    editHref: `/admin/content?page=${key}`,
  }))

  const postRows = posts.map((p) => ({
    label: `Blog: ${p.title}`,
    hasTitle: !!p.meta_title,
    hasDescription: !!p.meta_description,
    hasImage: !!p.cover_url,
    editHref: `/admin/blog/${p.id}`,
  }))

  const rows = [...pageRows, ...postRows]

  return (
    <div>
      <h1>SEO Health</h1>
      <p>Which pages and posts have a search title, description, and share image set. A blank cell just falls back to the page&rsquo;s default — not urgent, just a punch list.</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead><tr><th style={{ textAlign: 'left' }}>Page</th><th>Title</th><th>Description</th><th>Image</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} style={{ borderTop: '1px solid var(--border, #E7E5E0)' }}>
              <td>{r.label}</td>
              <td style={{ textAlign: 'center' }}>{r.hasTitle ? '✅' : '⚠️'}</td>
              <td style={{ textAlign: 'center' }}>{r.hasDescription ? '✅' : '⚠️'}</td>
              <td style={{ textAlign: 'center' }}>{r.hasImage ? '✅' : '⚠️'}</td>
              <td><a href={r.editHref}>Edit</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}