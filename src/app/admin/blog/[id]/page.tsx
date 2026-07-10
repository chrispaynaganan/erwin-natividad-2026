import { notFound } from 'next/navigation'
import { requireRole } from '@/lib/auth'
import { getBlogPostById } from '@/lib/blog-db/store'
import { BlogPostForm } from './blog-post-form'

export const dynamic = 'force-dynamic'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('editor')
  const { id } = await params

  if (id === 'new') return <BlogPostForm post={null} />

  const post = await getBlogPostById(id)
  if (!post) notFound()

  return <BlogPostForm post={post} />
}