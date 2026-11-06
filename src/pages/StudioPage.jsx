import { Clapperboard } from 'lucide-react'
import styles from '../App.module.css'

export default function StudioPage() {
  return <main className={styles.page}><p className={styles.eyebrow}>Creator tools</p><h1 className={styles.title}>Creator Studio</h1><p className={styles.subtitle}>Manage your videos, track your audience, and plan your next stream.</p><div className={styles.featureCard} style={{ minHeight: 320 }}><Clapperboard size={48} /><span>Your creator dashboard is coming together</span></div></main>
}
