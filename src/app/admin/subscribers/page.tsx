// src/app/admin/subscribers/page.tsx
import { listSubscribers } from '@/lib/subscribers-db/store'
import { SubscribersList } from './subscribers-list'

export const metadata = { title: 'Subscribers' }

export default async function SubscribersPage() {
  const subscribers = await listSubscribers()
  return (<div><h1>Subscribers</h1><SubscribersList subscribers={subscribers} /></div>)
}