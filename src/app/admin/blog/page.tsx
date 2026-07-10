import { requireRole } from '@/lib/auth'
import { listBlogPosts } from '@/lib/blog-db/store'
import { BlogList } from './blog-list'

export const dynamic = 'force-dynamic'

export default async function BlogAdminPage() {
  await requireRole('editor')
  const posts = await listBlogPosts()
  return <BlogList posts={posts} />
}