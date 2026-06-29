import { CtaSection } from '@/components/cta-section'
import { ProjectsExplorer } from '@/components/projects-explorer'
import { projects } from '@/lib/projects'
import s from './work.module.css'

export const metadata = { title: 'Projects' }

const categories = ['All', 'Action', 'Advertising', 'Audiobook', 'Commercial', 'Conversational', 'Documentary', 'Explainer', 'Fiction', 'Narration', 'Radio', 'eLearning']

export default function WorkPage() {
  return (
    <main>
      <section className={`${s.hero} container`}>
        <h1 className={s.heroTitle}>My<span className={s.heroTitleGold}>Works</span></h1>
        <p className={s.heroBody}>
          A collection of voice over demos and past projects across various genres and industries.
          Listen, explore, and discover the versatility of professional voice work.
        </p>
      </section>

      <section className="container" style={{ paddingBottom: 64 }}>
        <ProjectsExplorer projects={projects} categories={categories} />
      </section>

      <CtaSection />
    </main>
  )
}