export default async function Page({ params }: { params: Promise<{ show: string; episode: string }> }) {
  const { show, episode } = await params
  return (
    <main className="container" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: 'var(--text-h1)' }}>{episode}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
        Show: {show}. Full player + show notes here. Premium audio is fetched via /api/audio/[episodeId].
      </p>
    </main>
  )
}
