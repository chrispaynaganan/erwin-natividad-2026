'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { deleteBlogPost } from './actions'
import type { BlogPostRow } from '@/lib/blog-db/store'
import s from './blog.module.css'

export function BlogList({ posts }: { posts: BlogPostRow[] }) {
  return (
    <div className={s.wrap}>
      <header className={s.head}>
        <div>
          <h1 className={s.h1}>Blog</h1>
          <p className={s.sub}>{posts.length} post{posts.length === 1 ? '' : 's'}</p>
        </div>
        <Link href="/admin/blog/new" className="btn btnSolid">+ New Post</Link>
      </header>

      {posts.length === 0 ? (
        <p className={s.empty}>No blog posts yet — create your first one above.</p>
      ) : (
        <div className={s.list}>
          {posts.map((post) => <Row key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}

function Row({ post }: { post: BlogPostRow }) {
  const [pending, start] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function onDelete() {
    if (!confirming) {
      setConfirming(true)
      return
    }
    start(async () => { await deleteBlogPost(post.id) })
  }

  const badgeClass = post.status === 'published' ? `${s.badge} ${s.badge_published}` : s.badge

  return (
    <div className={s.row}>
      <div className={s.rowMain}>
        <span className={badgeClass}>{post.status}</span>
        <div>
          <Link href={`/admin/blog/${post.id}`} className={s.rowTitle}>{post.title || '(untitled)'}</Link>
          <div className={s.rowMeta}>
            /blog/{post.slug}
            {post.published_at ? ` \u00b7 ${new Date(post.published_at).toLocaleDateString()}` : ''}
          </div>
        </div>
      </div>
      <div className={s.rowActions}>
        <Link href={`/admin/blog/${post.id}`} className="btn btnOutline">Edit</Link>
        <button type="button" className="btn btnOutline" onClick={onDelete} disabled={pending}>
          {pending ? 'Deleting\u2026' : confirming ? 'Confirm delete?' : 'Delete'}
        </button>
      </div>
    </div>
  )
}