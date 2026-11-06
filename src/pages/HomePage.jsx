import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import styles from '../App.module.css'

const videos = [
  { id: 'aurora', title: 'Chasing the Northern Lights in Iceland', creator: 'Maya Chen', views: '128K views · 2 hours ago', color: 'aurora' },
  { id: 'studio', title: 'Building a cozy creative studio', creator: 'Frame by Frame', views: '64K views · 5 hours ago', color: 'studio' },
  { id: 'jazz', title: 'Sunday jazz cafe - live mix', creator: 'Vinyl Hours', views: 'Live now · 2.4K watching', color: 'jazz' },
]

export default function HomePage() {
  return <main className={styles.page}>
    <p className={styles.eyebrow}>Your daily stream</p>
    <h1 className={styles.title}>Find your next favorite.</h1>
    <p className={styles.subtitle}>Fresh creators, live moments, and stories picked for you.</p>
    <section className={styles.welcome}>
      <div><p className={styles.eyebrow}>Featured today</p><h2>Make room for a little inspiration.</h2><p>Explore thoughtful stories and live sessions from creators around the world.</p></div>
      <div className={styles.featureCard} aria-hidden="true"><Play /></div>
    </section>
    <section aria-labelledby="recommendations-title">
      <div className={styles.sectionHeading}><h3 id="recommendations-title">Recommended for you</h3><span>Curated picks</span></div>
      <div className={styles.videoGrid}>
        {videos.map((video) => <Link key={video.id} to={`/watch/${video.id}`} className={styles.videoCard}>
          <div className={`${styles.thumbnail} ${styles[video.color]}`}><Play size={34} fill="currentColor" /></div>
          <div className={styles.videoInfo}><strong>{video.title}</strong><span>{video.creator}</span><span>{video.views}</span></div>
        </Link>)}
      </div>
    </section>
  </main>
}
