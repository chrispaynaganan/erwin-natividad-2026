import { getSiteContent } from '@/lib/content/store'
import { ContentEditor, type PageKey } from './content-editor'

export const metadata = { title: 'Content' }

const KEYS: PageKey[] = ['home', 'services', 'about', 'contact', 'faq', 'blog', 'nav']

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const [content, { page }] = await Promise.all([getSiteContent(), searchParams])
  const initialPage = KEYS.includes(page as PageKey) ? (page as PageKey) : 'home'
  return <ContentEditor initial={content} initialPage={initialPage} />
}