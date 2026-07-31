'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type SidebarState = { open: boolean; toggle: () => void; close: () => void }

const SidebarContext = createContext<SidebarState | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Auto-close the drawer whenever navigation happens — otherwise tapping
  // a nav link on mobile would leave the drawer covering the new page.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock background scroll while the drawer is open, so the page behind
  // it doesn't scroll along with the drawer's own content on touch.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <SidebarContext.Provider value={{ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within <SidebarProvider>')
  return ctx
}