'use client'
import { usePathname } from 'next/navigation'

// Keys on the route so each admin page fades/slides in on navigation —
// one quiet, consistent transition rather than a jump cut between pages.
export function AdminMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <main key={pathname} className="adminPageIn" style={{ flex: 1, padding: '2rem' }}>
      {children}
      <style>{`
        .adminPageIn {
          animation: adminPageIn 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes adminPageIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .adminPageIn { animation: none; }
        }
      `}</style>
    </main>
  )
}