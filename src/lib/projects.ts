// Shared project catalog — used by /work (listing) and /work/[slug] (detail).
export type Project = {
  slug: string
  title: string
  desc: string
  date: string
  duration: string
  tags: string[]
  client?: string
  completed?: string
  studio?: string
  length?: string
  ageRange?: string
  character?: string
  genre?: string
  deliverables?: string
  body?: string[]
}

export const projects: Project[] = [
  {
    slug: 'energetic-commercial-demo-reel',
    title: 'Energetic Commercial Demo Reel',
    desc: 'High-energy commercial voice over showcasing versatility in product advertising and promotiona...',
    date: 'March 2026', duration: '6:12', tags: ['Commercial', 'Upbeat', 'Advertising'],
    client: 'Various Brands', completed: 'March 2026', studio: 'Home Studio',
    length: '6 minutes total', ageRange: '25-45', character: 'Energetic, Upbeat', genre: 'Commercial',
    deliverables: 'WAV, MP3, Broadcast Quality',
    body: ['A fast-paced reel pulling together spots across retail, tech, and lifestyle brands \u2014 built to show range, energy, and the ability to land a hook in the first three seconds.'],
  },
  {
    slug: 'documentary-narration-environmental-series',
    title: 'Documentary Narration Environmental Series',
    desc: 'Calm, authoritative narration for a 6-part environmental documentary series.',
    date: 'February 2026', duration: '4:39', tags: ['Narration', 'Documentary', 'Informative'],
    client: 'EcoVision Media', completed: 'February 2026', studio: 'Professional Studio Partnership',
    length: '180 minutes total', ageRange: '35-50', character: 'Authoritative, Warm', genre: 'Documentary',
    deliverables: 'WAV, Broadcast Quality',
    body: [
      'One of the projects I\u2019m most proud of was a documentary series on climate change and conservation. It came to me at a time when I was really looking to take on work that actually meant something \u2014 not just technically challenging, but purposeful.',
      'When I first got the brief, I knew right away this wasn\u2019t going to be a straightforward read. Climate change is such a dense, layered topic \u2014 there\u2019s the science, the politics, the human stories \u2014 and the challenge was making all of that feel accessible without dumbing it down. So before I even stepped into the recording booth, I spent a lot of time just immersing myself in the material. Reading through the scripts, watching reference documentaries, understanding the world I was about to bring to life with my voice.',
      'The preparation was probably the most intensive part. I had to find that balance \u2014 serious enough to honor the weight of the subject, but warm and engaging enough that someone watching at home wouldn\u2019t feel like they were sitting through a lecture. That tone doesn\u2019t just happen. You rehearse it, you adjust it, you sometimes throw it out and start over.',
      'We recorded over several sessions \u2014 more than three hours of finished narration in total. And each session was its own process. The production team was incredibly collaborative. We\u2019d go through sections together, talk about what emotion a particular scene needed, where to let the pacing breathe, where to push the urgency. It felt less like a job and more like a creative partnership.',
      'What stayed with me the most was the response after it aired. Hearing that it actually connected with viewers \u2014 that people felt the urgency, that they walked away caring more than they did before \u2014 that\u2019s the kind of thing that reminds you why this work matters.',
    ],
  },
  {
    slug: 'corporate-training-module',
    title: 'Corporate Training Module',
    desc: 'Professional, clear voice over for employee onboarding and compliance training modules.',
    date: 'March 2026', duration: '6:12', tags: ['eLearning', 'Corporate', 'Training'],
    client: 'Enterprise Client', completed: 'March 2026', studio: 'Home Studio',
    length: '45 minutes total', ageRange: '25-55', character: 'Clear, Professional', genre: 'eLearning',
    deliverables: 'WAV, MP3',
    body: ['A clean, measured read for an onboarding and compliance series \u2014 the kind of work where clarity and consistency across dozens of modules matters more than flash.'],
  },
  {
    slug: 'tech-product-explainer-video',
    title: 'Tech Product Explainer Video',
    desc: 'Friendly, conversational explanation of a complex SaaS platform for startup launch.',
    date: 'December 2025', duration: '5:02', tags: ['Explainer', 'Tech', 'Conversational'],
    client: 'SaaS Startup', completed: 'December 2025', studio: 'Home Studio',
    length: '5 minutes total', ageRange: '25-45', character: 'Friendly, Conversational', genre: 'Explainer',
    deliverables: 'WAV, MP3',
    body: ['Turning a complex platform into a warm, plain-spoken walkthrough for a launch video \u2014 conversational enough to feel human, precise enough to land the value.'],
  },
  {
    slug: 'fiction-audiobook-thriller-novel',
    title: 'Fiction Audiobook - Thriller Novel',
    desc: 'Full-length audiobook narration with multiple character voices for a bestselling thriller.',
    date: 'November 2025', duration: '5:53', tags: ['Audiobook', 'Fiction', 'Character Work'],
    client: 'Publishing House', completed: 'November 2025', studio: 'Professional Studio Partnership',
    length: '9 hours total', ageRange: '30-55', character: 'Dynamic, Multi-character', genre: 'Audiobook',
    deliverables: 'WAV, Audiobook Spec',
    body: ['A full-length thriller with a cast of distinct character voices \u2014 sustaining tension across nine hours while keeping each character instantly recognizable.'],
  },
  {
    slug: 'automotive-radio-campaign',
    title: 'Automotive Radio Campaign',
    desc: 'Bold, confident voice for a luxury automotive brand\u2019s regional radio campaign.',
    date: 'October 2025', duration: '4:39', tags: ['Commercial', 'Radio', 'Authoritative'],
    client: 'Luxury Auto Brand', completed: 'October 2025', studio: 'Home Studio',
    length: '60 seconds (multiple cuts)', ageRange: '30-55', character: 'Bold, Confident', genre: 'Commercial',
    deliverables: 'WAV, Broadcast Quality',
    body: ['A confident, premium read for a regional radio campaign \u2014 several cuts tuned for different markets, all carrying the same assured brand voice.'],
  },
]

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug)
}
export function getAdjacent(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug)
  return { prev: i > 0 ? projects[i - 1] : null, next: i >= 0 && i < projects.length - 1 ? projects[i + 1] : null }
}