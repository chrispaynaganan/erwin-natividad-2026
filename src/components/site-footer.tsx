import Link from 'next/link'

const nav = [['Home', '/'], ['Services', '/services'], ['Projects', '/work'], ['About', '/about'], ['Contact', '/contact']]
const quick = [['Privacy Policy', '/privacy'], ['Terms and Conditions', '/terms'], ['Blogs', '/blog'], ['FAQs', '/contact']]

const socials: { label: string; href: string; icon: React.ReactNode }[] = [
  { label: 'Facebook', href: '#', icon: <path d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.6c0-.8.3-1.3 1.4-1.3h1.4V5.9c-.7-.1-1.5-.2-2.4-.2-2 0-3.4 1.2-3.4 3.5v2H8.2v2.7h2.3V21z" fill="currentColor" /> },
  { label: 'Instagram', href: '#', icon: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="16.7" cy="7.3" r="1.1" fill="currentColor" /></> },
  { label: 'LinkedIn', href: '#', icon: <path d="M6.94 8.5V19H3.5V8.5zM5.22 3.5a2 2 0 110 4 2 2 0 010-4zM20.5 19h-3.43v-5.3c0-1.4-.5-2.3-1.7-2.3-.93 0-1.48.63-1.72 1.23-.09.22-.11.52-.11.82V19H10.1c.05-9.06 0-10.5 0-10.5h3.43v1.5c.46-.7 1.27-1.7 3.1-1.7 2.26 0 3.96 1.48 3.96 4.66z" fill="currentColor" /> },
  { label: 'YouTube', href: '#', icon: <><rect x="2.5" y="6" width="19" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M10.2 9.3 15 12l-4.8 2.7z" fill="currentColor" /></> },
  { label: 'Twitter', href: '#', icon: <path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.3 1.7-2.2-.8.5-1.6.8-2.5 1a3.9 3.9 0 0 0-6.7 3.6A11 11 0 0 1 3 4.9a3.9 3.9 0 0 0 1.2 5.2c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.5 3.1 3.8-.6.2-1.2.2-1.8.1a3.9 3.9 0 0 0 3.6 2.7A7.8 7.8 0 0 1 2 18.1a11 11 0 0 0 6 1.8c7.1 0 11-5.9 11-11v-.5c.8-.6 1.4-1.3 1.9-2z" fill="currentColor" /> },
]

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="siteFooter">
      <div className="container">
        <div className="footerCard">
          <div className="footerTop">
            <div className="footerBrand">
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <img src="/logo-light.png" alt="Erwin Natividad" className="themeLogo logoLight" style={{ height: 44 }} />
                <img src="/logo-dark.png" alt="" aria-hidden="true" className="themeLogo logoDark" style={{ height: 44 }} />
              </span>
              <p className="footerDesc">
                Experienced voice over artist and dedicated coach committed to delivering exceptional,
                high-quality, and professional results that truly elevate your projects and captivate your audience.
              </p>
            </div>

            <div className="footerCol">
              <h4 className="footerHead">Navigation</h4>
              <ul className="footerList">
                {nav.map(([label, href]) => <li key={label}><Link href={href} className="footerLink">{label}</Link></li>)}
              </ul>
            </div>

            <div className="footerCol">
              <h4 className="footerHead">Quick Links</h4>
              <ul className="footerList">
                {quick.map(([label, href]) => <li key={label}><Link href={href} className="footerLink">{label}</Link></li>)}
              </ul>
            </div>

            <div className="footerCol">
              <h4 className="footerHead">Contact</h4>
              <ul className="footerList">
                <li><a href="mailto:erwin@voiceover.com" className="footerLink">erwin@voiceover.com</a></li>
                <li><a href="tel:+1234567890" className="footerLink">+1 (234) 567-890</a></li>
                <li><span className="footerLink" style={{ cursor: 'default' }}>Available Worldwide</span></li>
              </ul>
            </div>
          </div>

          <div className="footerBottom">
            <span className="footerCopy">© {year} Erwin Natividad. All rights reserved.</span>
            <div className="footerSocials">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} className="footerSocial">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .siteFooter { margin-top: 96px; }
        .siteFooter .container { padding-bottom: 28px; }
        .footerCard { background: var(--surface-2); border-radius: 24px; padding: clamp(28px, 4vw, 52px); }
        .footerTop { display: grid; grid-template-columns: 1fr; gap: 36px; }
        .footerBrand { max-width: 360px; }
        .footerDesc { color: var(--text-muted); margin-top: 18px; font-size: 0.95rem; line-height: 1.7; }
        .footerHead { font-size: 1.35rem; font-weight: 700; margin-bottom: 22px; }
        .footerList { list-style: none; display: grid; gap: 16px; }
        .footerLink { color: var(--text-muted); font-size: 1rem; transition: color 0.15s ease; }
        .footerLink:hover { color: var(--text); }
        .footerBottom { display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 20px; margin-top: 56px; }
        .footerCopy { color: var(--text-muted); font-size: 0.85rem; }
        .footerSocials { display: flex; gap: 12px; }
        .footerSocial { width: 44px; height: 44px; border-radius: 10px;
          border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
          color: var(--accent); display: inline-flex; align-items: center; justify-content: center;
          transition: background 0.15s ease, border-color 0.15s ease; }
        .footerSocial:hover { background: color-mix(in srgb, var(--accent) 12%, transparent);
          border-color: var(--accent); }
        @media (min-width: 600px) {
          .footerTop { grid-template-columns: repeat(3, 1fr); }
          .footerBrand { grid-column: 1 / -1; max-width: 420px; }
        }
        @media (min-width: 960px) {
          .footerTop { grid-template-columns: 1.6fr 1fr 1fr 1fr; align-items: start; }
          .footerBrand { grid-column: auto; }
        }
      `}</style>
    </footer>
  )
}