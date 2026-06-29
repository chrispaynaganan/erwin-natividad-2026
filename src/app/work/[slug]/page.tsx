import Link from 'next/link'
import { notFound } from 'next/navigation'
import { projects, getProject, getAdjacent } from '@/lib/projects'
import { FullAudioPlayer } from '@/components/full-audio-player'
import s from './detail.module.css'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProject(slug)
  return { title: p ? p.title : 'Project' }
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getProject(slug)
  if (!p) notFound()
  const { prev, next } = getAdjacent(slug)

  const specs: [string, string | undefined][] = [
    ['Client', p.client], ['Completed', p.completed], ['Recording Studio', p.studio],
    ['Length', p.length], ['Age Range', p.ageRange], ['Character', p.character],
    ['Genre', p.genre], ['Deliverables', p.deliverables],
  ]

  return (
    <main className={`${s.wrap} container`}>
      <nav className={s.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/work">Projects</Link><span>/</span>
        <span className={s.crumbCurrent}>{p.title}</span>
      </nav>

      <div className={s.layout}>
        {/* Main */}
        <div>
          <div className={s.tags}>{p.tags.map((t) => <span key={t} className={s.tag}>{t}</span>)}</div>
          <h1 className={s.title}>{p.title}</h1>
          <p className={s.summary}>{p.desc}</p>
          <div className={s.metaRow}>
            <span>{'\u{1F4C5}'} {p.date}</span>
            {p.client && <span>{'\u{1F4BC}'} {p.client}</span>}
          </div>

          <h2 className={s.playerLabel}>Listen to my full demo</h2>
          <FullAudioPlayer durationLabel={p.duration} />

          <h2 className={s.detailsTitle}>Project Details</h2>
          <div className={s.body}>
            {(p.body ?? [p.desc]).map((para, i) => <p key={i}>{para}</p>)}
          </div>

          <div className={s.pagination}>
            {prev ? (
              <Link href={`/work/${prev.slug}`} className={s.pageCard}>
                <div className={s.pageKicker}>{'\u2039'} Previous Project</div>
                <div className={s.pageTitle}>{prev.title}</div>
              </Link>
            ) : <span />}
            {next && (
              <Link href={`/work/${next.slug}`} className={`${s.pageCard} ${s.pageNext}`}>
                <div className={s.pageKicker}>Next Project {'\u203A'}</div>
                <div className={s.pageTitle}>{next.title}</div>
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className={s.side}>
          <div className={s.sideCard}>
            {specs.filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className={s.specRow}>
                <div className={s.specLabel}>{label}</div>
                <div className={s.specValue}>{value}</div>
              </div>
            ))}
          </div>

          <div className={s.sideCard}>
            <div className={s.sideTitle}>Ready to Start your Project?</div>
            <p className={s.sideText}>Let&rsquo;s create something amazing together. Get in touch to discuss your voice over needs.</p>
            <div className={s.sideBtns}>
              <Link href="/contact" className="btn btnSolid">Book Now</Link>
              <Link href="/services" className="btn btnOutline">View Services &amp; Pricing</Link>
            </div>
          </div>

          <div className={s.sideCard}>
            <div className={s.sideTitle}>Explore More</div>
            <div className={s.explore}>
              <Link href="/work" className={s.exploreLink}>All Projects <span>{'\u2197'}</span></Link>
              <Link href="/about" className={s.exploreLink}>About Erwin <span>{'\u2197'}</span></Link>
              <Link href="/services" className={s.exploreLink}>Services Offered <span>{'\u2197'}</span></Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}