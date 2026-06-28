import { useState, useEffect } from 'react'
import Masthead from './components/Masthead'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'
import LoadingScreen from './components/LoadingScreen'

const PAGES = { HOME: 'home', LOADING: 'loading', REPORT: 'report' }

export default function App() {
  const [page, setPage] = useState(PAGES.HOME)
  const [report, setReport] = useState(null)
  const [sessionId, setSessionId] = useState(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('scholar-dark')
    if (saved === 'true') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('scholar-dark', String(next))
      return next
    })
  }

  const handleReportReady = (data, sid) => {
    setReport(data)
    setSessionId(sid)
    setPage(PAGES.REPORT)
  }

  const handleReset = () => {
    setReport(null)
    setSessionId(null)
    setPage(PAGES.HOME)
  }

  const paperCount = report?.papers?.length || 0

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-paper)', transition: 'background 0.3s' }}>
      {page !== PAGES.LOADING && (
        <Masthead
          paperCount={paperCount}
          onToggleDark={toggleDark}
          isDark={isDark}
        />
      )}

      {page === PAGES.HOME && (
        <HomePage
          onReportReady={handleReportReady}
          onLoadingStart={() => setPage(PAGES.LOADING)}
        />
      )}

      {page === PAGES.LOADING && <LoadingScreen />}

      {page === PAGES.REPORT && report && (
        <ReportPage
          report={report}
          sessionId={sessionId}
          onReset={handleReset}
        />
      )}
    </div>
  )
}