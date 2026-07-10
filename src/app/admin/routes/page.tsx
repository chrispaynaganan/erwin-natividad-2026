// Drop in as src/app/admin/routes/page.tsx
// ASSUMPTION: reusing the public client is fine here since page_routes has a public
// read policy (0010_page_routes.sql). Swap for createAdminClient() if your admin
// pages conventionally always use the service-role client instead.

import { createPublicClient } from '@/lib/supabase/public'
import { RoutesForm } from './routes-form'

export const dynamic = 'force-dynamic'

export default async function RoutesAdminPage() {
  const supabase = createPublicClient()
  const { data } = await supabase.from('page_routes').select('*').order('label')

  return (
    <div style={{ maxWidth: 640 }}>
      <h1>Page URLs</h1>
      <p>
        Rename the public URL for any page below. Buttons and links across the site
        that point to it will resolve to the new URL automatically.
      </p>
      <RoutesForm routes={data ?? []} />
    </div>
  )
}