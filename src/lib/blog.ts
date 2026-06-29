// Shared blog catalog — used by /blog (listing) and /blog/[slug] (post).
// Placeholder posts for Erwin to replace. Once Supabase is connected, this
// can be swapped to read from the `blog_posts` table.
export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readMinutes: number
  category: string
  body: string[]
}

export const posts: Post[] = [
  {
    slug: 'finding-your-authentic-voice',
    title: 'Finding Your Authentic Voice',
    excerpt: 'Why the goal of voice coaching isn\u2019t to sound like someone else \u2014 it\u2019s to sound unmistakably like you.',
    date: 'March 2026', readMinutes: 5, category: 'Coaching',
    body: [
      'When people start voice coaching, they often arrive with a reference \u2014 a famous narrator, a slick commercial voice, someone they want to sound like. And I get it. But the work I care about most pulls in the opposite direction: toward the voice that is already yours.',
      'Your authentic voice is the one that shows up when you stop performing and start communicating. It carries your rhythm, your warmth, the small imperfections that make a listener trust you. Coaching doesn\u2019t replace that \u2014 it removes what\u2019s in the way of it.',
      '[Replace this with Erwin\u2019s own perspective and examples.]',
    ],
  },
  {
    slug: 'what-makes-a-great-demo-reel',
    title: 'What Makes a Great Demo Reel',
    excerpt: 'A demo reel has seconds to make an impression. Here\u2019s how to make every one of them count.',
    date: 'February 2026', readMinutes: 6, category: 'Demos',
    body: [
      'Casting directors and producers listen to a lot of reels. The good news: that means a strong one stands out fast. The bad news: a weak opening loses them just as fast.',
      'A great reel is short, varied, and front-loaded. Lead with your strongest, most characteristic read. Show range without sprawling. And make sure the production quality never distracts from the voice itself.',
      '[Replace this with Erwin\u2019s reel-building process and tips.]',
    ],
  },
  {
    slug: 'setting-up-a-home-studio',
    title: 'Setting Up a Home Studio That Sounds Professional',
    excerpt: 'You don\u2019t need a fortune \u2014 you need the right priorities. A practical guide to broadcast-quality sound at home.',
    date: 'January 2026', readMinutes: 7, category: 'Studio',
    body: [
      'The single biggest upgrade most home setups can make isn\u2019t a more expensive microphone \u2014 it\u2019s treating the room. Reflections and noise are what separate \u201Crecorded at home\u201D from \u201Cbroadcast quality.\u201D',
      'Start with the space: a small, soft, quiet environment beats a big bare one. Then a clean signal chain, consistent mic technique, and disciplined editing. The gear matters less than the habits.',
      '[Replace this with Erwin\u2019s actual gear recommendations and setup.]',
    ],
  },
]

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug)
}