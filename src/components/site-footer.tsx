import Link from 'next/link'
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandYoutube, IconBrandTwitter } from '@tabler/icons-react'

const nav = [['Home', '/'], ['Services', '/services'], ['Projects', '/work'], ['About', '/about'], ['Contact', '/contact']]
const quick = [['Privacy Policy', '/privacy'], ['Terms and Conditions', '/terms'], ['Blogs', '/blog'], ['FAQs', '/contact']]

const socials = [
  { label: 'Facebook', href: '#', Icon: IconBrandFacebook },
  { label: 'Instagram', href: '#', Icon: IconBrandInstagram },
  { label: 'LinkedIn', href: '#', Icon: IconBrandLinkedin },
  { label: 'YouTube', href: '#', Icon: IconBrandYoutube },
  { label: 'Twitter', href: '#', Icon: IconBrandTwitter },
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
                  <s.Icon size={18} stroke={1.75} aria-hidden="true" />
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