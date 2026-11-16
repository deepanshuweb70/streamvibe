import { useRef, useState } from 'react'
import { Clapperboard, Eye, Heart, Pencil, Plus, Timer, Trash2, Video } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import styles from '../App.module.css'

const categories = ['Music', 'Travel', 'Design', 'Lifestyle']

export default function StudioPage() {
  const videos = useAppStore((state) => state.videos)
  const likedVideos = useAppStore((state) => state.likedVideos)
  const addVideo = useAppStore((state) => state.addVideo)
  const removeVideo = useAppStore((state) => state.removeVideo)
  const updateVideo = useAppStore((state) => state.updateVideo)
  const fileRef = useRef(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Music')
  const [creator, setCreator] = useState('Deepanshu')
  const [notice, setNotice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [mediaUrl, setMediaUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const myVideos = videos.filter((video) => video.owner === 'you')

  function publishVideo(event) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    const id = `creator-${Date.now()}`
    const colorByCategory = { Music: 'jazz', Travel: 'ocean', Design: 'sketch', Lifestyle: 'recipe' }
    const changes = {
      id,
      title: cleanTitle,
      creator: creator.trim() || 'StreamVibe Creator',
      views: 'Just added',
      color: colorByCategory[category],
      category,
      duration: 'New',
      description: `${cleanTitle} — a new story from ${creator.trim() || 'a StreamVibe creator'}.`,
      owner: 'you',
      mediaUrl,
    }
    if (editingId) updateVideo(editingId, { ...changes, id: editingId })
    else addVideo(changes)
    setTitle('')
    setMediaUrl('')
    setEditingId(null)
    setNotice('Your video is now in the StreamVibe feed.')
  }

  function selectMedia(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('video/')) { setNotice('Choose a video file to continue.'); return }
    if (file.size > 50 * 1024 * 1024) { setNotice('Demo upload limit is 50 MB.'); return }
    setUploadProgress(0)
    const timer = window.setInterval(() => setUploadProgress((progress) => {
      if (progress >= 100) { window.clearInterval(timer); setNotice(`${file.name} is ready to publish.`); return 100 }
      return Math.min(progress + 20, 100)
    }), 100)
    setMediaUrl(URL.createObjectURL(file))
  }

  function editVideo(video) {
    setEditingId(video.id)
    setTitle(video.title)
    setCreator(video.creator)
    setCategory(video.category)
    setMediaUrl(video.mediaUrl || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return <main className={styles.page}>
    <p className={styles.eyebrow}>Creator tools</p><h1 className={styles.title}>Your studio, your stories.</h1><p className={styles.subtitle}>Create a video listing and manage the stories you share.</p>
    <section className={styles.studioStats} aria-label="Channel overview">
      <article className={styles.studioStat}><span><Video size={18} /> Videos</span><strong>{myVideos.length}</strong><small>In your library</small></article>
      <article className={styles.studioStat}><span><Eye size={18} /> Views</span><strong>{myVideos.reduce((total, item) => total + (Number(item.viewCount) || 0), 0).toLocaleString()}</strong><small>Demo analytics</small></article>
      <article className={styles.studioStat}><span><Heart size={18} /> Likes</span><strong>{myVideos.reduce((total, item) => total + (likedVideos.includes(item.id) ? 1 : 0), 0)}</strong><small>From your library</small></article>
      <article className={styles.studioStat}><span><Timer size={18} /> Watch time</span><strong>{myVideos.reduce((total, item) => total + (Number(item.watchMinutes) || 0), 0)} min</strong><small>Demo analytics</small></article>
      <article className={styles.studioStat}><span><Clapperboard size={18} /> Channel</span><strong>Active</strong><small>Ready to create</small></article>
    </section>
    <section className={styles.studioGrid}>
      <form className={styles.studioForm} onSubmit={publishVideo}>
        <div className={styles.sectionHeading}><div><h2>{editingId ? 'Edit video' : 'Add a video'}</h2><p className={styles.sectionNote}>Create a new listing for the community.</p></div><Plus size={20} /></div>
        <label className={styles.formLabel}>Video title<input required maxLength={90} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your story a title" /></label>
        <label className={styles.formLabel}>Creator name<input maxLength={40} value={creator} onChange={(event) => setCreator(event.target.value)} placeholder="Your creator name" /></label>
        <label className={styles.formLabel}>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className={styles.formLabel}>Video file (optional)<input ref={fileRef} type="file" accept="video/*" onChange={selectMedia} /></label>
        {uploadProgress > 0 && <div className={styles.uploadProgress} role="status"><span style={{ width: `${uploadProgress}%` }} />{uploadProgress}%</div>}
        <button className={styles.primaryButton} type="submit"><Plus size={17} /> {editingId ? 'Save changes' : 'Publish listing'}</button>
        {notice && <p className={styles.successMessage} role="status">{notice}</p>}
      </form>
      <section className={styles.libraryPanel} aria-labelledby="library-heading"><div className={styles.sectionHeading}><div><h2 id="library-heading">Your videos</h2><p className={styles.sectionNote}>Recently added to your library.</p></div><span>{myVideos.length} total</span></div>
        {myVideos.length ? <div className={styles.tableScroll}><table className={styles.videoTable}><thead><tr><th>Video</th><th>Category</th><th>Views</th><th>Actions</th></tr></thead><tbody>{myVideos.map((video) => <tr key={video.id}>
          <td><span className={styles.tableVideo}><span className={`${styles.libraryThumb} ${styles[video.color] || ''}`}><Video size={18} /></span><span><strong>{video.title}</strong><small>{video.creator} · Published</small></span></span></td><td>{video.category}</td><td>{Number(video.viewCount || 0).toLocaleString()}</td><td><span className={styles.tableActions}><button type="button" className={styles.removeButton} aria-label={`Edit ${video.title}`} onClick={() => editVideo(video)}><Pencil size={15} /></button><button type="button" className={styles.removeButton} aria-label={`Remove ${video.title}`} onClick={() => removeVideo(video.id)}><Trash2 size={16} /></button></span></td>
        </tr>)}</tbody></table></div> : <div className={styles.emptyLibrary}><Clapperboard size={27} /><strong>Your library is ready</strong><span>Publish your first video listing here.</span></div>}
      </section>
    </section>
  </main>
}
