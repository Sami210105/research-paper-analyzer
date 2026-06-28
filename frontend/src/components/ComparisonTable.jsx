import { useState } from 'react'
import { motion } from 'framer-motion'
import CitationModal from './CitationModal'

const FIELDS = [
  { key: 'summary',     label: 'Summary',     citKey: 'summary_citations' },
  { key: 'methodology', label: 'Methodology', citKey: 'methodology_citations' },
  { key: 'dataset',     label: 'Dataset',     citKey: 'dataset_citations' },
  { key: 'results',     label: 'Results',     citKey: 'results_citations' },
  { key: 'limitations', label: 'Limitations', citKey: 'limitations_citations' },
]

export default function ComparisonTable({ papers }) {
  const [modal, setModal] = useState(null) // { chunkIndex, paperId }

  if (!papers?.length) return null

  return (
    <section className="px-6 py-4">
      <p className="eyebrow mb-2">Side-by-Side Analysis</p>
      <h2 className="font-display text-3xl font-bold text-ink dark:text-dark-text mb-4">
        Comparison Table
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-4 border-ink dark:border-dark-text">
              <th className="font-mono text-xs text-left py-3 pr-4 w-28 text-muted dark:text-gold uppercase tracking-wider">
                Aspect
              </th>
              {papers.map((p, i) => (
                <th key={p.paper_id} className="font-display text-sm font-bold text-left py-3 px-4 text-ink dark:text-dark-text border-l border-rule dark:border-dark-rule">
                  <span className="text-gold mr-1">#{String(i+1).padStart(2,'0')}</span>
                  {p.paper_id.replace(/-/g, ' ').replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {FIELDS.map((field, fi) => (
              <motion.tr
                key={field.key}
                className="border-b border-rule dark:border-dark-rule hover:bg-gold/5 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: fi * 0.08 }}
              >
                {/* Field label */}
                <td className="font-mono text-xs uppercase tracking-wider text-muted dark:text-gold py-4 pr-4 align-top">
                  {field.label}
                </td>

                {/* Value per paper */}
                {papers.map(paper => (
                  <td key={paper.paper_id} className="py-4 px-4 border-l border-rule dark:border-dark-rule align-top">
                    <p className="font-body text-sm text-ink dark:text-dark-text leading-relaxed">
                      {paper[field.key] || '—'}
                    </p>

                    {/* Citation badges */}
                    {paper[field.citKey]?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {paper[field.citKey].map(idx => (
                          <button
                            key={idx}
                            className="cite-sup px-1.5 py-0.5 border border-gold text-gold hover:bg-gold hover:text-ink text-xs font-mono transition-colors"
                            onClick={() => setModal({ chunkIndex: idx, paperId: paper.paper_id })}
                          >
                            [{idx}]
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <CitationModal
          chunkIndex={modal.chunkIndex}
          paperId={modal.paperId}
          onClose={() => setModal(null)}
        />
      )}
    </section>
  )
}
