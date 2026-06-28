import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CitationModal from './CitationModal'

export default function PaperDeepDive({ paper, methodology, onClose }) {
  const [modal, setModal] = useState(null)

  if (!paper) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-newsprint dark:bg-dark-bg z-40 overflow-y-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-newsprint dark:bg-dark-bg border-b-4 border-double border-ink dark:border-dark-text px-6 py-3 flex justify-between items-center z-10">
          <div>
            <p className="eyebrow">Paper Deep Dive</p>
            <h2 className="font-display text-xl font-bold text-ink dark:text-dark-text leading-tight">
              {paper.paper_id.replace(/-/g, ' ').replace(/_/g, ' ')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost"
          >
            ← BACK TO REPORT
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 space-y-10">

          {/* At a Glance — 3 bullet summary */}
          <section>
            <p className="eyebrow mb-3">At a Glance</p>
            <div className="border-l-4 border-gold pl-6">
              <p className="drop-cap font-body text-base text-ink dark:text-dark-text leading-relaxed">
                {paper.summary}
              </p>
              {paper.summary_citations?.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {paper.summary_citations.map(idx => (
                    <button
                      key={idx}
                      onClick={() => setModal({ chunkIndex: idx })}
                      className="cite-sup border border-gold px-1.5 py-0.5 hover:bg-gold hover:text-ink transition-colors"
                    >
                      [{idx}]
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className="section-rule-thin" />

          {/* Key fields grid */}
          <section>
            <p className="eyebrow mb-4">Key Facts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Methodology', value: paper.methodology, citations: paper.methodology_citations },
                { label: 'Dataset',     value: paper.dataset,     citations: paper.dataset_citations },
                { label: 'Results',     value: paper.results,     citations: paper.results_citations },
                { label: 'Limitations', value: paper.limitations, citations: paper.limitations_citations },
              ].map(item => (
                <div key={item.label} className="news-card">
                  <p className="eyebrow mb-1">{item.label}</p>
                  <p className="font-body text-sm text-ink dark:text-dark-text leading-relaxed">
                    {item.value || '—'}
                  </p>
                  {item.citations?.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-2">
                      {item.citations.map(idx => (
                        <button
                          key={idx}
                          onClick={() => setModal({ chunkIndex: idx })}
                          className="cite-sup border border-gold px-1 py-0.5 text-xs hover:bg-gold hover:text-ink transition-colors font-mono"
                        >
                          [{idx}]
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="section-rule-thin" />

          {/* Methodology steps */}
          {methodology?.methodology_steps?.length > 0 && (
            <section>
              <p className="eyebrow mb-4">How It Works — Step by Step</p>
              <p className="font-body text-sm text-muted dark:text-gold italic mb-6">
                No jargon. Here's what this paper actually did, in plain language.
              </p>

              <div className="space-y-0">
                {methodology.methodology_steps.map((step, i) => (
                  <motion.div
                    key={step.step}
                    className="flex gap-4 relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {/* Vertical connector line */}
                    {i < methodology.methodology_steps.length - 1 && (
                      <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-rule dark:bg-dark-rule" />
                    )}

                    {/* Step badge */}
                    <div className="flex-shrink-0 w-8 h-8 bg-ink dark:bg-gold text-newsprint dark:text-ink font-display font-black text-sm flex items-center justify-center z-10">
                      {step.step}
                    </div>

                    {/* Content */}
                    <div className="pb-6">
                      <h4 className="font-display text-base font-bold text-ink dark:text-dark-text mb-1">
                        {step.title}
                      </h4>
                      <p className="font-body text-sm text-muted dark:text-gold leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>

        {modal && (
          <CitationModal
            chunkIndex={modal.chunkIndex}
            paperId={paper.paper_id}
            onClose={() => setModal(null)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
