import { Radio } from 'lucide-react'
import styles from '../App.module.css'

export default function LivePage() {
  return <main className={styles.page}><p className={styles.eyebrow}>Live now</p><h1 className={styles.title}>Live streams</h1><p className={styles.subtitle}>Join a conversation and catch a moment as it happens.</p><div className={styles.featureCard} style={{ minHeight: 320 }}><Radio size={48} /><span>Live chat arrives in the next milestone</span></div></main>
}
