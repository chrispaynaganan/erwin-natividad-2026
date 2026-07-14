// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const routes = ['', '/about', '/services', '/work', '/podcast', '/blog', '/book', '/contact', '/pricing', '/privacy', '/terms']
  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({ url: `${base}${r}`, lastModified: new Date() }))

  const posts = await getPosts()
  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(), // getPosts()'s `date` field is a display string ("March 2026"), not a real timestamp — using request-time as a stand-in until blog.ts exposes a raw ISO date
  }))

  return [...staticEntries, ...blogEntries]
}