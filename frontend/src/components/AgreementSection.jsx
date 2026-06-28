import { useState } from 'react'
import { motion } from 'framer-motion'
import CitationModal from './CitationModal'

export default function AgreementSection({ comparisons }) {
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState('all') // all | agree | disagree

  if (!comparisons?.length) return null

  const agrees = comparisons.filter(c => c.agreement === true || c.agreement === 'true')
  const disagrees = comparisons.filter(c => c.agreement === false || c.agreement === 'false')

  const filtered = filter === 'agree' ? agrees
    : filter === 'disagree' ? disagrees
    : comparisons

  return (
    <section className="px-6 py-4">
      <div className="section-rule" />
      <p className="eyebrow mb-2">Cross-Paper Intelligence</p>
      <h2 className="font-display text-3xl font-bold text-ink dark:text-dark-text mb-2">
        Where Papers Agree & Clash
      </h2>

      {/* Stats bar */}
      <div className="flex gap-6 mb-4 font-mono text-sm">
        <span className="text-agree">▲ {agrees.length} agreements</span>
        <span className="text-disagree">▼ {disagrees.length} conflicts</span>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 mb-6">
        {['all', 'agree', 'disagree'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-xs px-3 py-1.5 border transition-all ${
              filter === f
                ? 'bg-ink dark:bg-gold text-newsprint dark:text-ink border-ink dark:border-gold'
                : 'border-rule dark:border-dark-rule text-muted dark:text-gold hover:border-ink dark:hover:border-gold'
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((comp, i) => {
          const isAgree = comp.agreement === true || comp.agreement === 'true'
          return (
            <motion.div
              key={i}
              className={isAgree ? 'agree-card' : 'disagree-card'}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <span className={`font-mono text-xs uppercase tracking-wider ${isAgree ? 'text-agree' : 'text-disagree'}`}>
                  {isAgree ? '✓ Agreement' : '✗ Conflict'}
                </span>
                <span className="font-mono text-xs text-muted dark:text-gold">
                  #{String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Aspect headline */}
              <h3 className="font-display text-lg font-bold text-ink dark:text-dark-text mb-2">
                {comp.aspect}
              </h3>

              {/* Detail */}
              <p className="font-body text-sm text-ink dark:text-dark-text leading-relaxed mb-3">
                {comp.detail}
              </p>

              {/* Per-paper citations */}
              {comp.citations?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-rule dark:border-dark-rule">
                  {comp.citations.map(cit => (
                    <button
                      key={`${cit.paper_id}-${cit.chunk_index}`}
                      onClick={() => setModal({ chunkIndex: cit.chunk_index, paperId: cit.paper_id })}
                      className="font-mono text-xs px-2 py-1 border border-gold text-gold hover:bg-gold hover:text-ink transition-colors"
                    >
                      {cit.paper_id.slice(0, 12)}.. [{cit.chunk_index}]
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {modal && (
        <CitationModal
          chunkIndex={modal.chunkIndex}
          paperId={modal.paperId}
          onClose={() => setModal(null)}
        />
      )}

      <div className="section-rule mt-6" />
    </section>
  )
}
