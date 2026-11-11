import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Radio } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import styles from '../App.module.css'

const categories = ['For you', 'Music', 'Travel', 'Design', 'Lifestyle']

export default function HomePage({ query = '' }) {
  const videos = useAppStore((state) => state.videos)
  const [activeCategory, setActiveCategory] = useState('For you')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleVideos = videos.filter((video) => {
    const matchesCategory = activeCategory === 'For you' || video.category === activeCategory
    const matchesQuery = !normalizedQuery || `${video.title} ${video.creator} ${video.category}`.toLowerCase().includes(normalizedQuery)
    return matchesCategory && matchesQuery
  })

  return <main className={styles.page}>
    <p className={styles.eyebrow}>Your daily stream</p>
    <h1 className={styles.title}>{normalizedQuery ? `Search results for “${query.trim()}”` : 'Find your next favorite.'}</h1>
    <p className={styles.subtitle}>{normalizedQuery ? `${visibleVideos.length} matching videos and creators.` : 'Fresh creators, live moments, and stories picked for you.'}</p>
    {!normalizedQuery && <section className={styles.welcome}>
      <div><p className={styles.eyebrow}>Featured today</p><h2>Make room for a little inspiration.</h2><p>Explore thoughtful stories and live sessions from creators around the world.</p></div>
      <Link to="/watch/aurora" className={styles.featureCard} aria-label="Play today's featured story"><Play /></Link>
    </section>}
    <section aria-labelledby="recommendations-title">
      <div className={styles.sectionHeading}><div><h3 id="recommendations-title">{normalizedQuery ? 'Videos' : 'Recommended for you'}</h3><p className={styles.sectionNote}>Stories worth settling in for.</p></div><span>{visibleVideos.length} videos</span></div>
      {!normalizedQuery && <div className={styles.categoryList} aria-label="Filter videos by category">
        {categories.map((category) => <button
          key={category}
          type="button"
          className={`${styles.categoryButton} ${activeCategory === category ? styles.categoryActive : ''}`}
          aria-pressed={activeCategory === category}
          onClick={() => setActiveCategory(category)}
        >{category}</button>)}
      </div>}
      {visibleVideos.length ? <div className={styles.videoGrid}>
        {visibleVideos.map((video) => <Link key={video.id} to={`/watch/${video.id}`} className={styles.videoCard}>
          <div className={`${styles.thumbnail} ${styles[video.color] || ''}`}>
            <span className={styles.thumbnailPlay}><Play size={23} fill="currentColor" /></span>
            {video.live ? <span className={styles.liveBadge}><Radio size={13} /> LIVE</span> : <span className={styles.duration}>{video.duration || 'New'}</span>}
          </div>
          <div className={styles.videoInfo}><strong>{video.title}</strong><span>{video.creator}</span><span>{video.views || video.category}</span></div>
        </Link>)}
      </div> : <div className={styles.emptyState}><h3>No videos found</h3><p>Try another search or category.</p><button className={styles.secondaryButton} type="button" onClick={() => setActiveCategory('For you')}>Show all categories</button></div>}
    </section>
  </main>
}
