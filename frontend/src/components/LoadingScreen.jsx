import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const HEADLINES = [
  'Ingesting research papers...',
  'Extracting key methodologies...',
  'Running cross-paper comparison...',
  'Generating methodology flowcharts...',
  'Grounding citations to source chunks...',
  'Assembling the final edition...',
]

export default function LoadingScreen() {
  const [idx, setIdx] = useState(0)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const hi = setInterval(() => setIdx(i => (i + 1) % HEADLINES.length), 3000)
    const di = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400)
    return () => { clearInterval(hi); clearInterval(di) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-paper)',
      padding: '2rem',
    }}>
      <motion.div
        style={{ fontSize: '3.5rem', marginBottom: '2rem', lineHeight: 1 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        📰
      </motion.div>

      <div style={{
        maxWidth: 460,
        width: '100%',
        textAlign: 'center',
        background: 'var(--color-parchment-2)',
        border: '1px solid var(--color-rule)',
        padding: '2.5rem',
        position: 'relative',
      }}>
        {/* Ornamental corners */}
        {[{t:8,l:8},{t:8,r:8},{b:8,l:8},{b:8,r:8}].map((pos, i) => (
          <span key={i} style={{ position: 'absolute', ...pos, fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--color-ink-light)', lineHeight: 1 }}>✦</span>
        ))}

        <div style={{ borderTop: '3px solid var(--color-ink)', marginBottom: '3px' }} />
        <div style={{ borderTop: '1px solid var(--color-ink)', marginBottom: '1.5rem' }} />

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginBottom: '1rem' }}>
          — Press in Progress —
        </p>

        <AnimatePresence mode="wait">
          <motion.h2
            key={idx}
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontStyle: 'italic', fontSize: '1.4rem', color: 'var(--color-ink)', lineHeight: 1.3, marginBottom: '1.5rem' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            {HEADLINES[idx]}{dots}
          </motion.h2>
        </AnimatePresence>

        <div style={{ height: '2px', background: 'var(--color-rule-light)', overflow: 'hidden', marginBottom: '1rem' }}>
          <motion.div
            style={{ height: '100%', background: 'var(--color-ink)' }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--color-ink-light)', letterSpacing: '0.08em' }}>
          This may take 30–60 seconds. The press never sleeps.
        </p>

        <div style={{ borderBottom: '1px solid var(--color-ink)', marginTop: '1.5rem', marginBottom: '3px' }} />
        <div style={{ borderBottom: '3px solid var(--color-ink)' }} />
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
        {HEADLINES.map((_, i) => (
          <motion.div
            key={i}
            style={{
              height: 5,
              borderRadius: 2.5,
              background: i === idx ? 'var(--color-ink)' : 'var(--color-rule)',
              transition: 'all 0.3s',
            }}
            animate={{ width: i === idx ? 22 : 5 }}
          />
        ))}
      </div>
    </div>
  )
}