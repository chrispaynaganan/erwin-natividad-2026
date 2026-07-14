import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPosts, getPost } from '@/lib/blog'
import { IconArrowLeft } from '@tabler/icons-react'
import s from './post.module.css'

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getPost(slug)
  if (!p) return { title: 'Post' }
  return {
    title: p.metaTitle || p.title,
    description: p.metaDescription || p.excerpt,
    openGraph: {
      title: p.metaTitle || p.title,
      description: p.metaDescription || p.excerpt,
      ...(p.coverUrl ? { images: [{ url: p.coverUrl, width: 1200, height: 630 }] } : {}),
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getPost(slug)
  if (!p) notFound()

  return (
    <main className={`${s.wrap} container`}>
      <nav className={s.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/blog">Blog</Link><span>/</span>
        <span style={{ color: 'var(--accent-soft)' }}>{p.title}</span>
      </nav>

      <span className={s.cat}>{p.category}</span>
      <h1 className={s.title}>{p.title}</h1>
      <div className={s.meta}><span>{p.date}</span><span>&middot;</span><span>{p.readMinutes} min read</span></div>

      <article className={s.body}>
        {p.body.map((para, i) => <p key={i}>{para}</p>)}
      </article>

      <Link href="/blog" className={`btn btnOutline ${s.back}`}><IconArrowLeft size={17} stroke={1.75} /> Back to all posts</Link>
    </main>
  )
}