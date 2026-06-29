import Link from 'next/link'

const cols = [
  { title: 'Navigation', links: [['Home','/'],['Services','/services'],['Projects','/work'],['About','/about'],['Contact','/contact']] },
  { title: 'Quick Links', links: [['Privacy Policy','/privacy'],['Terms and Conditions','/terms'],['Blogs','/blog'],['FAQs','/contact']] },
]

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', marginTop: 96 }}>
      <div className="container" style={{ padding: '56px 24px 32px', display: 'grid', gap: 40, gridTemplateColumns: '1fr' }}>
        <div style={{ display: 'grid', gap: 40, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div style={{ maxWidth: 320 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <img src="/logo-light.png" alt="Erwin Natividad" className="themeLogo logoLight" style={{ height: 44 }} />
              <img src="/logo-dark.png" alt="" aria-hidden="true" className="themeLogo logoDark" style={{ height: 44 }} />
            </span>
            <p style={{ color: 'var(--text-muted)', marginTop: 16, fontSize: '0.92rem' }}>
              Experienced voice over artist and dedicated coach committed to delivering exceptional, high-quality, and professional results that truly elevate your projects and captivate your audience.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: 14 }}>{c.title}</h4>
              <ul style={{ listStyle: 'none', display: 'grid', gap: 10 }}>
                {c.links.map(([label, href]) => (
                  <li key={label}><Link href={href} style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: 14 }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 10, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              <li>erwin@voiceover.com</li>
              <li>+1 (234) 567-890</li>
              <li>Available Worldwide</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          © {year} Erwin Natividad. All rights reserved.
        </div>
      </div>
    </footer>
  )
}