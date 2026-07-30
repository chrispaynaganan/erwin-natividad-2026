'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import styles from './confirm-dialog.module.css'

export type ConfirmOptions = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  /** 'default' = brand gold confirm button. 'danger' = red confirm button, for destructive actions. */
  tone?: 'default' | 'danger'
}

type PendingConfirm = ConfirmOptions & { resolve: (value: boolean) => void }

type ConfirmContextValue = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null)
  const confirmBtnRef = useRef<HTMLButtonElement>(null)

  const confirm = useCallback<ConfirmContextValue>((options) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve })
    })
  }, [])

  function settle(value: boolean) {
    pending?.resolve(value)
    setPending(null)
  }

  useEffect(() => {
    if (!pending) return
    confirmBtnRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') settle(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {pending && (
        <div className={styles.overlay} onClick={() => settle(false)}>
          <div
            className={styles.card}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-message"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="confirm-dialog-title" className={styles.title}>{pending.title}</h2>
            <p id="confirm-dialog-message" className={styles.message}>{pending.message}</p>
            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={() => settle(false)}>
                {pending.cancelLabel ?? 'Cancel'}
              </button>
              <button
                type="button"
                ref={confirmBtnRef}
                className={pending.tone === 'danger' ? styles.confirmBtnDanger : styles.confirmBtn}
                onClick={() => settle(true)}
              >
                {pending.confirmLabel ?? 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm() must be used inside <ConfirmDialogProvider>')
  return ctx
}