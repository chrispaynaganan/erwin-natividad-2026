export default async function Page({ params }: { params: Promise<{ show: string }> }) {
  const { show } = await params
  return (
    <main className="container" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: 'var(--text-h1)' }}>Show: {show}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>Episode list for this show.</p>
    </main>
  )
}
