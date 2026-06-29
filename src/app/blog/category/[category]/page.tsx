export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  return (
    <main className="container" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: 'var(--text-h1)' }}>Category: {category}</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>Filtered post list.</p>
    </main>
  )
}
