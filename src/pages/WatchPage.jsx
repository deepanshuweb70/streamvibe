import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, Check, Heart, Play, Share2, Volume2 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import styles from '../App.module.css'

export default function WatchPage() {
  const { id } = useParams()
  const videos = useAppStore((state) => state.videos)
  const favorites = useAppStore((state) => state.favorites)
  const likedVideos = useAppStore((state) => state.likedVideos)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const toggleLike = useAppStore((state) => state.toggleLike)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(24)
  const video = videos.find((item) => item.id === id)

  if (!video) return <main className={styles.page}><Link className={styles.backLink} to="/home"><ArrowLeft size={17} /> Back to Home</Link><div className={styles.emptyState}><h1>Video not found</h1><p>This video may have been removed from the feed.</p></div></main>

  const related = videos.filter((item) => item.id !== video.id && item.category === video.category).slice(0, 3)
  const isSaved = favorites.includes(video.id)
  const isLiked = likedVideos.includes(video.id)

  return <main className={styles.page}>
    <Link className={styles.backLink} to="/home"><ArrowLeft size={17} /> Back to Home</Link>
    <div className={styles.watchLayout}>
      <section className={styles.watchMain}>
        <div className={`${styles.player} ${styles[video.color] || ''}`}>
          <span className={styles.previewLabel}>STREAMVIBE PREVIEW</span>
          <button className={styles.playerPlay} type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? 'Pause preview' : 'Play preview'}>
            {playing ? <span className={styles.pauseIcon} aria-hidden="true">Ⅱ</span> : <Play size={34} fill="currentColor" />}
          </button>
          <div className={styles.playerControls}>
            <span>{playing ? 'Preview playing' : 'Preview paused'}</span>
            <input aria-label="Preview progress" type="range" min="0" max="100" value={progress} onChange={(event) => setProgress(Number(event.target.value))} />
            <Volume2 size={17} />
          </div>
        </div>
        <div className={styles.watchTitleRow}><div><p className={styles.eyebrow}>{video.category}</p><h1 className={styles.title}>{video.title}</h1><p className={styles.subtitle}>{video.views}</p></div></div>
        <div className={styles.creatorRow}>
          <div className={styles.creatorAvatar}>{video.creator.slice(0, 1)}</div>
          <div className={styles.creatorDetails}><strong>{video.creator}</strong><span>StreamVibe creator</span></div>
          <button className={`${styles.secondaryButton} ${isLiked ? styles.selectedButton : ''}`} type="button" aria-pressed={isLiked} onClick={() => toggleLike(video.id)}><Heart size={16} fill={isLiked ? 'currentColor' : 'none'} /> {isLiked ? 'Liked' : 'Like'}</button>
          <button className={`${styles.secondaryButton} ${isSaved ? styles.selectedButton : ''}`} type="button" aria-pressed={isSaved} onClick={() => toggleFavorite(video.id)}>{isSaved ? <Check size={16} /> : <Bookmark size={16} />}{isSaved ? 'Saved' : 'Save'}</button>
          <button className={styles.secondaryButton} type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)}><Share2 size={16} /> Share</button>
        </div>
        <div className={styles.descriptionCard}><strong>About this video</strong><p>{video.description || 'A new story from the StreamVibe creator community.'}</p></div>
      </section>
      <aside className={styles.relatedPanel} aria-label="Related videos"><div className={styles.sectionHeading}><h2>Up next</h2><span>{related.length} videos</span></div>
        {related.length ? related.map((item) => <Link key={item.id} to={`/watch/${item.id}`} className={styles.relatedVideo}>
          <span className={`${styles.relatedThumb} ${styles[item.color] || ''}`}><Play size={18} fill="currentColor" /></span>
          <span><strong>{item.title}</strong><small>{item.creator}</small><small>{item.views}</small></span>
        </Link>) : <p className={styles.mutedText}>More videos from this category are coming soon.</p>}
      </aside>
    </div>
  </main>
}
