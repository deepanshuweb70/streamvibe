import { useParams } from 'react-router-dom'
import { Play } from 'lucide-react'
import styles from '../App.module.css'

export default function WatchPage() {
  const { id } = useParams()
  return <main className={styles.page}><p className={styles.eyebrow}>Now watching</p><h1 className={styles.title}>Video: {id}</h1><p className={styles.subtitle}>The custom video player and related videos will be built in the next milestone.</p><div className={styles.featureCard} style={{ minHeight: 380 }}><Play size={54} /></div></main>
}
