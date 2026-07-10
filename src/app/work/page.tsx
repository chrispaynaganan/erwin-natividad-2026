import { CtaSection } from '@/components/cta-section'
import { ProjectsExplorer } from '@/components/projects-explorer'
import { getProjects, type Project } from '@/lib/projects'
import s from './work.module.css'

export const metadata = { title: 'Projects' }

// Builds the Quick Filters chip list from whatever tags actually exist across
// published projects, rather than a hardcoded array that can drift out of
// sync as tags are added/removed/renamed in Projects admin. Case-insensitive
// de-dupe (so "Action" and "action" on two different projects don't produce
// two separate chips) while preserving the first-seen casing for display.
function deriveCategories(projects: Project[]): string[] {
  const seen = new Map<string, string>()
  for (const p of projects) {
    for (const raw of p.tags) {
      const tag = raw.trim()
      const key = tag.toLowerCase()
      if (key && !seen.has(key)) seen.set(key, tag)
    }
  }
  const sorted = Array.from(seen.values()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  return ['All', ...sorted]
}

export default async function WorkPage() {
  const projects = await getProjects()
  const categories = deriveCategories(projects)

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