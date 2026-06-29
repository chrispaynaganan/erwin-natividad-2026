import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { AudioPlayer } from '@/components/audio-player'
import s from './home.module.css'

const services = [
  { title: 'Voiceovers', body: 'Professional voice over services for commercials, narration, eLearning, audiobooks, video games, and more. Versatile delivery across all genres and styles.', primary: ['Avail My Service', '/contact'], secondary: ['Learn More', '/services'] },
  { title: 'Voice Coaching', body: 'Personalized one-on-one training to help you develop and refine your voice. From beginners to professionals looking to expand their range.', primary: ['Book an Appointment', '/contact'], secondary: ['Learn More', '/services'] },
  { title: 'Demo Production', body: 'Professional demo reel production to showcase your talent. Expert guidance on script selection, performance, and editing for maximum impact.', primary: ['View Projects', '/work'], secondary: ['Learn More', '/services'] },
]

const work = [
  { tags: ['Commercial', 'Upbeat', 'Advertising'], title: 'Energetic Commercial Demo Reel', body: 'High-energy commercial voice over showcasing versatility in product advertising and promotiona...', date: 'March 2026' },
  { tags: ['Narration', 'Documentary', 'Informative'], title: 'Documentary Narration - Environmental Series', body: 'Calm, authoritative narration for a 6-part environmental documentary series.', date: 'March 2026' },
  { tags: ['eLearning', 'Corporate', 'Training'], title: 'Corporate Training Module', body: 'Professional, clear voice over for employee onboarding and compliance training modules.', date: 'March 2026' },
]

const testimonials = [
  { text: 'Erwin\u2019s voice brought our brand campaign to life in ways we never imagined. His professionalism and ability to nail the perfect tone on the first take saved us time and delivered exceptional results.', name: 'Sarah Mitchell', role: 'Marketing Director, TechVision Inc.' },
  { text: 'As a voice coaching student, I can\u2019t recommend Erwin enough. He helped me discover my authentic voice and gave me the confidence to pursue professional work. Three months later, I landed my first commercial gig!', name: 'Michael Chen', role: 'Voice Coaching Student' },
  { text: 'Working with Erwin on our audiobook series was a dream. His range of character voices and emotional depth brought our story to life. Listeners consistently praise the narration quality.', name: 'Jessica Torres', role: 'Author & Publisher' },
]

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className={`${s.hero} container`}>
        <div className={s.heroGrid}>
          <div>
            <h1 className={s.heroName}>Erwin<span className={s.heroNameGold}>Natividad</span></h1>
            <div className={s.tags}>
              <span className="pill">Voiceover Artist</span>
              <span className="pill">Voice Coach</span>
              <span className="pill">Loving Father</span>
            </div>
            <p className={s.heroEyebrow}>The Voice Behind the Story</p>
            <p className={s.heroBody}>
              Hi, I&rsquo;m a passionate voice over artist and coach who loves helping scripts come alive.
              With years of experience, I&rsquo;ve had the joy of working closely with top brands, inspiring
              storytellers, and up-and-coming voice talents from all over the world. I&rsquo;m dedicated to
              bringing out the unique personality in every project and guiding others to find their own authentic voice.
            </p>
            <p className={s.featuredLabel}>Featured</p>
            <p className={s.featuredTitle}>Grandma&rsquo;s Bedtime Stories</p>
            <AudioPlayer />
            <div className={s.heroCtas}>
              <Link href="/contact" className="btn btnSolid">Work With Me</Link>
              <Link href="/work" className="btn btnOutline">Hear My Demos</Link>
            </div>
          </div>
          <div className={s.heroPhoto}>Erwin&rsquo;s portrait</div>
        </div>
      </section>

      {/* LOGOS */}
      <section className={`${s.logos} container`}>
        <p className={s.logosLabel}>Worked with 10+ Companies</p>
        <div className={s.logosRow}>
          {Array.from({ length: 7 }).map((_, i) => <div key={i} className={s.logoChip} />)}
        </div>
      </section>

      {/* WHAT I DO */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>What I <span className="gold">Do</span></h2>
          <p className={s.headSub}>From commercial voice overs to personalized coaching, I offer comprehensive voice services tailored to your needs.</p>
        </Reveal>
        <div className={s.cards3}>
          {services.map((sv, i) => (
            <Reveal key={sv.title} delay={i * 80}>
              <div className={s.serviceCard}>
                <div className={s.serviceImg} />
                <div className={s.serviceBody}>
                  <h3>{sv.title}</h3>
                  <p>{sv.body}</p>
                  <div className={s.serviceBtns}>
                    <Link href={sv.primary[1]} className="btn btnSolid">{sv.primary[0]}</Link>
                    <Link href={sv.secondary[1]} className="btn btnOutline">{sv.secondary[0]}</Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className={`${s.section} container`}>
        <Reveal>
          <div className={s.workHead}>
            <div>
              <h2 className={s.headTitle}>Featured <span className="gold">Work</span></h2>
              <p className={s.headSub}>Explore some of my recent voice over projects across various industries and styles.</p>
            </div>
            <Link href="/work" className="btn btnOutline">View All Demos</Link>
          </div>
        </Reveal>
        <div className={s.workGrid}>
          {[...work, ...work].map((w, i) => (
            <Reveal key={i} delay={(i % 3) * 80}>
              <div className={s.workCard}>
                <div className={s.workTags}>{w.tags.map((t) => <span key={t} className="pill">{t}</span>)}</div>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
                <span className={s.workDate}>{w.date}</span>
                <AudioPlayer />
                <Link href="/work" className="btn btnSolid" style={{ width: '100%' }}>View Project</Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* MEET ERWIN */}
      <section className={`${s.section} container`}>
        <div className={s.meetGrid}>
          <Reveal><div className={s.meetPhoto} /></Reveal>
          <Reveal delay={80}>
            <div>
              <h2 className={s.headTitle}>Meet <span className="gold">Erwin</span></h2>
              <p className={s.meetQuote}>&ldquo;What sets me apart is not just technical skill, but a genuine commitment to understanding your vision and delivering performances that exceed expectations.&rdquo;</p>
              <div className={s.meetBody}>
                <p>With many years of experience in the voice over industry, I&rsquo;ve had the privilege of working with global brands, independent creators, and aspiring voice artists from around the world. My passion lies in bringing stories to life through voice and helping others discover and refine their unique vocal identity.</p>
                <p>Whether it&rsquo;s a high-energy commercial or an intimate audiobook narration, I approach every project with professionalism and creativity.</p>
              </div>
              <Link href="/about" className="btn btnOutline">More About Erwin</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>What People <span className="gold">Say</span></h2>
          <p className={s.headSub}>Don&rsquo;t just take my word for it &mdash; hear from clients and students who&rsquo;ve experienced the difference.</p>
        </Reveal>
        <div className={s.cards3}>
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className={s.tCard}>
                <div className={s.quoteMark}>&ldquo;</div>
                <p className={s.tText}>{t.text}</p>
                <p className={s.tName}>{t.name}</p>
                <p className={s.tRole}>{t.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>Ready to Find <span className="gold">Your Voice?</span></h2>
          <p className={s.headSub}>Let&rsquo;s work together to bring your project to life or unlock your full vocal potential.</p>
          <form className={s.ctaForm}>
            <input className={s.ctaInput} type="email" placeholder="Email Address" aria-label="Email Address" />
            <Link href="/contact" className="btn btnSolid">Get in Touch</Link>
          </form>
        </Reveal>
      </section>
    </main>
  )
}