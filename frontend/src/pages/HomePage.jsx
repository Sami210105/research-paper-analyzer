import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSession, uploadPapers, generateReport } from '../api/client'

const HERO_IMG = 'https://picsum.photos/seed/scholarly/1200/500?grayscale'

export default function HomePage({ onReportReady, onLoadingStart }) {
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.pdf'))
    if (dropped.length) setFiles(prev => [...prev, ...dropped])
  }

  const handleChange = (e) => {
    const selected = Array.from(e.target.files)
    if (selected.length) setFiles(prev => [...prev, ...selected])
  }

  const handleRemove = (name) => setFiles(f => f.filter(x => x.name !== name))

  const handleSubmit = async () => {
    if (!files.length) return
    setError(null)
    onLoadingStart()
    try {
      const sessionRes = await createSession()
      const sessionId = sessionRes.data.session_id
      await uploadPapers(sessionId, files)
      const res = await generateReport(sessionId)
      onReportReady(res.data.report, sessionId)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Analysis failed. Ensure the backend is running.')
    }
  }

  return (
    <main style={{ background: 'var(--color-paper)', minHeight: '100vh' }}>

      {/* BREAKING NEWS TICKER */}
      <div style={{
        background: 'var(--color-ink)', color: 'var(--color-parchment)',
        padding: '0.3rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', overflow: 'hidden',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', whiteSpace: 'nowrap', background: 'var(--color-gold)', color: 'var(--color-ink)', padding: '0.1rem 0.5rem', flexShrink: 0 }}>
          Latest
        </span>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-parchment)', opacity: 0.85 }}>
          Upload your research PDFs below for full cross-paper analysis, citations, methodology flowcharts and agreement detection
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* HERO HEADLINE */}
        <section style={{ padding: '2rem 0 0' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-ink-light)', textAlign: 'center', marginBottom: '0.6rem' }}>
            — Special Research Edition —
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.15, color: 'var(--color-ink)', textAlign: 'center', maxWidth: 700, margin: '0 auto 0.5rem' }}>
            Unlock the Intelligence Hidden Across Your Research Papers
          </h2>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--color-ink-mid)', textAlign: 'center', maxWidth: 600, margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
            Scholar Press analyses multiple PDFs simultaneously, surfaces agreements and conflicts, traces every claim to its source, and maps each paper's methodology into a readable flowchart.
          </p>
          <div style={{ borderTop: '3px solid var(--color-ink)', marginBottom: '3px' }} />
          <div style={{ borderTop: '1px solid var(--color-ink)', marginBottom: '1.25rem' }} />
        </section>

        {/* HERO IMAGE */}
        <section style={{ marginBottom: '0.5rem' }}>
          <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--color-rule)' }}>
            <img
              src={HERO_IMG}
              alt="Research papers spread across a desk"
              style={{ width: '100%', height: 'clamp(200px, 38vw, 420px)', objectFit: 'cover', display: 'block', filter: 'grayscale(55%) sepia(25%) contrast(1.1) brightness(0.88)' }}
            />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(28,18,8,0.72))', padding: '2rem 1.25rem 0.75rem' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: '0.78rem', color: 'rgba(232,220,190,0.9)', lineHeight: 1.4 }}>
                Scholar Press ingests your PDFs, fragments them into indexed chunks, and applies AI analysis to surface cross-paper intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* THREE-COLUMN FEATURES */}
        <section style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ borderTop: '3px solid var(--color-ink)', marginBottom: '3px' }} />
          <div style={{ borderTop: '1px solid var(--color-ink)', marginBottom: '1.25rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', borderLeft: '1px solid var(--color-rule-light)' }}>
            {[
              { number: 'I.', heading: 'Side-by-Side Comparison', body: 'Every paper\'s summary, methodology, dataset, results, and limitations placed in a single table. Differences emerge at a glance without toggling between tabs or PDFs.' },
              { number: 'II.', heading: 'Agreement & Conflict Detection', body: 'Scholar Press identifies where papers reinforce each other\'s findings and where they diverge — flagging each point with its exact supporting passage from the original text.' },
              { number: 'III.', heading: 'Methodology Flowcharts', body: 'Each paper\'s research pipeline rendered as a visual flowchart with a plain-language step-by-step breakdown. No jargon — just what the paper actually did.' },
            ].map((col, i) => (
              <div key={i} style={{ padding: '1rem 1.25rem', borderRight: '1px solid var(--color-rule-light)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', color: 'var(--color-ink)', lineHeight: 1, marginBottom: '0.4rem' }}>{col.number}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink)', marginBottom: '0.6rem', lineHeight: 1.3 }}>{col.heading}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-ink-mid)', lineHeight: 1.7 }}>{col.body}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--color-ink)', marginTop: '3px' }} />
          <div style={{ borderTop: '3px solid var(--color-ink)', marginTop: '3px', marginBottom: '2rem' }} />
        </section>

        {/* UPLOAD ZONE */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginBottom: '0.75rem' }}>
                — Submit for Analysis —
              </p>

              <motion.div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                whileHover={{ scale: 1.005 }}
                style={{
                  border: dragging ? '3px dashed var(--color-gold)' : '3px dashed var(--color-rule)',
                  background: dragging ? 'rgba(139,105,20,0.06)' : 'var(--color-parchment-2)',
                  padding: '2.5rem 2rem', textAlign: 'center', cursor: 'pointer',
                  transition: 'all 0.2s', position: 'relative',
                }}
              >
                <input ref={inputRef} type="file" multiple accept=".pdf" style={{ display: 'none' }} onChange={handleChange} />
                <div style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1 }}>{dragging ? '📰' : '📄'}</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', color: 'var(--color-ink)', marginBottom: '0.5rem', lineHeight: 1.25 }}>
                  Drop Your Research Papers Here
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-ink-light)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  Accepts PDF files · Up to 50 papers · Drag & drop or click to browse
                </p>
                {[{t:6,l:8},{t:6,r:8},{b:6,l:8},{b:6,r:8}].map((pos, i) => (
                  <span key={i} style={{ position: 'absolute', ...pos, fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--color-ink-light)', lineHeight: 1 }}>✦</span>
                ))}
              </motion.div>

              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    style={{ marginTop: '1rem', border: '1px solid var(--color-rule)', background: 'var(--color-paper-2)' }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div style={{ borderBottom: '3px solid var(--color-ink)', padding: '0.5rem 1rem', background: 'var(--color-parchment-2)' }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-ink)' }}>
                        Table of Contents — {files.length} Paper{files.length > 1 ? 's' : ''} Queued
                      </p>
                    </div>

                    {files.map((file, i) => (
                      <motion.div
                        key={file.name}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 1rem', borderBottom: '1px solid var(--color-rule-light)' }}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-gold)', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {file.name.replace('.pdf', '')}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-ink-light)' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                          <button onClick={() => handleRemove(file.name)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--color-ink-light)', background: 'none', border: 'none', cursor: 'pointer' }}>
                            [×]
                          </button>
                        </div>
                      </motion.div>
                    ))}

                    <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--color-rule)' }}>
                      <button
                        onClick={handleSubmit}
                        style={{ width: '100%', background: 'var(--color-ink)', color: 'var(--color-parchment)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.75rem 1.5rem', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >
                        ✦ Run Analysis — Go to Press ✦
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-disagree)', marginTop: '0.75rem', padding: '0.5rem', border: '1px solid var(--color-disagree)' }}>
                  ⚠ {error}
                </p>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              <div style={{ border: '1px solid var(--color-rule)', padding: '1rem', background: 'var(--color-parchment-2)' }}>
                <div style={{ borderTop: '3px solid var(--color-ink)', marginBottom: '3px' }} />
                <div style={{ borderTop: '1px solid var(--color-ink)', marginBottom: '1rem' }} />
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-ink)', textAlign: 'center', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  How It Works
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.72rem', color: 'var(--color-ink-light)', textAlign: 'center', marginBottom: '1rem' }}>
                  From Upload to Intelligence in Four Steps
                </p>
                <div style={{ borderBottom: '1px solid var(--color-rule)', marginBottom: '1rem' }} />

                {[
                  { n: '1', title: 'Upload PDFs', desc: 'Drop up to 50 research papers. Any field, any format.' },
                  { n: '2', title: 'AI Ingestion', desc: 'Papers are chunked and embedded into a searchable vector index.' },
                  { n: '3', title: 'Deep Analysis', desc: 'Cross-paper comparison, agreement detection, and methodology tracing.' },
                  { n: '4', title: 'Your Report', desc: 'A full Scholar Press edition with citations grounded in source text.' },
                ].map((step, i, arr) => (
                  <div key={step.n} style={{ marginBottom: i < arr.length - 1 ? '1rem' : 0 }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div style={{ flexShrink: 0, width: 24, height: 24, background: 'var(--color-ink)', color: 'var(--color-parchment)', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {step.n}
                      </div>
                      <div>
                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-ink)', marginBottom: '0.15rem' }}>{step.title}</p>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--color-ink-mid)', lineHeight: 1.55 }}>{step.desc}</p>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ marginLeft: 12, marginTop: '0.5rem', marginBottom: '0.5rem', borderLeft: '1px dashed var(--color-rule)', height: 16 }} />
                    )}
                  </div>
                ))}

                <div style={{ borderTop: '1px solid var(--color-rule)', marginTop: '1rem', paddingTop: '0.75rem' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)', textAlign: 'center' }}>
                    Powered by Gemini · FAISS · FastAPI
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--color-ink)', marginTop: '0.5rem' }} />
                <div style={{ borderTop: '3px solid var(--color-ink)', marginTop: '3px' }} />
              </div>
            </aside>
          </div>
        </section>
      </div>

      <footer style={{ borderTop: '4px double var(--color-ink)', background: 'var(--color-parchment-2)', padding: '0.75rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--color-ink)' }}>Scholar Press</span>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-light)', textAlign: 'center', lineHeight: 1.6 }}>Research Intelligence · All Rights Reserved · Established 2025</p>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)', textAlign: 'right' }}>Vol. I · No. 1</span>
      </footer>
    </main>
  )
}