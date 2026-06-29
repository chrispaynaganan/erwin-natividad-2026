import type { MetadataRoute } from 'next'

// Static public routes. Episodes/blog posts get appended from the DB later.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const routes = ['', '/about', '/services', '/work', '/podcast', '/blog', '/book', '/contact', '/pricing', '/privacy', '/terms']
  return routes.map((r) => ({ url: `${base}${r}`, lastModified: new Date() }))
}
