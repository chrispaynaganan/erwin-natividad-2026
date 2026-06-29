import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { CtaSection } from '@/components/cta-section'
import { posts } from '@/lib/blog'
import s from './blog.module.css'

export const metadata = { title: 'Blog' }

export default function BlogPage() {
  return (
    <main>
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>The <span className={s.heroTitleGold}>Journal</span></h1>
        <p className={s.heroBody}>Thoughts on voice, craft, and the business of bringing scripts to life \u2014 plus practical tips for clients and aspiring voice artists.</p>
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