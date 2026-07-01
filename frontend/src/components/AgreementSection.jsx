import { useState } from 'react'
import { motion } from 'framer-motion'
import CitationModal from './CitationModal'

export default function AgreementSection({ comparisons, sessionId }) {
  const [modal, setModal] = useState(null)
  const [filter, setFilter] = useState('all')

  if (!comparisons?.length) return null

  const agrees = comparisons.filter(c => c.agreement === true || c.agreement === 'true')
  const disagrees = comparisons.filter(c => c.agreement === false || c.agreement === 'false')
  const filtered = filter === 'agree' ? agrees : filter === 'disagree' ? disagrees : comparisons

  return (
    <section style={{ padding: '1rem 0' }}>
      <div style={{ borderTop: '3px solid var(--color-ink)', marginBottom: '3px' }} />
      <div style={{ borderTop: '1px solid var(--color-ink)', marginBottom: '1.5rem' }} />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginBottom: '0.5rem' }}>
        Cross-Paper Intelligence
      </p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
        Where Papers Agree & Clash
      </h2>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--color-agree)' }}>▲ {agrees.length} agreements</span>
        <span style={{ color: 'var(--color-disagree)' }}>▼ {disagrees.length} conflicts</span>
      </div>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'agree', 'disagree'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.35rem 0.85rem',
              border: '1px solid var(--color-rule)',
              cursor: 'pointer',
              background: filter === f ? 'var(--color-ink)' : 'transparent',
              color: filter === f ? 'var(--color-parchment)' : 'var(--color-ink-light)',
              transition: 'all 0.15s',
            }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filtered.map((comp, i) => {
          const isAgree = comp.agreement === true || comp.agreement === 'true'
          return (
            <motion.div
              key={i}
              style={{
                borderLeft: `3px solid var(${isAgree ? '--color-agree' : '--color-disagree'})`,
                background: isAgree ? '#eaf3ec' : '#f5eaea',
                padding: '1rem',
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: isAgree ? 'var(--color-agree)' : 'var(--color-disagree)' }}>
                  {isAgree ? '✓ Agreement' : '✗ Conflict'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-ink-light)' }}>
                  #{String(i + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
                {comp.aspect}
              </h3>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-ink-mid)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                {comp.detail}
              </p>

              {comp.citations?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', paddingTop: '0.6rem', borderTop: '1px solid var(--color-rule-light)' }}>
                  {comp.citations.map(cit => (
                    <button
                      key={`${cit.paper_id}-${cit.chunk_index}`}
                      onClick={() => setModal({ chunkIndex: cit.chunk_index, paperId: cit.paper_id })}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', padding: '0.2rem 0.5rem', border: '1px solid var(--color-gold)', color: 'var(--color-gold)', background: 'none', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-gold)'; e.currentTarget.style.color = 'var(--color-ink)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-gold)' }}
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
          sessionId={sessionId}
          onClose={() => setModal(null)}
        />
      )}

      <div style={{ borderTop: '1px solid var(--color-ink)', marginTop: '2rem', marginBottom: '3px' }} />
      <div style={{ borderTop: '3px solid var(--color-ink)' }} />
    </section>
  )
}