import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { Journey } from '@/components/journey'
import { Testimonials } from '@/components/testimonials'
import s from './about.module.css'

export const metadata = { title: 'About' }

const journey = [
  'My journey into voice over began over 15 years ago, almost by accident. I was working in radio when a colleague asked me to record a quick commercial spot. That one simple recording opened my eyes to the incredible power of the human voice\u2014how it can persuade, comfort, educate, and entertain.',
  'Since then, I\u2019ve dedicated myself to mastering this craft. I\u2019ve voiced everything from high-energy commercials that drive sales to soothing meditation apps that help people find peace. I\u2019ve narrated documentaries, trained corporate teams through eLearning modules, brought characters to life in video games, and spent countless hours in the audiobook booth telling stories that transport listeners to different worlds.',
  'What I love most about voice over is its versatility and the human connection it creates. Every project is a new challenge, a new story to tell, and a new opportunity to make an impact. Whether it\u2019s a 15-second spot or an 8-hour audiobook, I approach each with the same passion and professionalism. Beyond my own work, I discovered a deep fulfillment in coaching aspiring voice artists. There\u2019s something incredibly rewarding about helping someone discover their unique vocal identity, overcome their fears, and land their first paid gig. I\u2019ve coached over 50 students, and each success story feels like my own.',
]

const skills = [
  { title: 'Voice Styles', tags: ['Conversational', 'Authoritative', 'Warm & Friendly', 'Energetic', 'Narrative', 'Character Voices', 'Calm & Soothing', 'Professional'] },
  { title: 'Genres', tags: ['Commercial', 'eLearning', 'Corporate', 'Narration & Documentary', 'Explainer Videos', 'Audiobook', 'Video Games', 'Meditation & Wellness'] },
  { title: 'Coaching', tags: ['Beginner Training', 'Advanced Technique', 'Demo Reel Preparation', 'Audition Coaching', 'Script Interpretation', 'Home Studio Setup'] },
]

const stats = [
  { num: '15+', label: 'Years in the industry' },
  { num: '500+', label: 'Projects Delivered' },
  { num: '50+', label: 'Students Coached' },
  { num: '100%', label: 'Client Satisfaction' },
]

const highlights = [
  { year: '2020', title: 'On my 500+ projects', text: 'Looking back, I never really set out to hit a number \u2014 it just happened because I said yes to everything. Commercials, eLearning, audiobooks, video games \u2014 each one taught me something different. Each format has its own rhythm, its own demands. And I think that\u2019s what shaped me into the voice artist I am today. The versatility didn\u2019t come from talent alone \u2014 it came from showing up, project after project, and caring about every single one.' },
  { year: '2019', title: 'On launching my coaching service', text: 'At some point I started getting messages from people asking how I got into the industry, how I built my career. And I realized \u2014 I have something worth sharing. So I started coaching, and honestly? Watching someone book their first paid gig after working with me hits differently than any project I\u2019ve ever done myself. Over 50 students now. Some of them are out there working professionally in really competitive markets. That means everything to me.' },
  { year: '2018', title: 'On the #1 bestselling thriller audiobook', text: 'Thrillers are tricky because the tension has to live in your voice \u2014 not just in the words. You\u2019re basically an actor without a camera. When that book hit number one and I started reading the listener reviews \u2014 4.8 stars, people saying they couldn\u2019t stop listening \u2014 I just sat quietly for a moment. That one really sank in. That\u2019s the kind of project you don\u2019t forget.' },
  { year: '2017', title: 'On character voice work', text: 'Character work was something I stepped into almost by curiosity. An indie game studio reached out and I thought \u2014 why not? And I fell in love with it. There\u2019s something magical about giving a character a voice that didn\u2019t exist before. Players connect with these characters on such a deep level, and knowing your voice is part of that experience \u2014 part of their story \u2014 it\u2019s a really special feeling.' },
  { year: '2016', title: 'On building my home studio', text: 'I knew early on that if I was going to do this seriously, I needed to invest in the space. So I built my studio from the ground up \u2014 proper acoustic treatment, broadcast-quality gear, the works. It\u2019s not just a recording space. It\u2019s where the work actually happens. Clients can hear the difference, and that matters. It tells them you take this as seriously as they do.' },
  { year: '2015', title: 'On the international automotive campaign', text: 'That campaign was one of those moments where you realize just how far your voice can travel. One script, twelve radio markets, an international brand \u2014 millions of people heard that. I remember driving and catching it on the radio and just thinking \u2014 that\u2019s wild. That\u2019s my voice in all of those cities, all of those cars, all of those moments.' },
  { year: '2010', title: 'On going full-time', text: 'Radio gave me my foundation. The mic, the timing, the ability to connect with an audience you can\u2019t see \u2014 I learned all of that in broadcasting. But there came a point where voice over started calling louder. And I made the leap. It wasn\u2019t without risk, but I knew I was ready. Everything I\u2019d built in radio \u2014 I brought all of it with me. And I haven\u2019t looked back since.' },
]

const philosophy = [
  'The voice is more than just sound\u2014it\u2019s emotion, connection, and storytelling. Every script tells a story, and my job is to bring that story to life in a way that resonates with the audience. Whether it\u2019s selling a product, educating learners, or entertaining listeners, I approach each project with the same dedication: to deliver a performance that not only meets but exceeds expectations.',
  'In coaching, I believe everyone has a unique voice worth sharing. My role isn\u2019t to make you sound like me or anyone else\u2014it\u2019s to help you discover your authentic voice, refine your technique, and use it confidently to tell the stories only you can tell.',
]

export default function AboutPage() {
  return (
    <main>
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>Know more about <span className={s.heroTitleGold}>Erwin</span></h1>
      </section>

      {/* My Journey */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.blockTitle}>My Journey</h2>
          <div style={{ marginTop: 16 }}><Journey paragraphs={journey} /></div>
        </Reveal>
      </section>

      {/* Skills & Expertise */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>Skills & <span className="gold">Expertise</span></h2>
          <p className={s.headSub}>A versatile voice artist with expertise across multiple styles, genres, and coaching specialties.</p>
        </Reveal>
        <div className={s.skillsGrid}>
          {skills.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className={s.skillCard}>
                <div className={s.skillTitle}>{c.title}</div>
                <div className={s.skillTags}>{c.tags.map((t) => <span key={t} className={s.skillTag}>{t}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Experiences & Milestones */}
      <section className={`${s.section} container`}>
        <Reveal>
          <h2 className={s.headTitle}>Experiences & <span className="gold">Milestones</span></h2>
          <p className={s.headSub}>Numbers that tell the story of dedication, growth, and impact.</p>
        </Reveal>
        <div className={s.stats}>
          {stats.map((st) => (
            <div key={st.label}>
              <div className={s.statNum}>{st.num}</div>
              <div className={s.statLabel}>{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Career Highlights */}
      <section className={`${s.section} container`}>
        <Reveal><h2 className={s.blockTitle}>Career Highlights</h2></Reveal>
        <div className={s.highlights}>
          {highlights.map((h) => (
            <Reveal key={h.year}>
              <div className={s.hlItem}>
                <div className={s.hlYear}>{h.year}</div>
                <div>
                  <div className={s.hlTitle}>{h.title}</div>
                  <p className={s.hlText}>{h.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* My Philosophy */}
      <section className={`${s.section} container`}>
        <div className={s.philo}>
          <Reveal><div className={s.philoLabel}>My Philosophy</div></Reveal>
          <Reveal delay={80}>
            <div className={s.philoText}>
              {philosophy.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA */}
      <section className={`${s.finalCta} container`}>
        <Reveal>
          <h2 className={s.finalCtaTitle}>Want to work with someone who&rsquo;s passionate about the craft?</h2>
          <p className={s.finalCtaText}>
            Let&rsquo;s connect and create something exceptional together. Whether you need a voice for your project
            or coaching to develop your own, I&rsquo;m here to help.
          </p>
          <div className={s.finalCtaBtns}>
            <Link href="/contact" className="btn btnSolid">Get in Touch</Link>
            <Link href="/work" className="btn btnOutline">View My Work</Link>
          </div>
        </Reveal>
      </section>
    </main>
  )
}