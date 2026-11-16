import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Play, Radio } from 'lucide-react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useAppStore } from '../store/useAppStore'
import styles from '../App.module.css'

const categories = ['For you', 'Music', 'Travel', 'Design', 'Lifestyle']

async function loadRecommendations({ pageParam }) {
  await new Promise((resolve) => window.setTimeout(resolve, 100))
  const catalog = useAppStore.getState().videos
  return { items: catalog.slice(pageParam * 6, (pageParam + 1) * 6), nextPage: pageParam + 1 }
}

export default function HomePage({ query = '' }) {
  const storedVideos = useAppStore((state) => state.videos)
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['recommendations', storedVideos.length],
    queryFn: loadRecommendations,
    initialPageParam: 0,
    getNextPageParam: (page) => page.items.length === 6 ? page.nextPage : undefined,
  })
  const videos = useMemo(() => data?.pages.flatMap((page) => page.items) ?? storedVideos, [data, storedVideos])
  const [activeCategory, setActiveCategory] = useState('For you')
  const [visibleCount, setVisibleCount] = useState(6)
  const sentinelRef = useRef(null)
  const normalizedQuery = query.trim().toLowerCase()
  const visibleVideos = videos.filter((video) => {
    const matchesCategory = activeCategory === 'For you' || video.category === activeCategory
    const matchesQuery = !normalizedQuery || `${video.title} ${video.creator} ${video.category}`.toLowerCase().includes(normalizedQuery)
    return matchesCategory && matchesQuery
  })

  useEffect(() => {
    const target = sentinelRef.current
    if (!target || !hasNextPage || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage()
    }, { rootMargin: '240px' })
    observer.observe(target)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

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
      {isError ? <div className={styles.emptyState} role="alert"><h3>Could not load videos</h3><p>Check your connection and try again.</p><button className={styles.secondaryButton} type="button" onClick={() => window.location.reload()}>Retry</button></div> : isPending ? <div className={styles.skeletonGrid} aria-label="Loading recommendations">{Array.from({ length: 6 }, (_, index) => <div className={styles.videoSkeleton} key={index}><span /><i /><i /></div>)}</div> : visibleVideos.length ? <><div className={styles.videoGrid}>
        {visibleVideos.slice(0, visibleCount).map((video) => <Link key={video.id} to={`/watch/${video.id}`} className={styles.videoCard}>
          <div className={`${styles.thumbnail} ${styles[video.color] || ''}`}>
            <span className={styles.thumbnailPlay}><Play size={23} fill="currentColor" /></span>
            {video.live ? <span className={styles.liveBadge}><Radio size={13} /> LIVE</span> : <span className={styles.duration}>{video.duration || 'New'}</span>}
          </div>
          <div className={styles.videoInfo}><strong>{video.title}</strong><span>{video.creator}</span><span>{video.views || video.category}</span></div>
        </Link>)}
      </div>{visibleCount < visibleVideos.length && <button className={styles.secondaryButton} type="button" onClick={() => setVisibleCount((count) => count + 6)}>Load more videos</button>}<div ref={sentinelRef} className={styles.feedSentinel} aria-hidden="true" />{isFetchingNextPage && <div className={styles.loadingState} aria-label="Loading more videos"><span /><span /><span /></div>}</> : <div className={styles.emptyState}><h3>No videos found</h3><p>Try another search or category.</p><button className={styles.secondaryButton} type="button" onClick={() => setActiveCategory('For you')}>Show all categories</button></div>}
    </section>
  </main>
}
