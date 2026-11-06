import { NavLink } from 'react-router-dom'
import { Clapperboard, Compass, Radio, Video } from 'lucide-react'
import styles from './Sidebar.module.css'

const links = [
  { to: '/home', label: 'Home', icon: Compass },
  { to: '/live', label: 'Live', icon: Radio },
  { to: '/studio', label: 'Creator Studio', icon: Clapperboard },
]

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <NavLink className={styles.brand} to="/home" aria-label="StreamVibe home">
        <span className={styles.brandIcon}><Video size={21} /></span>
        <span>Stream<span className={styles.brandAccent}>Vibe</span></span>
      </NavLink>
      <p className={styles.sectionLabel}>Discover</p>
      <nav className={styles.navigation} aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles.sidebarNote}>Your next favorite stream is one click away.</div>
    </aside>
  )
}
