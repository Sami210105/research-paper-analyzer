import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CitationModal from './CitationModal'

export default function PaperDeepDive({ paper, methodology, sessionId, onClose }) {
  const [modal, setModal] = useState(null)

  if (!paper) return null

  return (
    <AnimatePresence>
      <motion.div
        style={{ position: 'fixed', inset: 0, background: 'var(--color-paper)', zIndex: 40, overflowY: 'auto' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div style={{ position: 'sticky', top: 0, background: 'var(--color-paper)', borderBottom: '4px double var(--color-ink)', padding: '0.75rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-ink-light)' }}>
              Paper Deep Dive
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-ink)', lineHeight: 1.2 }}>
              {paper.paper_id.replace(/-/g, ' ').replace(/_/g, ' ')}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-light)', background: 'none', border: '1px solid var(--color-rule)', padding: '0.35rem 0.85rem', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-parchment)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-ink-light)' }}
          >
            ← Back to Report
          </button>
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>

          {/* At a Glance */}
          <section style={{ marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginBottom: '0.75rem' }}>
              At a Glance
            </p>
            <div style={{ borderLeft: '3px solid var(--color-gold)', paddingLeft: '1.25rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-ink)', lineHeight: 1.75 }}>
                {paper.summary}
              </p>
              {paper.summary_citations?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {paper.summary_citations.map(idx => (
                    <button
                      key={idx}
                      onClick={() => setModal({ chunkIndex: idx })}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', padding: '0.1rem 0.4rem', background: 'none', cursor: 'pointer' }}
                    >
                      [{idx}]
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div style={{ borderTop: '1px solid var(--color-rule)', margin: '1.5rem 0' }} />

          {/* Key facts grid */}
          <section style={{ marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginBottom: '1rem' }}>
              Key Facts
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Methodology', value: paper.methodology, citations: paper.methodology_citations },
                { label: 'Dataset',     value: paper.dataset,     citations: paper.dataset_citations },
                { label: 'Results',     value: paper.results,     citations: paper.results_citations },
                { label: 'Limitations', value: paper.limitations, citations: paper.limitations_citations },
              ].map(item => (
                <div key={item.label} style={{ border: '1px solid var(--color-rule)', padding: '0.85rem', background: 'var(--color-parchment-2)' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginBottom: '0.4rem' }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-ink)', lineHeight: 1.6 }}>
                    {item.value || '—'}
                  </p>
                  {item.citations?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {item.citations.map(idx => (
                        <button
                          key={idx}
                          onClick={() => setModal({ chunkIndex: idx })}
                          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-gold)', border: '1px solid var(--color-gold)', padding: '0.1rem 0.4rem', background: 'none', cursor: 'pointer' }}
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

          <div style={{ borderTop: '1px solid var(--color-rule)', margin: '1.5rem 0' }} />

          {/* Methodology steps */}
          {methodology?.methodology_steps?.length > 0 && (
            <section>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginBottom: '0.4rem' }}>
                How It Works — Step by Step
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--color-ink-light)', marginBottom: '1.5rem' }}>
                No jargon. Here's what this paper actually did, in plain language.
              </p>

              <div>
                {methodology.methodology_steps.map((step, i) => (
                  <motion.div
                    key={step.step}
                    style={{ display: 'flex', gap: '1rem', position: 'relative', paddingBottom: '1.5rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    {i < methodology.methodology_steps.length - 1 && (
                      <div style={{ position: 'absolute', left: 15, top: 32, bottom: 0, width: 1, borderLeft: '1px dashed var(--color-rule)' }} />
                    )}
                    <div style={{ flexShrink: 0, width: 32, height: 32, background: 'var(--color-ink)', color: 'var(--color-parchment)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                      {step.step}
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-ink)', marginBottom: '0.25rem' }}>
                        {step.title}
                      </h4>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-ink-mid)', lineHeight: 1.6 }}>
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
            sessionId={sessionId}
            onClose={() => setModal(null)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}