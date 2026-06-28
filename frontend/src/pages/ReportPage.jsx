import { useState } from 'react'
import { motion } from 'framer-motion'
import PapersStrip from '../components/PapersStrip'
import ComparisonTable from '../components/ComparisonTable'
import AgreementSection from '../components/AgreementSection'
import FlowchartView from '../components/FlowchartView'
import PaperDeepDive from '../components/PaperDeepDive'

const NAV = ['Overview', 'Comparison', 'Agreements', 'Flowcharts']

export default function ReportPage({ report, sessionId, onReset }) {
  const [active, setActive] = useState('Overview')
  const [selected, setSelected] = useState(null)
  const { papers = [], comparisons = [], methodologies = [], flowcharts = [] } = report

  const handleSelect = (paper) => {
    setSelected({ paper, methodology: methodologies.find(m => m.paper_id === paper.paper_id) })
  }

  return (
    <div style={{ background: 'var(--color-paper)', minHeight: '100vh' }}>

      {/* Breaking news banner */}
      <div style={{ background: 'var(--color-ink)', color: 'var(--color-parchment)', textAlign: 'center', padding: '0.4rem 1rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.9 }}>
          ✦ Analysis Complete &nbsp;·&nbsp; {papers.length} Papers Analysed &nbsp;·&nbsp; {comparisons.length} Comparison Points &nbsp;·&nbsp; Click any paper card for a deep dive ✦
        </p>
      </div>

      {/* Sticky nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--color-parchment-2)', borderBottom: '3px solid var(--color-ink)', borderTop: '1px solid var(--color-ink)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.1rem' }}>
          {NAV.map((s, i) => (
            <span key={s} style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => setActive(s)}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.35rem 0.85rem', border: 'none', cursor: 'pointer', background: active === s ? 'var(--color-ink)' : 'transparent', color: active === s ? 'var(--color-parchment)' : 'var(--color-ink-light)', transition: 'all 0.15s' }}
              >{s}</button>
              {i < NAV.length - 1 && <span style={{ color: 'var(--color-rule)', fontSize: '0.6rem' }}>|</span>}
            </span>
          ))}
        </div>
        <button
          onClick={onReset}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)', background: 'none', border: '1px solid var(--color-rule)', padding: '0.25rem 0.75rem', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-parchment)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-ink-light)' }}
        >← New Analysis</button>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>

        {active === 'Overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--color-rule)' }}>
              {[
                { label: 'Papers Analysed', value: papers.length },
                { label: 'Comparison Points', value: comparisons.length },
                { label: 'Methodology Steps', value: methodologies.reduce((a, m) => a + (m.methodology_steps?.length || 0), 0) },
              ].map((stat, i) => (
                <div key={stat.label} style={{ padding: '1.5rem', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--color-rule)' : 'none', background: i % 2 === 0 ? 'var(--color-parchment-2)' : 'transparent' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', fontWeight: 900, color: 'var(--color-ink)', lineHeight: 1 }}>{stat.value}</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginTop: '0.4rem' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            <PapersStrip papers={papers} onSelectPaper={handleSelect} />

            {comparisons.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-ink-light)', marginBottom: '0.5rem' }}>— Top Finding —</p>
                <div className={comparisons[0].agreement === true || comparisons[0].agreement === 'true' ? 'agree-card' : 'disagree-card'}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-ink)', marginBottom: '0.4rem' }}>{comparisons[0].aspect}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--color-ink-mid)' }}>{comparisons[0].detail}</p>
                </div>
                <button
                  onClick={() => setActive('Agreements')}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)', background: 'none', border: 'none', cursor: 'pointer', marginTop: '0.75rem', borderBottom: '1px solid var(--color-rule)' }}
                >View All {comparisons.length} Comparison Points →</button>
              </div>
            )}
          </motion.div>
        )}

        {active === 'Comparison' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ComparisonTable papers={papers} sessionId={sessionId} />
          </motion.div>
        )}

        {active === 'Agreements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <AgreementSection comparisons={comparisons} sessionId={sessionId} />
          </motion.div>
        )}

        {active === 'Flowcharts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FlowchartView flowcharts={flowcharts} methodologies={methodologies} />
          </motion.div>
        )}
      </div>

      {selected && (
        <PaperDeepDive
          paper={selected.paper}
          methodology={selected.methodology}
          sessionId={sessionId}
          onClose={() => setSelected(null)}
        />
      )}

      <footer style={{ borderTop: '4px double var(--color-ink)', background: 'var(--color-parchment-2)', padding: '0.75rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center', marginTop: '3rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--color-ink)' }}>Scholar Press</span>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-ink-light)', textAlign: 'center', lineHeight: 1.6 }}>Research Intelligence · All Rights Reserved · Established 2025</p>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)', textAlign: 'right' }}>Vol. I · No. 1</span>
      </footer>
    </div>
  )
}