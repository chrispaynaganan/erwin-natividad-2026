import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { CtaSection } from '@/components/cta-section'
import { posts } from '@/lib/blog'
import { getSiteContent } from '@/lib/content/store'
import s from './blog.module.css'

export const metadata = { title: 'Blog' }
export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const { blog } = await getSiteContent()

  return (
    <main>
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>{blog.hero.title} <span className={s.heroTitleGold}>{blog.hero.titleGold}</span></h1>
        <p className={s.heroBody}>{blog.hero.body}</p>
      </section>

      <section className="container">
        <div className={s.grid}>
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 60}>
              <Link href={`/blog/${p.slug}`} className={s.card}>
                <span className={s.cat}>{p.category}</span>
                <h2 className={s.cardTitle}>{p.title}</h2>
                <p className={s.excerpt}>{p.excerpt}</p>
                <div className={s.meta}><span>{p.date}</span><span>&middot;</span><span>{p.readMinutes} min read</span></div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection />
    </main>
  )
}