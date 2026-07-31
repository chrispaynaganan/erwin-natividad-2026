'use client'
import { Menu, X } from 'lucide-react'
import { useSidebar } from './admin-sidebar-context'
import s from './sidebar-toggle-button.module.css'

export function SidebarToggleButton() {
  const { open, toggle } = useSidebar()
  return (
    <button
      type="button"
      className={s.toggle}
      onClick={toggle}
      aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={open}
    >
      {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
    </button>
  )
}