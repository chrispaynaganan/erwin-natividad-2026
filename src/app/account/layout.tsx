import { requireRole } from '@/lib/auth'

export const metadata = { robots: { index: false, follow: false } }

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireRole('member') // any signed-in user
  return <div className="container" style={{ padding: '3rem 1.5rem' }}>{children}</div>
}
