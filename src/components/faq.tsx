'use client'
import { useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'

export type Faq = { q: string; a: string }

// Dark FAQ cards (fixed dark in both themes, per the design), expandable.
// Shows 4 on mobile with a Load More; desktop shows all.
export function FaqGrid({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  return (
    <>
      <div className="faqGrid">
        {items.map((item, i) => (
          <div key={i} className={`faqCard ${i >= 4 && !showAll ? 'faqHideMobile' : ''}`}>
            <button className="faqQ" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
              <span>{item.q}</span>
              <span className="faqChevron" data-open={open === i}><IconChevronDown size={18} stroke={1.75} /></span>
            </button>
            {open === i && <p className="faqA">{item.a}</p>}
          </div>
        ))}
      </div>
      {!showAll && (
        <div className="faqLoadMoreWrap">
          <button className="btn btnOutline" onClick={() => setShowAll(true)}>Load More</button>
        </div>
      )}
      <style>{`
        .faqGrid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 32px; }
        .faqCard { background: #141312; border: 1px solid #2A2926; border-radius: 14px; padding: 20px; }
        .faqQ { width: 100%; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
          background: none; border: none; color: #F5F4F1; font: inherit; font-size: 1.05rem; font-weight: 600;
          text-align: left; cursor: pointer; line-height: 1.3; }
        .faqChevron { flex-shrink: 0; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center;
          border-radius: 8px; background: #262522; color: #C9A24A; transition: transform 0.2s ease; }
        .faqChevron[data-open="true"] { transform: rotate(180deg); }
        .faqA { color: #B6B2A9; margin-top: 14px; font-size: 0.92rem; line-height: 1.6; }
        .faqLoadMoreWrap { display: flex; justify-content: center; margin-top: 24px; }
        @media (min-width: 560px) { .faqGrid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1040px) {
          .faqGrid { grid-template-columns: repeat(4, 1fr); }
          .faqHideMobile { display: block; }
          .faqLoadMoreWrap { display: none; }
        }
        @media (max-width: 1039px) { .faqHideMobile { display: none; } }
      `}</style>
    </>
  )
}