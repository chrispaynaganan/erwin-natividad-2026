'use client'
import { useEffect, useRef, useState } from 'react'

// Reveals children with a fade + drift when scrolled into view. Reduced-motion
// users get the content immediately (CSS handles the override).
export function Reveal({
  children,
  delay = 0,
}: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal ${visible ? 'in-view' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}