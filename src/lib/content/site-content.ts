// =====================================================================
// SITE CONTENT MODEL
// Single source of truth for editable homepage + navigation content.
// Public pages read this (via store.ts, which overlays saved edits from
// Supabase); the admin Content editor writes it back. Branding/colors are
// intentionally NOT here — those stay in globals.css for now.
// =====================================================================

export type LinkItem = { label: string; href: string }
export type ServiceItem = { title: string; body: string; primary: LinkItem; secondary: LinkItem }
export type WorkItem = { tags: string[]; title: string; body: string; date: string }
export type Testimonial = { text: string; name: string; role: string }
export type LogoItem = { name: string; imageUrl: string }

export type SiteContent = {
  nav: {
    logoLight: string   // image shown on light backgrounds
    logoDark: string    // image shown on dark backgrounds
    ctaLabel: string    // header "Work With Me" button text
    ctaHref: string
  }
  home: {
    hero: {
      name1: string
      name2: string     // gold portion of the name
      tags: string[]
      eyebrow: string
      body: string
      featuredLabel: string
      featuredTitle: string
      ctaPrimary: LinkItem
      ctaSecondary: LinkItem
    }
    logos: { label: string; items: LogoItem[] }
    whatIDo: { title: string; titleGold: string; sub: string; items: ServiceItem[] }
    featuredWork: { title: string; titleGold: string; sub: string; viewAll: LinkItem; items: WorkItem[] }
    meet: { title: string; titleGold: string; quote: string; body: string[]; cta: LinkItem }
    testimonials: { title: string; titleGold: string; sub: string; items: Testimonial[] }
    cta: { title: string; titleGold: string; sub: string; emailPlaceholder: string; button: LinkItem }
  }
}

export const defaultSiteContent: SiteContent = {
  nav: {
    logoLight: '/logo-light.png',
    logoDark: '/logo-dark.png',
    ctaLabel: 'Work With Me',
    ctaHref: '/work-with-me',
  },
  home: {
    hero: {
      name1: 'Erwin',
      name2: 'Natividad',
      tags: ['Voiceover Artist', 'Voice Coach', 'Loving Father'],
      eyebrow: 'The Voice Behind the Story',
      body: 'Hi, I\u2019m a passionate voice over artist and coach who loves helping scripts come alive. With years of experience, I\u2019ve had the joy of working closely with top brands, inspiring storytellers, and up-and-coming voice talents from all over the world. I\u2019m dedicated to bringing out the unique personality in every project and guiding others to find their own authentic voice.',
      featuredLabel: 'Featured',
      featuredTitle: 'Grandma\u2019s Bedtime Stories',
      ctaPrimary: { label: 'Work With Me', href: '/work-with-me' },
      ctaSecondary: { label: 'Hear My Demos', href: '/work' },
    },
    logos: {
      label: 'Worked with 10+ Companies',
      items: [
        { name: 'Company One', imageUrl: '' },
        { name: 'Company Two', imageUrl: '' },
        { name: 'Company Three', imageUrl: '' },
        { name: 'Company Four', imageUrl: '' },
        { name: 'Company Five', imageUrl: '' },
        { name: 'Company Six', imageUrl: '' },
        { name: 'Company Seven', imageUrl: '' },
      ],
    },
    whatIDo: {
      title: 'What I',
      titleGold: 'Do',
      sub: 'From commercial voice overs to personalized coaching, I offer comprehensive voice services tailored to your needs.',
      items: [
        { title: 'Voiceovers', body: 'Professional voice over services for commercials, narration, eLearning, audiobooks, video games, and more. Versatile delivery across all genres and styles.', primary: { label: 'Avail My Service', href: '/work-with-me' }, secondary: { label: 'Learn More', href: '/services' } },
        { title: 'Voice Coaching', body: 'Personalized one-on-one training to help you develop and refine your voice. From beginners to professionals looking to expand their range.', primary: { label: 'Book an Appointment', href: '/work-with-me' }, secondary: { label: 'Learn More', href: '/services' } },
        { title: 'Demo Production', body: 'Professional demo reel production to showcase your talent. Expert guidance on script selection, performance, and editing for maximum impact.', primary: { label: 'View Projects', href: '/work' }, secondary: { label: 'Learn More', href: '/services' } },
      ],
    },
    featuredWork: {
      title: 'Featured',
      titleGold: 'Work',
      sub: 'Explore some of my recent voice over projects across various industries and styles.',
      viewAll: { label: 'View All Demos', href: '/work' },
      items: [
        { tags: ['Commercial', 'Upbeat', 'Advertising'], title: 'Energetic Commercial Demo Reel', body: 'High-energy commercial voice over showcasing versatility in product advertising and promotiona...', date: 'March 2026' },
        { tags: ['Narration', 'Documentary', 'Informative'], title: 'Documentary Narration - Environmental Series', body: 'Calm, authoritative narration for a 6-part environmental documentary series.', date: 'March 2026' },
        { tags: ['eLearning', 'Corporate', 'Training'], title: 'Corporate Training Module', body: 'Professional, clear voice over for employee onboarding and compliance training modules.', date: 'March 2026' },
      ],
    },
    meet: {
      title: 'Meet',
      titleGold: 'Erwin',
      quote: 'What sets me apart is not just technical skill, but a genuine commitment to understanding your vision and delivering performances that exceed expectations.',
      body: [
        'With many years of experience in the voice over industry, I\u2019ve had the privilege of working with global brands, independent creators, and aspiring voice artists from around the world. My passion lies in bringing stories to life through voice and helping others discover and refine their unique vocal identity.',
        'Whether it\u2019s a high-energy commercial or an intimate audiobook narration, I approach every project with professionalism and creativity.',
      ],
      cta: { label: 'More About Erwin', href: '/about' },
    },
    testimonials: {
      title: 'What People',
      titleGold: 'Say',
      sub: 'Don\u2019t just take my word for it \u2014 hear from clients and students who\u2019ve experienced the difference.',
      items: [
        { text: 'Erwin\u2019s voice brought our brand campaign to life in ways we never imagined. His professionalism and ability to nail the perfect tone on the first take saved us time and delivered exceptional results.', name: 'Sarah Mitchell', role: 'Marketing Director, TechVision Inc.' },
        { text: 'As a voice coaching student, I can\u2019t recommend Erwin enough. He helped me discover my authentic voice and gave me the confidence to pursue professional work. Three months later, I landed my first commercial gig!', name: 'Michael Chen', role: 'Voice Coaching Student' },
        { text: 'Working with Erwin on our audiobook series was a dream. His range of character voices and emotional depth brought our story to life. Listeners consistently praise the narration quality.', name: 'Jessica Torres', role: 'Author & Publisher' },
      ],
    },
    cta: {
      title: 'Ready to Find',
      titleGold: 'Your Voice?',
      sub: 'Let\u2019s work together to bring your project to life or unlock your full vocal potential.',
      emailPlaceholder: 'Email Address',
      button: { label: 'Get in Touch', href: '/contact' },
    },
  },
}