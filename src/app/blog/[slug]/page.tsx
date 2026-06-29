export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <main className="container" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: 'var(--text-h1)' }}>{slug}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>Article body renders here.</p>
    </main>
  )
}
