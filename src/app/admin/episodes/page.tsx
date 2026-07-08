import Link from 'next/link'
import { listEpisodes, listShows } from '@/lib/episodes/store'
import { EpisodeList } from './episode-list'

export const metadata = { title: 'Episodes' }

export default async function EpisodesPage() {
  const [episodes, shows] = await Promise.all([listEpisodes(), listShows()])
  const showsById = Object.fromEntries(shows.map((s) => [s.id, s.title]))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-h2)' }}>Episodes</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Manage episodes.</p>
        </div>
        <Link href="/admin/episodes/new" className="btn btnSolid">New episode</Link>
      </div>

      {shows.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}>
          {'No shows exist yet \u2014 create a show first (Admin \u2192 Shows) before adding episodes.'}
        </p>
      )}

      <EpisodeList episodes={episodes} showsById={showsById} />
    </div>
  )
}