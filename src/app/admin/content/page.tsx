import { getSiteContent } from '@/lib/content/store'
import { ContentEditor } from './content-editor'

export const metadata = { title: 'Content' }

export default async function AdminContentPage() {
  const content = await getSiteContent()
  return <ContentEditor initial={content} />
}