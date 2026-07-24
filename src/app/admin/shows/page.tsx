import Link from 'next/link'
import { listShowsFull } from '@/lib/shows/store'
import { listEpisodes } from '@/lib/episodes/store'
import { ShowList } from './show-list'
import s from './podcasts.module.css'

export const metadata = { title: 'Podcasts' }
export const dynamic = 'force-dynamic'

export default async function ShowsPage() {
  const [shows, episodes] = await Promise.all([listShowsFull(), listEpisodes()])

  const episodesByShow: Record<string, typeof episodes> = {}
  for (const ep of episodes) {
    ;(episodesByShow[ep.show_id] ??= []).push(ep)
  }

  return (
    <div>
      <header className={s.header}>
        <div>
          <h1 className={s.h1}>Podcasts</h1>
          <p className={s.sub}>Shows and their episodes. Expand a show to see everything inside it.</p>
        </div>
        <Link href="/admin/shows/new" className="btn btnSolid">New show</Link>
      </header>

      <ShowList shows={shows} episodesByShow={episodesByShow} />
    </div>
  )
}