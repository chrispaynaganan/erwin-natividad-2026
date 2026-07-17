import Link from 'next/link'
import { CtaSection } from '@/components/cta-section'
import { getShows } from '@/lib/shows'
import s from './podcasts.module.css'

export const metadata = { title: 'Podcasts' }

export default async function PodcastsPage() {
  const shows = await getShows()

  return (
    <main>
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>My<span className={s.heroTitleGold}>Podcasts</span></h1>
        <p className={s.heroBody}>
          Shows I host and voice, covering everything from storytelling to interviews. Pick a show and dive into the episodes.
        </p>
      </section>

      <section className="container" style={{ paddingBottom: 64 }}>
        {shows.length === 0 ? (
          <p className={s.empty}>No shows published yet.</p>
        ) : (
          <div className={s.showGrid}>
            {shows.map((show) => (
              <Link key={show.id} href={`/podcasts/${show.slug}`} className={s.showCard}>
                <div className={s.showArt}>{show.coverUrl ? <img src={show.coverUrl} alt="" /> : <div className={s.showArtFallback} />}</div>
                <h3 className={s.showTitle}>{show.title}</h3>
                {show.description && <p className={s.showDesc}>{show.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </section>

      <CtaSection />
    </main>
  )
}