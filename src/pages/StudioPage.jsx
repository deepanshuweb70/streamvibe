import { useState } from 'react'
import { Clapperboard, Eye, Plus, Trash2, Video } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import styles from '../App.module.css'

const categories = ['Music', 'Travel', 'Design', 'Lifestyle']

export default function StudioPage() {
  const videos = useAppStore((state) => state.videos)
  const addVideo = useAppStore((state) => state.addVideo)
  const removeVideo = useAppStore((state) => state.removeVideo)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Music')
  const [creator, setCreator] = useState('Deepanshu')
  const [notice, setNotice] = useState('')
  const myVideos = videos.filter((video) => video.owner === 'you')

  function publishVideo(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    const id = `creator-${Date.now()}`
    const colorByCategory = { Music: 'jazz', Travel: 'ocean', Design: 'sketch', Lifestyle: 'recipe' }
    addVideo({
      id,
      title: cleanTitle,
      creator: creator.trim() || 'StreamVibe Creator',
      views: 'Just added',
      color: colorByCategory[category],
      category,
      duration: 'New',
      description: `${cleanTitle} — a new story from ${creator.trim() || 'a StreamVibe creator'}.`,
      owner: 'you',
    })
    setTitle('')
    setNotice('Your video is now in the StreamVibe feed.')
  }

  return <main className={styles.page}>
    <p className={styles.eyebrow}>Creator tools</p><h1 className={styles.title}>Your studio, your stories.</h1><p className={styles.subtitle}>Create a video listing and manage the stories you share.</p>
    <section className={styles.studioStats} aria-label="Channel overview">
      <article className={styles.studioStat}><span><Video size={18} /> Videos</span><strong>{myVideos.length}</strong><small>In your library</small></article>
      <article className={styles.studioStat}><span><Eye size={18} /> Views</span><strong>{myVideos.length ? 'New' : '—'}</strong><small>Across your stories</small></article>
      <article className={styles.studioStat}><span><Clapperboard size={18} /> Channel</span><strong>Active</strong><small>Ready to create</small></article>
    </section>
    <section className={styles.studioGrid}>
      <form className={styles.studioForm} onSubmit={publishVideo}>
        <div className={styles.sectionHeading}><div><h2>Add a video</h2><p className={styles.sectionNote}>Create a new listing for the community.</p></div><Plus size={20} /></div>
        <label className={styles.formLabel}>Video title<input required maxLength={90} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your story a title" /></label>
        <label className={styles.formLabel}>Creator name<input maxLength={40} value={creator} onChange={(event) => setCreator(event.target.value)} placeholder="Your creator name" /></label>
        <label className={styles.formLabel}>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <button className={styles.primaryButton} type="submit"><Plus size={17} /> Publish listing</button>
        {notice && <p className={styles.successMessage} role="status">{notice}</p>}
      </form>
      <section className={styles.libraryPanel} aria-labelledby="library-heading"><div className={styles.sectionHeading}><div><h2 id="library-heading">Your videos</h2><p className={styles.sectionNote}>Recently added to your library.</p></div><span>{myVideos.length} total</span></div>
        {myVideos.length ? <div className={styles.libraryList}>{myVideos.map((video) => <article className={styles.libraryItem} key={video.id}>
          <span className={`${styles.libraryThumb} ${styles[video.color] || ''}`}><Video size={18} /></span>
          <span className={styles.libraryInfo}><strong>{video.title}</strong><small>{video.category} · Published</small></span>
          <button type="button" className={styles.removeButton} aria-label={`Remove ${video.title}`} onClick={() => removeVideo(video.id)}><Trash2 size={16} /></button>
        </article>)}</div> : <div className={styles.emptyLibrary}><Clapperboard size={27} /><strong>Your library is ready</strong><span>Publish your first video listing here.</span></div>}
      </section>
    </section>
  </main>
}
