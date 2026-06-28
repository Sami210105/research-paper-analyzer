import { motion } from 'framer-motion'

const PLACEHOLDER = (seed) => `https://picsum.photos/seed/${seed}/300/180?grayscale`

export default function PapersStrip({ papers, onSelectPaper }) {
  return (
    <section style={{ padding: '1.5rem 0' }}>
      <div style={{ borderTop: '3px solid var(--color-ink)', marginBottom: '3px' }} />
      <div style={{ borderTop: '1px solid var(--color-ink)', marginBottom: '1rem' }} />

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginBottom: '1rem' }}>
        — Today's Papers —
      </p>

      <div style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '0.75rem' }}>
        {papers.map((paper, i) => (
          <motion.div
            key={paper.paper_id}
            style={{
              minWidth: 220,
              maxWidth: 220,
              flexShrink: 0,
              border: '1px solid var(--color-rule)',
              background: 'var(--color-parchment-2)',
              cursor: 'pointer',
              padding: '0',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: '3px 6px 18px rgba(28,18,8,0.15)' }}
            onClick={() => onSelectPaper(paper)}
          >
            <img
              src={PLACEHOLDER(`paper-${i}`)}
              alt=""
              style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block', filter: 'grayscale(60%) sepia(20%) contrast(1.1) brightness(0.88)' }}
            />
            <div style={{ padding: '0.75rem', borderTop: '3px solid var(--color-ink)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', background: 'var(--color-ink)', color: 'var(--color-parchment)', padding: '1px 6px' }}>
                  #{String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', color: 'var(--color-ink-light)', textTransform: 'uppercase' }}>paper</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.3, color: 'var(--color-ink)', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {paper.paper_id.replace(/-/g, ' ').replace(/_/g, ' ')}
              </h3>
              <div style={{ borderTop: '1px solid var(--color-rule-light)', margin: '0.5rem 0' }} />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--color-ink-light)', lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {paper.summary}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink)', marginTop: '0.6rem', borderBottom: '1px solid var(--color-ink)', display: 'inline-block', paddingBottom: '1px' }}>
                Read Full Brief →
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--color-ink)', marginTop: '1.5rem', marginBottom: '3px' }} />
      <div style={{ borderTop: '3px solid var(--color-ink)' }} />
    </section>
  )
}