export const metadata = { title: 'About' }
export default function Page() {
  return (
    <main className="container" style={{ padding: '4rem 1.5rem' }}>
      <h1 style={{ fontSize: 'var(--text-h1)' }}>About</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
        Scaffold route — approved Figma design drops in here.
      </p>
    </main>
  )
}
