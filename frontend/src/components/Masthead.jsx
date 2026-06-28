import { useState, useEffect } from 'react'

const NAV_ITEMS = ['Home', 'Analysis', 'Methodology', 'Comparisons', 'Citations', 'Archive']

export default function Masthead({ paperCount = 0, onToggleDark, isDark }) {
  const [date, setDate] = useState('')

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }))
  }, [])

  return (
    <header style={{ background: 'var(--color-paper)', borderBottom: '3px solid var(--color-ink)' }}>

      {/* Top metadata bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.35rem 1.5rem',
        borderBottom: '1px solid var(--color-rule)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-ink-light)' }}>
          Vol. I &nbsp;·&nbsp; No. 1 &nbsp;·&nbsp; {paperCount > 0 ? `${paperCount} Paper${paperCount > 1 ? 's' : ''} Analysed` : 'Research Intelligence'}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-ink-light)' }}>
          {date}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-ink-light)' }}>
            Est. 2025
          </span>
          <button
            onClick={onToggleDark}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-ink-light)',
              background: 'none',
              border: '1px solid var(--color-rule)',
              padding: '0.2rem 0.6rem',
              cursor: 'pointer',
            }}
          >
            {isDark ? '☀ Day' : '☾ Night'}
          </button>
        </div>
      </div>

      {/* Thick top rule */}
      <div style={{ borderTop: '3px solid var(--color-ink)', margin: '0' }} />

      {/* Masthead title */}
      <div style={{ textAlign: 'center', padding: '1.5rem 1.5rem 0.75rem' }}>
        {/* Kicker above title */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'var(--color-ink-light)',
          marginBottom: '0.5rem',
        }}>
          ✦ Research Intelligence · Academic Analysis · Citation Grounded ✦
        </p>

        {/* Main masthead nameplate */}
        <h1 style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: 'clamp(3rem, 10vw, 6.5rem)',
          lineHeight: 0.9,
          color: 'var(--color-ink)',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
        }}>
          Scholar Press
        </h1>

        {/* Subtitle line */}
        <p style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: '0.85rem',
          color: 'var(--color-ink-light)',
          letterSpacing: '0.04em',
          marginBottom: '0.6rem',
        }}>
          The Authoritative Journal of Multi-Paper Research Analysis
        </p>
      </div>

      {/* Double rule below nameplate */}
      <div style={{ margin: '0 1.5rem' }}>
        <div style={{ borderTop: '1px solid var(--color-ink)' }} />
        <div style={{ borderTop: '3px solid var(--color-ink)', marginTop: '3px' }} />
      </div>

      {/* Nav bar */}
      <nav style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.15rem',
        padding: '0.4rem 1.5rem',
      }}>
        {NAV_ITEMS.map((item, i) => (
          <span key={item} style={{ display: 'flex', alignItems: 'center' }}>
            <a
              href="#"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-ink-mid)',
                padding: '0.2rem 0.6rem',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--color-ink)'}
              onMouseLeave={e => e.target.style.color = 'var(--color-ink-mid)'}
            >
              {item}
            </a>
            {i < NAV_ITEMS.length - 1 && (
              <span style={{ color: 'var(--color-rule)', fontSize: '0.65rem' }}>|</span>
            )}
          </span>
        ))}
      </nav>

      {/* Double rule below nav */}
      <div style={{ margin: '0 1.5rem' }}>
        <div style={{ borderTop: '3px solid var(--color-ink)' }} />
        <div style={{ borderTop: '1px solid var(--color-ink)', marginTop: '3px' }} />
      </div>

      {/* Edition line */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.3rem 1.5rem',
        borderTop: '1px solid var(--color-rule)',
        background: 'var(--color-parchment-2)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)' }}>
          Price: Free to Scholars
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-ink-light)' }}>
          ★ Final Edition ★
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-ink-light)' }}>
          All Rights Reserved
        </span>
      </div>
    </header>
  )
}