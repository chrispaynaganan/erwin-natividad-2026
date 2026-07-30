'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IconCircleCheck, IconAlertTriangle, IconInfoCircle, IconX } from '@tabler/icons-react'
import styles from './toast-provider.module.css'

export type ToastTone = 'success' | 'error' | 'info'

type Toast = {
  id: number
  tone: ToastTone
  message: string
  duration: number
}

type ToastContextValue = {
  success: (message: string, durationMs?: number) => void
  error: (message: string, durationMs?: number) => void
  info: (message: string, durationMs?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DEFAULT_DURATION: Record<ToastTone, number> = {
  success: 4000,
  info: 4000,
  error: 6000, // errors get a bit longer, since there's usually more to read
}

const ICONS: Record<ToastTone, typeof IconCircleCheck> = {
  success: IconCircleCheck,
  error: IconAlertTriangle,
  info: IconInfoCircle,
}

let nextId = 1

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((tone: ToastTone, message: string, durationMs?: number) => {
    const id = nextId++
    const duration = durationMs ?? DEFAULT_DURATION[tone]
    setToasts((prev) => [...prev, { id, tone, message, duration }])
  }, [])

  const value: ToastContextValue = {
    success: (message, durationMs) => push('success', message, durationMs),
    error: (message, durationMs) => push('error', message, durationMs),
    info: (message, durationMs) => push('info', message, durationMs),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport} aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const remainingRef = useRef(toast.duration)
  const startRef = useRef<number>(Date.now())

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const arm = useCallback((ms: number) => {
    clear()
    startRef.current = Date.now()
    timerRef.current = setTimeout(onDismiss, ms)
  }, [onDismiss])

  useEffect(() => {
    arm(remainingRef.current)
    return clear
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pause() {
    clear()
    remainingRef.current -= Date.now() - startRef.current
    setPaused(true)
  }

  function resume() {
    arm(Math.max(remainingRef.current, 300))
    setPaused(false)
  }

  const Icon = ICONS[toast.tone]

  return (
    <div
      className={`${styles.toast} ${styles[toast.tone]}`}
      role={toast.tone === 'error' ? 'alert' : 'status'}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <span className={styles.icon}><Icon size={18} stroke={1.9} /></span>
      <span className={styles.message}>{toast.message}</span>
      <button type="button" className={styles.close} aria-label="Dismiss" onClick={onDismiss}>
        <IconX size={15} stroke={1.9} />
      </button>
      <span
        className={styles.bar}
        style={{ animationDuration: `${toast.duration}ms`, animationPlayState: paused ? 'paused' : 'running' }}
      />
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast() must be used inside <ToastProvider>')
  return ctx
}