'use client'

import { ImageField } from '@/components/admin/image-field'
import type { SeoMeta } from '@/lib/content/site-content'
import s from './content.module.css'

const TITLE_LIMIT = 60
const DESC_LIMIT = 160

function counterColor(len: number, limit: number): string {
  if (len === 0) return 'var(--text-muted, #6B6862)'
  if (len > limit) return 'var(--error, #B3261E)'
  if (len > limit - 10) return '#B8860B'
  return 'var(--text-muted, #6B6862)'
}

export function SeoEditor({
  value, onChange, pageUrl, fallbackTitle, fallbackDescription, folder,
}: {
  value: SeoMeta
  onChange: (next: SeoMeta) => void
  pageUrl: string
  fallbackTitle: string
  fallbackDescription: string
  folder: string
}) {
  const title = value.metaTitle || fallbackTitle
  const description = value.metaDescription || fallbackDescription
  const domain = (() => { try { return new URL(pageUrl).hostname } catch { return pageUrl } })()

  return (
    <section className={s.card}>
      <h2 className={s.cardTitle}>Search &amp; Social</h2>
      <p className={s.hint}>
        Controls what shows up when this page appears in Google, or gets shared as a link on iMessage, Slack,
        Facebook, or LinkedIn. Leave a field blank to fall back to the page&rsquo;s own title/description.
      </p>

      <label className={s.field}>
        <span className={s.label}>
          Search Title{' '}
          <span style={{ float: 'right', fontWeight: 400, color: counterColor(value.metaTitle.length, TITLE_LIMIT) }}>
            {value.metaTitle.length}/{TITLE_LIMIT}
          </span>
        </span>
        <input className={s.input} value={value.metaTitle} placeholder={fallbackTitle}
          onChange={(e) => onChange({ ...value, metaTitle: e.target.value })} />
        {value.metaTitle.length > TITLE_LIMIT && (
          <span style={{ fontSize: 12, color: 'var(--error, #B3261E)' }}>This will get cut off in search results.</span>
        )}
      </label>

      <label className={s.field}>
        <span className={s.label}>
          Search Description{' '}
          <span style={{ float: 'right', fontWeight: 400, color: counterColor(value.metaDescription.length, DESC_LIMIT) }}>
            {value.metaDescription.length}/{DESC_LIMIT}
          </span>
        </span>
        <textarea className={s.input} rows={3} value={value.metaDescription} placeholder={fallbackDescription}
          onChange={(e) => onChange({ ...value, metaDescription: e.target.value })} />
        {value.metaDescription.length > DESC_LIMIT && (
          <span style={{ fontSize: 12, color: 'var(--error, #B3261E)' }}>This will get cut off in search results.</span>
        )}
      </label>

      <ImageField label="Social Share Image" folder={folder} value={value.ogImageUrl}
        onChange={(v) => onChange({ ...value, ogImageUrl: v })} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
        <div>
          <p className={s.label} style={{ marginBottom: 8 }}>Google search preview</p>
          <div style={{ border: '1px solid var(--border, #E7E5E0)', borderRadius: 8, padding: 16, fontFamily: 'arial, sans-serif' }}>
            <div style={{ color: '#1a0dab', fontSize: 18, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title.slice(0, TITLE_LIMIT + 10)}
            </div>
            <div style={{ color: '#006621', fontSize: 13 }}>{domain}</div>
            <div style={{ color: '#545454', fontSize: 13, marginTop: 4 }}>{description.slice(0, DESC_LIMIT + 20)}</div>
          </div>
        </div>
        <div>
          <p className={s.label} style={{ marginBottom: 8 }}>Social share preview</p>
          <div style={{ border: '1px solid var(--border, #E7E5E0)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{
              aspectRatio: '1200/630',
              background: value.ogImageUrl ? `url(${value.ogImageUrl}) center/cover` : 'var(--surface, #F5F3EF)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted, #6B6862)', fontSize: 13,
            }}>
              {!value.ogImageUrl && 'No image set'}
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted, #6B6862)', textTransform: 'uppercase' }}>{domain}</div>
              <div style={{ fontWeight: 600, fontSize: 14, marginTop: 2 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted, #6B6862)', marginTop: 2 }}>{description}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 12, border: '1px dashed var(--border, #E7E5E0)', borderRadius: 8, fontSize: 13 }}>
        <strong>Changes here go live on your site instantly.</strong> Google and social platforms cache their own
        copy, though — use these if you want a specific platform to refresh sooner after you save:
        <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
          <li><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer">Google Search Console</a> — request re-indexing for this URL</li>
          <li><a href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noreferrer">Facebook Sharing Debugger</a></li>
          <li><a href={`https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(pageUrl)}`} target="_blank" rel="noreferrer">LinkedIn Post Inspector</a></li>
        </ul>
      </div>
    </section>
  )
}