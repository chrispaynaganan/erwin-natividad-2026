// =====================================================================
// SITE CONTENT MODEL
// Single source of truth for editable content across ALL public pages.
// Public pages read this (via store.ts, which overlays saved edits from
// Supabase); the admin Content editor writes it back. Saved blobs from
// older shapes stay valid — store.ts deep-merges over these defaults, so
// any field missing from the saved copy falls back to what's here.
//
// NOTE (unify-featured-work): `home.featuredWork.items` was removed from
// this model. The homepage's 3 Featured Work cards now read live from the
// `projects` table (`is_featured = true`, ordered by sort_order, limit 3
// — see lib/projects.ts's getFeaturedProjects()) instead of this static
// blob. `featuredWork.title/titleGold/sub/viewAll` are still edited here
// since those are just section copy, not project data. Any `items` array
// left over in an older saved Supabase row is harmless — deepMerge only
// copies over keys that still exist in the type below.
// =====================================================================

export type LinkItem = { label: string; href: string }
export type ServiceItem = { title: string; body: string; primary: LinkItem; secondary: LinkItem }
export type WorkItem = { tags: string[]; title: string; body: string; date: string }
export type Testimonial = { text: string; name: string; role: string }
export type LogoItem = { name: string; imageUrl: string }
export type FaqItem = { q: string; a: string }
export type SectionHead = { title: string; titleGold: string; sub: string }
export type FaqSection = SectionHead & { items: FaqItem[] }
export type BreakdownItem = { title: string; tags: string[]; desc: string; who: string; turnaround: string; includes: string[] }
export type PricingTier = { name: string; badge: string; featured: boolean; from: string; price: string; desc: string; listLabel: string; list: string[]; cta: string }
export type StepItem = { title: string; text: string }
export type SkillGroup = { title: string; tags: string[] }
export type StatItem = { num: string; label: string }
export type HighlightItem = { year: string; title: string; text: string }
export type ExpectItem = { t: string; d: string }

export type SiteContent = {
  nav: {
    logoLight: string
    logoDark: string
    ctaLabel: string
    ctaHref: string
  }
  home: {
    hero: {
      name1: string
      name2: string
      tags: string[]
      eyebrow: string
      body: string
      featuredLabel: string
      featuredTitle: string
      ctaPrimary: LinkItem
      ctaSecondary: LinkItem
    }
    logos: { label: string; items: LogoItem[] }
    whatIDo: SectionHead & { items: ServiceItem[] }
    featuredWork: SectionHead & { viewAll: LinkItem }
    meet: { title: string; titleGold: string; quote: string; body: string[]; cta: LinkItem }
    testimonials: SectionHead & { items: Testimonial[] }
    cta: SectionHead & { emailPlaceholder: string; button: LinkItem }
  }
  services: {
    hero: { title: string; titleGold: string; body: string }
    breakdown: SectionHead & { items: BreakdownItem[] }
    pricing: SectionHead & { footnote: string; items: PricingTier[] }
    how: SectionHead & { steps: StepItem[] }
    faqs: FaqSection
  }
  about: {
    heroTitle: string
    heroTitleGold: string
    journeyTitle: string
    journey: string[]
    skills: SectionHead & { groups: SkillGroup[] }
    stats: SectionHead & { items: StatItem[] }
    highlightsTitle: string
    highlights: HighlightItem[]
    philosophyLabel: string
    philosophy: string[]
    finalCta: { title: string; body: string; primary: LinkItem; secondary: LinkItem }
  }
  contact: {
    hero: { title: string; titleGold: string; body: string }
    expect: { title: string; items: ExpectItem[] }
    direct: { title: string; email: string; phone: string; location: string; socialLabel: string }
    faqs: FaqSection
  }
  faq: {
    hero: { title: string; titleGold: string; body: string }
    general: { title: string; sub: string; items: FaqItem[] }
    projects: { title: string; sub: string; items: FaqItem[] }
    booking: { title: string; sub: string; items: FaqItem[] }
    finalCta: { title: string; titleGold: string; body: string; button: LinkItem }
  }
  blog: {
    hero: { title: string; titleGold: string; body: string }
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
  services: {
    hero: {
      title: 'What I',
      titleGold: 'Offer',
      body: 'Professional voice over work and coaching tailored to your needs. Every project receives dedicated attention and world-class quality. Voice services designed to meet your creative and professional needs.',
    },
    breakdown: {
      title: 'Services',
      titleGold: 'Breakdown',
      sub: 'Comprehensive voice services designed to meet your creative and professional needs.',
      items: [
        {
          title: 'Voice Over Recording',
          tags: ['Commercial', 'Narration', 'eLearning', 'Corporate', 'Explainer Videos', 'Audiobooks'],
          desc: 'Professional voice over services across all formats and industries. From high-energy commercials to authoritative documentaries, I bring your scripts to life with versatility and polish.',
          who: 'Brands, agencies, content creators, and businesses needing professional voice talent',
          turnaround: '24-72 hours (depending on project scope)',
          includes: ['Broadcast-quality audio files (WAV, MP3, or preferred format)', 'Multiple takes and variations as needed', 'Professional editing and mastering', 'Commercial license for usage rights', 'Pickup/revision recording as agreed'],
        },
        {
          title: 'Voice Coaching',
          tags: ['One-on-One Sessions', 'Group Workshops', 'Beginner to Advanced Levels'],
          desc: 'Personalized one-on-one coaching to develop your voice over skills, build confidence, and refine your unique vocal identity. Whether you\u2019re just starting out or looking to level up, I\u2019ll guide you every step of the way.',
          who: 'Aspiring voice artists, content creators, and professionals wanting to improve their vocal delivery',
          turnaround: 'Sessions scheduled weekly or bi-weekly',
          includes: ['Customized lesson plans based on your goals', 'Vocal technique and breath control training', 'Script interpretation and performance coaching', 'Industry insights and career guidance', 'Recording reviews and constructive feedback', 'Home studio setup recommendations'],
        },
        {
          title: 'Demo Reel Production',
          tags: ['Commercial Demo', 'Character Demo', 'Narration Demo', 'Multi-Genre Demo'],
          desc: 'End-to-end demo reel production that showcases your talent in the best light. From script selection to final mix, I\u2019ll help you create a compelling demo that opens doors.',
          who: 'Voice actors building or refreshing their professional demo reel',
          turnaround: '2-3 weeks from start to delivery',
          includes: ['Script curation tailored to your voice and goals', 'Professional recording and direction', 'High-quality editing and mixing', 'Music and SFX integration', 'Multiple format exports (60s, 90s, full-length)', 'Performance notes and coaching throughout'],
        },
        {
          title: 'Script Consultation',
          tags: ['Single Script Review', 'Ongoing Project Support'],
          desc: 'Expert review and feedback on your scripts before recording. I\u2019ll help optimize pacing, tone, delivery notes, and ensure your script is camera-ready for the best possible performance.',
          who: 'Writers, producers, and creators who want to maximize the impact of their voice over scripts',
          turnaround: '48 hours',
          includes: ['Detailed script review and markup', 'Pacing and breath mark suggestions', 'Tone and delivery recommendations', 'Pronunciation guidance for technical terms', 'Estimated recording time analysis', 'Written feedback document'],
        },
      ],
    },
    pricing: {
      title: 'Pricing',
      titleGold: 'Packages',
      sub: 'Transparent pricing designed to fit projects of all sizes. Custom quotes available for unique requirements.',
      footnote: '$ Prices may vary based on project complexity, word count, and delivery timeline. 50% deposit required before production begins. Final payment due upon delivery.',
      items: [
        { name: 'Basic Package', badge: 'Most affordable', featured: false, from: 'From $250 (Save 10%)', price: '$150', desc: 'Perfect for short-form content and quick projects (make this longer)', listLabel: 'Basic package includes:', list: ['Up to 150 words', '1 revision round', '48-hour delivery', 'Professional editing & mastering'], cta: 'Book Basic' },
        { name: 'Standard Package', badge: 'Most Popular', featured: true, from: 'From $550 (Save 10%)', price: '$350', desc: 'Most popular \u2013 ideal for most projects', listLabel: 'Everything in basic, plus:', list: ['Up to 500 words', '2 revision rounds', '24-hour delivery', 'Professional editing & mastering'], cta: 'Book Standard' },
        { name: 'Custom', badge: 'Let\u2019s Talk', featured: false, from: 'Starts at', price: '$500', desc: 'For large-scale or ongoing projects', listLabel: 'Basic package includes:', list: ['Up to 150 words', '1 revision round', '48-hour delivery', 'Professional editing & mastering'], cta: 'Inquire' },
      ],
    },
    how: {
      title: 'How It',
      titleGold: 'Works',
      sub: 'A simple, transparent process from first contact to final delivery. Here\u2019s what to expect when working with me.',
      steps: [
        { title: 'Reach Out', text: 'Fill out the inquiry form or send me a direct message with your project details, timeline, and any specific requirements.' },
        { title: 'Discovery Call', text: 'We\u2019ll have a brief discussion about your project or coaching goals, creative direction, and expectations to ensure we\u2019re aligned.' },
        { title: 'Agreement & Payment', text: 'You\u2019ll receive a detailed quote and agreement. Once signed and the deposit is received, we\u2019re ready to roll.' },
        { title: 'Production / Session', text: 'Recording begins! For coaching, we\u2019ll start our scheduled sessions. For voice over work, I\u2019ll deliver the performance with precision and professionalism.' },
        { title: 'Delivery & Revisions', text: 'Receive your polished files within the agreed timeframe. Any revisions within scope will be handled promptly and professionally.' },
      ],
    },
    faqs: {
      title: 'Quick',
      titleGold: 'Answers',
      sub: 'Common questions about booking and working together',
      items: [
        { q: 'How soon can you start on a project?', a: 'Most projects begin within 2\u20133 business days of a signed agreement and deposit. Rush turnaround is available on request.' },
        { q: 'Do you require a deposit before starting?', a: 'Yes \u2014 a 50% deposit secures your slot and start date. The balance is due on delivery of the final files.' },
        { q: 'Do you work with international clients?', a: 'Absolutely. I work with clients worldwide and deliver remotely, scheduling sessions across time zones as needed.' },
        { q: 'What information should I have ready before reaching out?', a: 'Your script or brief, intended use, target tone, deadline, and any reference samples help me give you an accurate quote.' },
        { q: 'Can I request a custom package?', a: 'Yes. For larger or ongoing work, I\u2019ll put together a tailored quote based on scope, word count, and timeline.' },
        { q: 'What file formats do you deliver?', a: 'Broadcast-quality WAV and MP3 by default, or any preferred format and specification you require.' },
        { q: 'How do I get started?', a: 'Send a message through the contact page with your project details, and I\u2019ll follow up to align on scope and timing.' },
        { q: 'What\u2019s your cancellation policy?', a: 'Deposits are non-refundable once work begins, but unused balances can be credited toward future projects within scope.' },
      ],
    },
  },
  about: {
    heroTitle: 'Know more about',
    heroTitleGold: 'Erwin',
    journeyTitle: 'My Journey',
    journey: [
      'My journey into voice over began over 15 years ago, almost by accident. I was working in radio when a colleague asked me to record a quick commercial spot. That one simple recording opened my eyes to the incredible power of the human voice\u2014how it can persuade, comfort, educate, and entertain.',
      'Since then, I\u2019ve dedicated myself to mastering this craft. I\u2019ve voiced everything from high-energy commercials that drive sales to soothing meditation apps that help people find peace. I\u2019ve narrated documentaries, trained corporate teams through eLearning modules, brought characters to life in video games, and spent countless hours in the audiobook booth telling stories that transport listeners to different worlds.',
      'What I love most about voice over is its versatility and the human connection it creates. Every project is a new challenge, a new story to tell, and a new opportunity to make an impact. Whether it\u2019s a 15-second spot or an 8-hour audiobook, I approach each with the same passion and professionalism. Beyond my own work, I discovered a deep fulfillment in coaching aspiring voice artists. There\u2019s something incredibly rewarding about helping someone discover their unique vocal identity, overcome their fears, and land their first paid gig. I\u2019ve coached over 50 students, and each success story feels like my own.',
    ],
    skills: {
      title: 'Skills &',
      titleGold: 'Expertise',
      sub: 'A versatile voice artist with expertise across multiple styles, genres, and coaching specialties.',
      groups: [
        { title: 'Voice Styles', tags: ['Conversational', 'Authoritative', 'Warm & Friendly', 'Energetic', 'Narrative', 'Character Voices', 'Calm & Soothing', 'Professional'] },
        { title: 'Genres', tags: ['Commercial', 'eLearning', 'Corporate', 'Narration & Documentary', 'Explainer Videos', 'Audiobook', 'Video Games', 'Meditation & Wellness'] },
        { title: 'Coaching', tags: ['Beginner Training', 'Advanced Technique', 'Demo Reel Preparation', 'Audition Coaching', 'Script Interpretation', 'Home Studio Setup'] },
      ],
    },
    stats: {
      title: 'Experiences &',
      titleGold: 'Milestones',
      sub: 'Numbers that tell the story of dedication, growth, and impact.',
      items: [
        { num: '15+', label: 'Years in the industry' },
        { num: '500+', label: 'Projects Delivered' },
        { num: '50+', label: 'Students Coached' },
        { num: '100%', label: 'Client Satisfaction' },
      ],
    },
    highlightsTitle: 'Career Highlights',
    highlights: [
      { year: '2020', title: 'On my 500+ projects', text: 'Looking back, I never really set out to hit a number \u2014 it just happened because I said yes to everything. Commercials, eLearning, audiobooks, video games \u2014 each one taught me something different. Each format has its own rhythm, its own demands. And I think that\u2019s what shaped me into the voice artist I am today. The versatility didn\u2019t come from talent alone \u2014 it came from showing up, project after project, and caring about every single one.' },
      { year: '2019', title: 'On launching my coaching service', text: 'At some point I started getting messages from people asking how I got into the industry, how I built my career. And I realized \u2014 I have something worth sharing. So I started coaching, and honestly? Watching someone book their first paid gig after working with me hits differently than any project I\u2019ve ever done myself. Over 50 students now. Some of them are out there working professionally in really competitive markets. That means everything to me.' },
      { year: '2018', title: 'On the #1 bestselling thriller audiobook', text: 'Thrillers are tricky because the tension has to live in your voice \u2014 not just in the words. You\u2019re basically an actor without a camera. When that book hit number one and I started reading the listener reviews \u2014 4.8 stars, people saying they couldn\u2019t stop listening \u2014 I just sat quietly for a moment. That one really sank in. That\u2019s the kind of project you don\u2019t forget.' },
      { year: '2017', title: 'On character voice work', text: 'Character work was something I stepped into almost by curiosity. An indie game studio reached out and I thought \u2014 why not? And I fell in love with it. There\u2019s something magical about giving a character a voice that didn\u2019t exist before. Players connect with these characters on such a deep level, and knowing your voice is part of that experience \u2014 part of their story \u2014 it\u2019s a really special feeling.' },
      { year: '2016', title: 'On building my home studio', text: 'I knew early on that if I was going to do this seriously, I needed to invest in the space. So I built my studio from the ground up \u2014 proper acoustic treatment, broadcast-quality gear, the works. It\u2019s not just a recording space. It\u2019s where the work actually happens. Clients can hear the difference, and that matters. It tells them you take this as seriously as they do.' },
      { year: '2015', title: 'On the international automotive campaign', text: 'That campaign was one of those moments where you realize just how far your voice can travel. One script, twelve radio markets, an international brand \u2014 millions of people heard that. I remember driving and catching it on the radio and just thinking \u2014 that\u2019s wild. That\u2019s my voice in all of those cities, all of those cars, all of those moments.' },
      { year: '2010', title: 'On going full-time', text: 'Radio gave me my foundation. The mic, the timing, the ability to connect with an audience you can\u2019t see \u2014 I learned all of that in broadcasting. But there came a point where voice over started calling louder. And I made the leap. It wasn\u2019t without risk, but I knew I was ready. Everything I\u2019d built in radio \u2014 I brought all of it with me. And I haven\u2019t looked back since.' },
    ],
    philosophyLabel: 'My Philosophy',
    philosophy: [
      'The voice is more than just sound\u2014it\u2019s emotion, connection, and storytelling. Every script tells a story, and my job is to bring that story to life in a way that resonates with the audience. Whether it\u2019s selling a product, educating learners, or entertaining listeners, I approach each project with the same dedication: to deliver a performance that not only meets but exceeds expectations.',
      'In coaching, I believe everyone has a unique voice worth sharing. My role isn\u2019t to make you sound like me or anyone else\u2014it\u2019s to help you discover your authentic voice, refine your technique, and use it confidently to tell the stories only you can tell.',
    ],
    finalCta: {
      title: 'Want to work with someone who\u2019s passionate about the craft?',
      body: 'Let\u2019s connect and create something exceptional together. Whether you need a voice for your project or coaching to develop your own, I\u2019m here to help.',
      primary: { label: 'Get in Touch', href: '/contact' },
      secondary: { label: 'View My Work', href: '/work' },
    },
  },
  contact: {
    hero: {
      title: 'Let\u2019s work',
      titleGold: 'together',
      body: 'Whether you have a project in mind or just want to say hello, I\u2019d love to hear from you.',
    },
    expect: {
      title: 'What to Expect',
      items: [
        { t: 'Response time:', d: 'I typically respond within 24-48 hours' },
        { t: 'Next steps:', d: 'A brief discovery call or email discussion about your project' },
        { t: 'Be prepared:', d: 'Having your script or word count estimate ready speeds things up' },
        { t: 'International welcome:', d: 'I work with clients worldwide across all time zones' },
      ],
    },
    direct: {
      title: 'Direct Contact',
      email: 'erwin.natividad@voiceover.com',
      phone: '+1 (234) 567-8900',
      location: 'Remote',
      socialLabel: 'You can also find me on',
    },
    faqs: {
      title: 'Quick',
      titleGold: 'Answers',
      sub: 'Common questions about booking and working together',
      items: [
        { q: 'How soon can you start on a project?', a: 'Most projects begin within 2\u20133 business days of a signed agreement and deposit. Rush turnaround is available on request.' },
        { q: 'Do you require a deposit before starting?', a: 'Yes \u2014 a 50% deposit secures your slot and start date. The balance is due on delivery of the final files.' },
        { q: 'Do you work with international clients?', a: 'Absolutely. I work with clients worldwide and deliver remotely, scheduling sessions across time zones as needed.' },
        { q: 'What information should I have ready before reaching out?', a: 'Your script or brief, intended use, target tone, deadline, and any reference samples help me give you an accurate quote.' },
      ],
    },
  },
  faq: {
    hero: {
      title: 'Frequently asked',
      titleGold: 'questions',
      body: 'Everything you need to know about working with me \u2014 from turnaround and formats to booking and payment. Don\u2019t see your question? Reach out anytime.',
    },
    general: {
      title: 'General',
      sub: 'The basics about my work and process.',
      items: [
        { q: 'What services do you offer?', a: 'Professional voice over recording, one-on-one voice coaching, full demo reel production, and script consultation for voice-driven content.' },
        { q: 'Do you work with international and remote clients?', a: 'Yes \u2014 I work with clients worldwide and deliver entirely remotely, scheduling sessions across time zones as needed.' },
        { q: 'How do we get started?', a: 'Book a free discovery call through the Work With Me page. Tell me about your project and I\u2019ll email you to set up a time \u2014 no payment required to begin.' },
        { q: 'What makes a good fit for working together?', a: 'Clear goals and an openness to direction. Whether you\u2019re a brand, agency, or individual creator, the discovery call helps us both confirm it\u2019s the right match.' },
      ],
    },
    projects: {
      title: 'Projects & Delivery',
      sub: 'How voiceover and coaching projects run.',
      items: [
        { q: 'What styles and genres do you cover?', a: 'Commercials, narration, eLearning, corporate, explainer videos, audiobooks and more \u2014 from high-energy reads to warm, authoritative delivery.' },
        { q: 'What\u2019s your typical turnaround?', a: 'Most voice over projects deliver within 24\u201372 hours depending on scope. Rush options are available on request.' },
        { q: 'What file formats do you deliver?', a: 'Broadcast-quality WAV or MP3 by default, and I\u2019m happy to match any specific format, sample rate, or naming convention your project needs.' },
        { q: 'How many revisions are included?', a: 'Each package includes revision rounds within the agreed scope. Additional changes outside scope can be added at an hourly rate.' },
      ],
    },
    booking: {
      title: 'Booking & Payment',
      sub: 'Scheduling, rates, and what to expect.',
      items: [
        { q: 'Is the discovery call really free?', a: 'Yes. The call is a no-obligation conversation about your project. You won\u2019t be charged anything to book or attend.' },
        { q: 'Do you require a deposit before a project starts?', a: 'For paid projects, a 50% deposit secures your start date, with the balance due on delivery. This only applies once we\u2019ve agreed on scope \u2014 never to book the call.' },
        { q: 'What are your rates?', a: 'Packages start at $150 for short-form work, with standard and custom tiers for larger projects. We\u2019ll confirm exact pricing after the discovery call.' },
        { q: 'What\u2019s your cancellation policy?', a: 'Discovery calls can be rescheduled anytime. For booked projects, cancellation terms are outlined in your agreement before any payment is made.' },
      ],
    },
    finalCta: {
      title: 'Still have',
      titleGold: 'questions?',
      body: 'Book a free discovery call and let\u2019s talk it through.',
      button: { label: 'Work With Me', href: '/work-with-me' },
    },
  },
  blog: {
    hero: {
      title: 'The',
      titleGold: 'Journal',
      body: 'Thoughts on voice, craft, and the business of bringing scripts to life \u2014 plus practical tips for clients and aspiring voice artists.',
    },
  },
}