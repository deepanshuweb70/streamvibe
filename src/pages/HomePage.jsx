import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Radio } from 'lucide-react'
import styles from '../App.module.css'

const videos = [
  { id: 'aurora', title: 'Chasing the Northern Lights in Iceland', creator: 'Maya Chen', views: '128K views · 2 hours ago', color: 'aurora', category: 'Travel', duration: '18:42' },
  { id: 'studio', title: 'Building a cozy creative studio', creator: 'Frame by Frame', views: '64K views · 5 hours ago', color: 'studio', category: 'Design', duration: '12:08' },
  { id: 'jazz', title: 'Sunday jazz cafe — live mix', creator: 'Vinyl Hours', views: 'Live now · 2.4K watching', color: 'jazz', category: 'Music', live: true },
  { id: 'recipe', title: 'A slow morning and the perfect pancakes', creator: 'Sofia Cooks', views: '42K views · yesterday', color: 'recipe', category: 'Lifestyle', duration: '09:31' },
  { id: 'ocean', title: 'Beneath the blue: a quiet ocean film', creator: 'Open Water', views: '91K views · 2 days ago', color: 'ocean', category: 'Travel', duration: '21:16' },
  { id: 'sketch', title: 'One sketch a day changed my practice', creator: 'Niko Draws', views: '37K views · 3 days ago', color: 'sketch', category: 'Design', duration: '14:05' },
]
const categories = ['For you', 'Music', 'Travel', 'Design', 'Lifestyle']

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('For you')
  const visibleVideos = activeCategory === 'For you'
    ? videos
    : videos.filter((video) => video.category === activeCategory)

  return <main className={styles.page}>
    <p className={styles.eyebrow}>Your daily stream</p>
    <h1 className={styles.title}>Find your next favorite.</h1>
    <p className={styles.subtitle}>Fresh creators, live moments, and stories picked for you.</p>
    <section className={styles.welcome}>
      <div><p className={styles.eyebrow}>Featured today</p><h2>Make room for a little inspiration.</h2><p>Explore thoughtful stories and live sessions from creators around the world.</p></div>
      <Link to="/watch/aurora" className={styles.featureCard} aria-label="Play today's featured story"><Play /></Link>
    </section>
    <section aria-labelledby="recommendations-title">
      <div className={styles.sectionHeading}><div><h3 id="recommendations-title">Recommended for you</h3><p className={styles.sectionNote}>Stories worth settling in for.</p></div><span>{visibleVideos.length} videos</span></div>
      <div className={styles.categoryList} aria-label="Filter videos by category">
        {categories.map((category) => <button
          key={category}
          type="button"
          className={`${styles.categoryButton} ${activeCategory === category ? styles.categoryActive : ''}`}
          aria-pressed={activeCategory === category}
          onClick={() => setActiveCategory(category)}
        >{category}</button>)}
      </div>
      <div className={styles.videoGrid}>
        {visibleVideos.map((video) => <Link key={video.id} to={`/watch/${video.id}`} className={styles.videoCard}>
          <div className={`${styles.thumbnail} ${styles[video.color]}`}>
            <span className={styles.thumbnailPlay}><Play size={23} fill="currentColor" /></span>
            {video.live ? <span className={styles.liveBadge}><Radio size={13} /> LIVE</span> : <span className={styles.duration}>{video.duration}</span>}
          </div>
          <div className={styles.videoInfo}><strong>{video.title}</strong><span>{video.creator}</span><span>{video.views}</span></div>
        </Link>)}
      </div>
    </section>
  </main>
}
