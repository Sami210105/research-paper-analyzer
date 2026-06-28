import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getChunk } from '../api/client'

export default function CitationModal({ chunkIndex, paperId, sessionId, onClose }) {
  const [chunk, setChunk] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (chunkIndex == null || !sessionId) return
    setLoading(true)
    getChunk(sessionId, chunkIndex)
      .then(r => { setChunk(r.data); setLoading(false) })
      .catch(() => { setError('Could not load source chunk.'); setLoading(false) })
  }, [chunkIndex, sessionId])

  return (
    <AnimatePresence>
      <motion.div
        style={{ position: 'fixed', inset: 0, background: 'rgba(28,18,8,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={{ background: 'var(--color-paper)', maxWidth: 520, width: '100%', border: '4px double var(--color-ink)' }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ borderBottom: '3px solid var(--color-ink)', padding: '0.75rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-ink-light)' }}>
                Source Citation
              </p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-ink)' }}>
                Chunk #{chunkIndex}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--color-ink-light)', background: 'none', border: '1px solid var(--color-rule)', padding: '0.25rem 0.6rem', cursor: 'pointer' }}
            >
              [CLOSE]
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '1.25rem' }}>
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[100, 83, 66].map(w => (
                  <div key={w} className="skeleton" style={{ height: 14, width: `${w}%`, borderRadius: 2 }} />
                ))}
              </div>
            )}

            {error && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-disagree)' }}>
                {error}
              </p>
            )}

            {chunk && (
              <div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginBottom: '0.75rem' }}>
                  From: {chunk.paper_id}
                </p>
                <blockquote style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-ink)', lineHeight: 1.7, borderLeft: '3px solid var(--color-gold)', paddingLeft: '1rem', fontStyle: 'italic' }}>
                  "{chunk.text}"
                </blockquote>
              </div>
            )}
          </div>

          <div style={{ padding: '0 1.25rem 1rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-ink-light)', letterSpacing: '0.06em' }}>
              This is the exact text the analysis was grounded in.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}