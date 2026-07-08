import Link from 'next/link'
import { listShowsFull } from '@/lib/shows/store'
import { ShowList } from './show-list'

export const metadata = { title: 'Shows' }

export default async function ShowsPage() {
  const shows = await listShowsFull()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-h2)' }}>Shows</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Manage shows. Episodes belong to a show.</p>
        </div>
        <Link href="/admin/shows/new" className="btn btnSolid">New show</Link>
      </div>

      <ShowList shows={shows} />
    </div>
  )
}