import { lazy, Suspense } from 'react'
import { Bell, Moon, Search, Sun } from 'lucide-react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import { useAppStore } from './store/useAppStore'
import styles from './App.module.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const WatchPage = lazy(() => import('./pages/WatchPage'))
const LivePage = lazy(() => import('./pages/LivePage'))
const StudioPage = lazy(() => import('./pages/StudioPage'))

function App() {
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const navigate = useNavigate()

  return (
    <div className={styles.app} data-theme={theme}>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.workspace}>
          <header className={styles.topbar}>
            <label className={styles.searchWrap}>
              <Search className={styles.searchIcon} size={18} />
              <input className={styles.search} placeholder="Search videos, creators..." aria-label="Search videos" />
            </label>
            <div className={styles.actions}>
              <button className={styles.iconButton} type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button className={styles.iconButton} type="button" aria-label="Notifications"><Bell size={18} /></button>
              <button className={styles.avatar} type="button" onClick={() => navigate('/studio')} aria-label="Open creator studio">D</button>
            </div>
          </header>
          <Suspense fallback={<main className={styles.page} aria-live="polite"><p className={styles.subtitle}>Loading StreamVibe…</p></main>}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/watch/:id" element={<WatchPage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/studio" element={<StudioPage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default App
