// src/app/admin/subscribers/actions.ts
'use server'

import { requireRole } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { updateSubscriberStatus, deleteSubscriber, type SubscriberStatus } from '@/lib/subscribers-db/store'

export async function setSubscriberStatus(id: string, status: SubscriberStatus) {
  try {
    await requireRole('editor')
    await updateSubscriberStatus(id, status)
    revalidatePath('/admin/subscribers')
    return { ok: true as const }
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : 'Failed to update.' }
  }
}

export async function removeSubscriber(id: string) {
  try {
    await requireRole('editor')
    await deleteSubscriber(id)
    revalidatePath('/admin/subscribers')
    return { ok: true as const }
  } catch (err) {
    return { ok: false as const, error: err instanceof Error ? err.message : 'Failed to delete.' }
  }
}