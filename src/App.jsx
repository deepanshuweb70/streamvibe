import { Component, lazy, Suspense, useEffect, useState } from 'react'
import { Bell, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { useAppStore } from './store/useAppStore'
import styles from './App.module.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const WatchPage = lazy(() => import('./pages/WatchPage'))
const LivePage = lazy(() => import('./pages/LivePage'))
const StudioPage = lazy(() => import('./pages/StudioPage'))

class PageErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <main className={styles.page}><div className={styles.emptyState} role="alert"><h1>That page hit a snag</h1><p>Try opening it again, or head back to your stream.</p><Link className={styles.secondaryButton} to="/home">Back to Home</Link></div></main>
    }
    return this.props.children
  }
}

function App() {
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(searchQuery), 250)
    return () => window.clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className={styles.app} data-theme={theme}>
      <div className={styles.layout}>
        <Sidebar open={mobileNavOpen} onNavigate={() => setMobileNavOpen(false)} />
        <div className={styles.workspace}>
          <header className={styles.topbar}>
            <button className={styles.mobileMenu} type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}>{mobileNavOpen ? <X size={20} /> : <Menu size={20} />}</button>
            <label className={styles.searchWrap}>
              <Search className={styles.searchIcon} size={18} />
              <input
                className={styles.search}
                placeholder="Search videos, creators..."
                aria-label="Search videos"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value)
                  if (location.pathname !== '/home') navigate('/home')
                }}
              />
            </label>
            <div className={styles.actions}>
              <button className={styles.iconButton} type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button className={styles.iconButton} type="button" aria-label="Notifications"><Bell size={18} /></button>
              <button className={styles.avatar} type="button" onClick={() => navigate('/studio')} aria-label="Open creator studio">D</button>
            </div>
          </header>
          <PageErrorBoundary key={location.pathname}>
            <Suspense fallback={<main className={styles.page} aria-live="polite"><div className={styles.loadingState}><span /><span /><span /></div><p className={styles.subtitle}>Loading your stream…</p></main>}>
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage query={debouncedQuery} />} />
                <Route path="/watch/:id" element={<WatchPage />} />
                <Route path="/live" element={<LivePage />} />
                <Route path="/studio" element={<StudioPage />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </Suspense>
          </PageErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export default App
