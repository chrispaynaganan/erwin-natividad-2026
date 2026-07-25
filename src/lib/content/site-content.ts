export type LinkItem = { label: string; href: string }
export type ServiceItem = { title: string; body: string; primary: LinkItem; secondary: LinkItem }
export type WorkItem = { tags: string[]; title: string; body: string; date: string }
export type Testimonial = { text: string; name: string; role: string }
export type LogoItem = { name: string; imageUrl: string }
export type FaqItem = { q: string; a: string }
export type SectionHead = { title: string; titleGold: string; sub: string }
export type FaqSection = SectionHead & { items: FaqItem[] }
export type BreakdownItem = { title: string; tags: string[]; desc: string; who: string; turnaround: string; includes: string[] }
export type PricingInclusion = { id: string; label: string; price: number }
export type PricingTier = { name: string; badge: string; featured: boolean; pricePrefix: string; discountPercent: number; useCustomPrice: boolean; customPriceLabel: string; desc: string; listLabel: string; list: PricingInclusion[]; cta: string }
export type StepItem = { title: string; text: string }
export type SkillGroup = { title: string; tags: string[] }
export type StatItem = { num: string; label: string }
export type HighlightItem = { year: string; title: string; text: string }
export type ExpectItem = { t: string; d: string }
export type SeoMeta = { metaTitle: string; metaDescription: string; ogImageUrl: string }

export const blankSeo = (): SeoMeta => ({ metaTitle: '', metaDescription: '', ogImageUrl: '' })

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
      photoUrl: string
      ctaPrimary: LinkItem
      ctaSecondary: LinkItem
    }
    logos: { label: string; items: LogoItem[] }
    whatIDo: SectionHead & { items: ServiceItem[] }
    featuredWork: SectionHead & { viewAll: LinkItem }
    meet: { title: string; titleGold: string; quote: string; body: string[]; photoUrl: string; cta: LinkItem }
    testimonials: SectionHead & { items: Testimonial[] }
    cta: SectionHead & { emailPlaceholder: string; button: LinkItem }
    seo: SeoMeta
  }
  services: {
    hero: { title: string; titleGold: string; body: string }
    breakdown: SectionHead & { items: BreakdownItem[] }
    pricing: SectionHead & { footnote: string; items: PricingTier[] }
    how: SectionHead & { steps: StepItem[] }
    faqs: FaqSection
    seo: SeoMeta
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
    seo: SeoMeta
  }
  contact: {
    hero: { title: string; titleGold: string; body: string }
    expect: { title: string; items: ExpectItem[] }
    direct: { title: string; email: string; phone: string; location: string; socialLabel: string }
    faqs: FaqSection
    seo: SeoMeta
  }
  faq: {
    hero: { title: string; titleGold: string; body: string }
    general: { title: string; sub: string; items: FaqItem[] }
    projects: { title: string; sub: string; items: FaqItem[] }
    booking: { title: string; sub: string; items: FaqItem[] }
    finalCta: { title: string; titleGold: string; body: string; button: LinkItem }
    seo: SeoMeta
  }
  blog: {
    hero: { title: string; titleGold: string; body: string }
    seo: SeoMeta
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
      body: 'Hi, I’m a passionate voice over artist and coach who loves helping scripts come alive. With years of experience, I’ve had the joy of working closely with top brands, inspiring storytellers, and up-and-coming voice talents from all over the world. I’m dedicated to bringing out the unique personality in every project and guiding others to find their own authentic voice.',
      featuredLabel: 'Featured',
      featuredTitle: 'Grandma’s Bedtime Stories',
      photoUrl: '',
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
        'With many years of experience in the voice over industry, I’ve had the privilege of working with global brands, independent creators, and aspiring voice artists from around the world. My passion lies in bringing stories to life through voice and helping others discover and refine their unique vocal identity.',
        'Whether it’s a high-energy commercial or an intimate audiobook narration, I approach every project with professionalism and creativity.',
      ],
      photoUrl: '',
      cta: { label: 'More About Erwin', href: '/about' },
    },
    testimonials: {
      title: 'What People',
      titleGold: 'Say',
      sub: 'Don’t just take my word for it — hear from clients and students who’ve experienced the difference.',
      items: [
        { text: 'Erwin’s voice brought our brand campaign to life in ways we never imagined. His professionalism and ability to nail the perfect tone on the first take saved us time and delivered exceptional results.', name: 'Sarah Mitchell', role: 'Marketing Director, TechVision Inc.' },
        { text: 'As a voice coaching student, I can’t recommend Erwin enough. He helped me discover my authentic voice and gave me the confidence to pursue professional work. Three months later, I landed my first commercial gig!', name: 'Michael Chen', role: 'Voice Coaching Student' },
        { text: 'Working with Erwin on our audiobook series was a dream. His range of character voices and emotional depth brought our story to life. Listeners consistently praise the narration quality.', name: 'Jessica Torres', role: 'Author & Publisher' },
      ],
    },
    cta: {
      title: 'Ready to Find',
      titleGold: 'Your Voice?',
      sub: 'Let’s work together to bring your project to life or unlock your full vocal potential.',
      emailPlaceholder: 'Email Address',
      button: { label: 'Get in Touch', href: '/contact' },
    },
    seo: blankSeo(),
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
          desc: 'Personalized one-on-one coaching to develop your voice over skills, build confidence, and refine your unique vocal identity. Whether you’re just starting out or looking to level up, I’ll guide you every step of the way.',
          who: 'Aspiring voice artists, content creators, and professionals wanting to improve their vocal delivery',
          turnaround: 'Sessions scheduled weekly or bi-weekly',
          includes: ['Customized lesson plans based on your goals', 'Vocal technique and breath control training', 'Script interpretation and performance coaching', 'Industry insights and career guidance', 'Recording reviews and constructive feedback', 'Home studio setup recommendations'],
        },
        {
          title: 'Demo Reel Production',
          tags: ['Commercial Demo', 'Character Demo', 'Narration Demo', 'Multi-Genre Demo'],
          desc: 'End-to-end demo reel production that showcases your talent in the best light. From script selection to final mix, I’ll help you create a compelling demo that opens doors.',
          who: 'Voice actors building or refreshing their professional demo reel',
          turnaround: '2-3 weeks from start to delivery',
          includes: ['Script curation tailored to your voice and goals', 'Professional recording and direction', 'High-quality editing and mixing', 'Music and SFX integration', 'Multiple format exports (60s, 90s, full-length)', 'Performance notes and coaching throughout'],
        },
        {
          title: 'Script Consultation',
          tags: ['Single Script Review', 'Ongoing Project Support'],
          desc: 'Expert review and feedback on your scripts before recording. I’ll help optimize pacing, tone, delivery notes, and ensure your script is camera-ready for the best possible performance.',
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
        {
          name: 'Basic Package', badge: 'Most affordable', featured: false,
          pricePrefix: 'From', discountPercent: 25, useCustomPrice: false, customPriceLabel: 'Let’s Talk',
          desc: 'Perfect for short-form content and quick projects (make this longer)',
          listLabel: 'Basic package includes:',
          list: [
            { id: 'basic-words', label: 'Up to 150 words', price: 100 },
            { id: 'basic-revision', label: '1 revision round', price: 40 },
            { id: 'basic-delivery', label: '48-hour delivery', price: 30 },
            { id: 'basic-editing', label: 'Professional editing & mastering', price: 30 },
          ],
          cta: 'Book Basic',
        },
        {
          name: 'Standard Package', badge: 'Most Popular', featured: true,
          pricePrefix: 'From', discountPercent: 30, useCustomPrice: false, customPriceLabel: 'Let’s Talk',
          desc: 'Most popular – ideal for most projects',
          listLabel: 'Everything in basic, plus:',
          list: [
            { id: 'std-words', label: 'Up to 500 words', price: 300 },
            { id: 'std-revision', label: '2 revision rounds', price: 80 },
            { id: 'std-delivery', label: '24-hour delivery', price: 70 },
            { id: 'std-editing', label: 'Professional editing & mastering', price: 50 },
          ],
          cta: 'Book Standard',
        },
        {
          name: 'Custom', badge: 'Let’s Talk', featured: false,
          pricePrefix: 'Pricing', discountPercent: 0, useCustomPrice: true, customPriceLabel: 'Custom Quote',
          desc: 'For large-scale or ongoing projects',
          listLabel: 'Basic package includes:',
          list: [
            { id: 'custom-words', label: 'Up to 150 words', price: 300 },
            { id: 'custom-revision', label: '1 revision round', price: 50 },
            { id: 'custom-delivery', label: '48-hour delivery', price: 50 },
            { id: 'custom-editing', label: 'Professional editing & mastering', price: 100 },
          ],
          cta: 'Inquire',
        },
      ],
    },
    how: {
      title: 'How It',
      titleGold: 'Works',
      sub: 'A simple, transparent process from first contact to final delivery. Here’s what to expect when working with me.',
      steps: [
        { title: 'Reach Out', text: 'Fill out the inquiry form or send me a direct message with your project details, timeline, and any specific requirements.' },
        { title: 'Discovery Call', text: 'We’ll have a brief discussion about your project or coaching goals, creative direction, and expectations to ensure we’re aligned.' },
        { title: 'Agreement & Payment', text: 'You’ll receive a detailed quote and agreement. Once signed and the deposit is received, we’re ready to roll.' },
        { title: 'Production / Session', text: 'Recording begins! For coaching, we’ll start our scheduled sessions. For voice over work, I’ll deliver the performance with precision and professionalism.' },
        { title: 'Delivery & Revisions', text: 'Receive your polished files within the agreed timeframe. Any revisions within scope will be handled promptly and professionally.' },
      ],
    },
    faqs: {
      title: 'Quick',
      titleGold: 'Answers',
      sub: 'Common questions about booking and working together',
      items: [
        { q: 'How soon can you start on a project?', a: 'Most projects begin within 2–3 business days of a signed agreement and deposit. Rush turnaround is available on request.' },
        { q: 'Do you require a deposit before starting?', a: 'Yes — a 50% deposit secures your slot and start date. The balance is due on delivery of the final files.' },
        { q: 'Do you work with international clients?', a: 'Absolutely. I work with clients worldwide and deliver remotely, scheduling sessions across time zones as needed.' },
        { q: 'What information should I have ready before reaching out?', a: 'Your script or brief, intended use, target tone, deadline, and any reference samples help me give you an accurate quote.' },
        { q: 'Can I request a custom package?', a: 'Yes. For larger or ongoing work, I’ll put together a tailored quote based on scope, word count, and timeline.' },
        { q: 'What file formats do you deliver?', a: 'Broadcast-quality WAV and MP3 by default, or any preferred format and specification you require.' },
        { q: 'How do I get started?', a: 'Send a message through the contact page with your project details, and I’ll follow up to align on scope and timing.' },
        { q: 'What’s your cancellation policy?', a: 'Deposits are non-refundable once work begins, but unused balances can be credited toward future projects within scope.' },
      ],
    },
    seo: blankSeo(),
  },
  about: {
    heroTitle: 'Know more about',
    heroTitleGold: 'Erwin',
    journeyTitle: 'My Journey',
    journey: [
      'My journey into voice over began over 15 years ago, almost by accident. I was working in radio when a colleague asked me to record a quick commercial spot. That one simple recording opened my eyes to the incredible power of the human voice—how it can persuade, comfort, educate, and entertain.',
      'Since then, I’ve dedicated myself to mastering this craft. I’ve voiced everything from high-energy commercials that drive sales to soothing meditation apps that help people find peace. I’ve narrated documentaries, trained corporate teams through eLearning modules, brought characters to life in video games, and spent countless hours in the audiobook booth telling stories that transport listeners to different worlds.',
      'What I love most about voice over is its versatility and the human connection it creates. Every project is a new challenge, a new story to tell, and a new opportunity to make an impact. Whether it’s a 15-second spot or an 8-hour audiobook, I approach each with the same passion and professionalism. Beyond my own work, I discovered a deep fulfillment in coaching aspiring voice artists. There’s something incredibly rewarding about helping someone discover their unique vocal identity, overcome their fears, and land their first paid gig. I’ve coached over 50 students, and each success story feels like my own.',
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
      { year: '2020', title: 'On my 500+ projects', text: 'Looking back, I never really set out to hit a number — it just happened because I said yes to everything. Commercials, eLearning, audiobooks, video games — each one taught me something different. Each format has its own rhythm, its own demands. And I think that’s what shaped me into the voice artist I am today. The versatility didn’t come from talent alone — it came from showing up, project after project, and caring about every single one.' },
      { year: '2019', title: 'On launching my coaching service', text: 'At some point I started getting messages from people asking how I got into the industry, how I built my career. And I realized — I have something worth sharing. So I started coaching, and honestly? Watching someone book their first paid gig after working with me hits differently than any project I’ve ever done myself. Over 50 students now. Some of them are out there working professionally in really competitive markets. That means everything to me.' },
      { year: '2018', title: 'On the #1 bestselling thriller audiobook', text: 'Thrillers are tricky because the tension has to live in your voice — not just in the words. You’re basically an actor without a camera. When that book hit number one and I started reading the listener reviews — 4.8 stars, people saying they couldn’t stop listening — I just sat quietly for a moment. That one really sank in. That’s the kind of project you don’t forget.' },
      { year: '2017', title: 'On character voice work', text: 'Character work was something I stepped into almost by curiosity. An indie game studio reached out and I thought — why not? And I fell in love with it. There’s something magical about giving a character a voice that didn’t exist before. Players connect with these characters on such a deep level, and knowing your voice is part of that experience — part of their story — it’s a really special feeling.' },
      { year: '2016', title: 'On building my home studio', text: 'I knew early on that if I was going to do this seriously, I needed to invest in the space. So I built my studio from the ground up — proper acoustic treatment, broadcast-quality gear, the works. It’s not just a recording space. It’s where the work actually happens. Clients can hear the difference, and that matters. It tells them you take this as seriously as they do.' },
      { year: '2015', title: 'On the international automotive campaign', text: 'That campaign was one of those moments where you realize just how far your voice can travel. One script, twelve radio markets, an international brand — millions of people heard that. I remember driving and catching it on the radio and just thinking — that’s wild. That’s my voice in all of those cities, all of those cars, all of those moments.' },
      { year: '2010', title: 'On going full-time', text: 'Radio gave me my foundation. The mic, the timing, the ability to connect with an audience you can’t see — I learned all of that in broadcasting. But there came a point where voice over started calling louder. And I made the leap. It wasn’t without risk, but I knew I was ready. Everything I’d built in radio — I brought all of it with me. And I haven’t looked back since.' },
    ],
    philosophyLabel: 'My Philosophy',
    philosophy: [
      'The voice is more than just sound—it’s emotion, connection, and storytelling. Every script tells a story, and my job is to bring that story to life in a way that resonates with the audience. Whether it’s selling a product, educating learners, or entertaining listeners, I approach each project with the same dedication: to deliver a performance that not only meets but exceeds expectations.',
      'In coaching, I believe everyone has a unique voice worth sharing. My role isn’t to make you sound like me or anyone else—it’s to help you discover your authentic voice, refine your technique, and use it confidently to tell the stories only you can tell.',
    ],
    finalCta: {
      title: 'Want to work with someone who’s passionate about the craft?',
      body: 'Let’s connect and create something exceptional together. Whether you need a voice for your project or coaching to develop your own, I’m here to help.',
      primary: { label: 'Get in Touch', href: '/contact' },
      secondary: { label: 'View My Work', href: '/work' },
    },
    seo: blankSeo(),
  },
  contact: {
    hero: {
      title: 'Let’s work',
      titleGold: 'together',
      body: 'Whether you have a project in mind or just want to say hello, I’d love to hear from you.',
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
        { q: 'How soon can you start on a project?', a: 'Most projects begin within 2–3 business days of a signed agreement and deposit. Rush turnaround is available on request.' },
        { q: 'Do you require a deposit before starting?', a: 'Yes — a 50% deposit secures your slot and start date. The balance is due on delivery of the final files.' },
        { q: 'Do you work with international clients?', a: 'Absolutely. I work with clients worldwide and deliver remotely, scheduling sessions across time zones as needed.' },
        { q: 'What information should I have ready before reaching out?', a: 'Your script or brief, intended use, target tone, deadline, and any reference samples help me give you an accurate quote.' },
      ],
    },
    seo: blankSeo(),
  },
  faq: {
    hero: {
      title: 'Frequently asked',
      titleGold: 'questions',
      body: 'Everything you need to know about working with me — from turnaround and formats to booking and payment. Don’t see your question? Reach out anytime.',
    },
    general: {
      title: 'General',
      sub: 'The basics about my work and process.',
      items: [
        { q: 'What services do you offer?', a: 'Professional voice over recording, one-on-one voice coaching, full demo reel production, and script consultation for voice-driven content.' },
        { q: 'Do you work with international and remote clients?', a: 'Yes — I work with clients worldwide and deliver entirely remotely, scheduling sessions across time zones as needed.' },
        { q: 'How do we get started?', a: 'Book a free discovery call through the Work With Me page. Tell me about your project and I’ll email you to set up a time — no payment required to begin.' },
        { q: 'What makes a good fit for working together?', a: 'Clear goals and an openness to direction. Whether you’re a brand, agency, or individual creator, the discovery call helps us both confirm it’s the right match.' },
      ],
    },
    projects: {
      title: 'Projects & Delivery',
      sub: 'How voiceover and coaching projects run.',
      items: [
        { q: 'What styles and genres do you cover?', a: 'Commercials, narration, eLearning, corporate, explainer videos, audiobooks and more — from high-energy reads to warm, authoritative delivery.' },
        { q: 'What’s your typical turnaround?', a: 'Most voice over projects deliver within 24–72 hours depending on scope. Rush options are available on request.' },
        { q: 'What file formats do you deliver?', a: 'Broadcast-quality WAV or MP3 by default, and I’m happy to match any specific format, sample rate, or naming convention your project needs.' },
        { q: 'How many revisions are included?', a: 'Each package includes revision rounds within the agreed scope. Additional changes outside scope can be added at an hourly rate.' },
      ],
    },
    booking: {
      title: 'Booking & Payment',
      sub: 'Scheduling, rates, and what to expect.',
      items: [
        { q: 'Is the discovery call really free?', a: 'Yes. The call is a no-obligation conversation about your project. You won’t be charged anything to book or attend.' },
        { q: 'Do you require a deposit before a project starts?', a: 'For paid projects, a 50% deposit secures your start date, with the balance due on delivery. This only applies once we’ve agreed on scope — never to book the call.' },
        { q: 'What are your rates?', a: 'Packages start at $150 for short-form work, with standard and custom tiers for larger projects. We’ll confirm exact pricing after the discovery call.' },
        { q: 'What’s your cancellation policy?', a: 'Discovery calls can be rescheduled anytime. For booked projects, cancellation terms are outlined in your agreement before any payment is made.' },
      ],
    },
    finalCta: {
      title: 'Still have',
      titleGold: 'questions?',
      body: 'Book a free discovery call and let’s talk it through.',
      button: { label: 'Work With Me', href: '/work-with-me' },
    },
    seo: blankSeo(),
  },
  blog: {
    hero: {
      title: 'The',
      titleGold: 'Journal',
      body: 'Thoughts on voice, craft, and the business of bringing scripts to life — plus practical tips for clients and aspiring voice artists.',
    },
    seo: blankSeo(),
  },
}