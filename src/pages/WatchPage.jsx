import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, Check, Heart, Maximize, Pause, Play, Share2, Volume2 } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import styles from '../App.module.css'

const sampleVideo = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`

export default function WatchPage() {
  const { id } = useParams()
  const playerRef = useRef(null)
  const videos = useAppStore((state) => state.videos)
  const favorites = useAppStore((state) => state.favorites)
  const likedVideos = useAppStore((state) => state.likedVideos)
  const toggleFavorite = useAppStore((state) => state.toggleFavorite)
  const toggleLike = useAppStore((state) => state.toggleLike)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [quality, setQuality] = useState('720p')
  const [qualityNotice, setQualityNotice] = useState('')
  const [comments, setComments] = useState([{ id: 1, author: 'Aarav', text: 'Beautiful colors and such a calming story.', votes: 3 }, { id: 2, author: 'Mia', text: 'Would love to see more videos like this!', votes: 1 }])
  const [comment, setComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [reply, setReply] = useState('')
  const [liveMessage, setLiveMessage] = useState('')
  const [liveMessages, setLiveMessages] = useState([{ name: 'Lena', text: 'Enjoying the stream!' }, { name: 'Arjun', text: 'Such a lovely story 💜' }])
  const chatRef = useRef(null)
  const video = videos.find((item) => item.id === id)

  useEffect(() => {
    const player = playerRef.current
    if (!player) return undefined
    const updateTime = () => setCurrentTime(player.currentTime || 0)
    const updateDuration = () => setDuration(Number.isFinite(player.duration) ? player.duration : 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    player.addEventListener('timeupdate', updateTime)
    player.addEventListener('loadedmetadata', updateDuration)
    player.addEventListener('durationchange', updateDuration)
    player.addEventListener('play', onPlay)
    player.addEventListener('pause', onPause)
    return () => {
      player.removeEventListener('timeupdate', updateTime)
      player.removeEventListener('loadedmetadata', updateDuration)
      player.removeEventListener('durationchange', updateDuration)
      player.removeEventListener('play', onPlay)
      player.removeEventListener('pause', onPause)
    }
  }, [])
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, [liveMessages])

  if (!video) return <main className={styles.page}><Link className={styles.backLink} to="/home"><ArrowLeft size={17} /> Back to Home</Link><div className={styles.emptyState}><h1>Video not found</h1><p>This video may have been removed from the feed.</p></div></main>

  const related = videos.filter((item) => item.id !== video.id && item.category === video.category).slice(0, 3)
  const isSaved = favorites.includes(video.id)
  const isLiked = likedVideos.includes(video.id)
  const togglePlayback = () => playing ? playerRef.current?.pause() : playerRef.current?.play().catch(() => {})
  const changeVolume = (value) => {
    const next = Number(value)
    setVolume(next)
    if (playerRef.current) playerRef.current.volume = next
  }
  const postComment = (event) => {
    event.preventDefault()
    const text = comment.trim()
    if (!text) return
    setComments((items) => [...items, { id: Date.now(), author: 'You', text, votes: 0, replies: [] }])
    setComment('')
  }
  const postReply = (event) => {
    event.preventDefault()
    const text = reply.trim()
    if (!text || !replyTo) return
    setComments((items) => items.map((item) => item.id === replyTo ? { ...item, replies: [...(item.replies || []), text] } : item))
    setReply('')
    setReplyTo(null)
  }
  const postLiveMessage = (event) => {
    event.preventDefault()
    const text = liveMessage.trim()
    if (!text) return
    setLiveMessages((items) => [...items, { name: 'You', text }])
    setLiveMessage('')
  }

  return <main className={styles.page}>
    <Link className={styles.backLink} to="/home"><ArrowLeft size={17} /> Back to Home</Link>
    <div className={styles.watchLayout}>
      <section className={styles.watchMain}>
        <div className={`${styles.player} ${styles[video.color] || ''}`}>
          <video ref={playerRef} className={styles.videoElement} src={video.mediaUrl || sampleVideo} preload="metadata" playsInline aria-label={video.title} onClick={togglePlayback} />
          <span className={styles.previewLabel}>STREAMVIBE · DEMO VIDEO</span>
          <button className={styles.playerPlay} type="button" onClick={togglePlayback} aria-label={playing ? 'Pause video' : 'Play video'}>
            {playing ? <Pause size={30} fill="currentColor" /> : <Play size={34} fill="currentColor" />}
          </button>
          <div className={styles.playerControls}>
            <button className={styles.playerControlButton} type="button" onClick={togglePlayback} aria-label={playing ? 'Pause video' : 'Play video'}>{playing ? <Pause size={17} /> : <Play size={17} />}</button>
            <span>{formatTime(currentTime)}</span>
            <input aria-label="Seek video" type="range" min="0" max={duration || 100} step="0.1" value={duration ? currentTime : 0} onChange={(event) => { if (playerRef.current) playerRef.current.currentTime = Number(event.target.value) }} />
            <span>{formatTime(duration)}</span>
            <Volume2 size={16} />
            <input className={styles.volumeSlider} aria-label="Volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => changeVolume(event.target.value)} />
            <label className={styles.qualityControl}>Quality<select aria-label="Video quality" value={quality} onChange={(event) => { setQuality(event.target.value); setQualityNotice(`Demo quality set to ${event.target.value}`) }}><option>480p</option><option>720p</option><option>1080p</option></select></label>
            <button className={styles.playerControlButton} type="button" aria-label="Fullscreen" onClick={() => playerRef.current?.parentElement?.requestFullscreen?.()}><Maximize size={16} /></button>
          </div>
        </div>
        {qualityNotice && <p className={styles.qualityNotice} role="status">{qualityNotice} (quality options are simulated)</p>}
        <div className={styles.watchTitleRow}><div><p className={styles.eyebrow}>{video.category}</p><h1 className={styles.title}>{video.title}</h1><p className={styles.subtitle}>{video.views}</p></div></div>
        <div className={styles.creatorRow}>
          <div className={styles.creatorAvatar}>{video.creator.slice(0, 1)}</div>
          <div className={styles.creatorDetails}><strong>{video.creator}</strong><span>StreamVibe creator</span></div>
          <button className={`${styles.secondaryButton} ${isLiked ? styles.selectedButton : ''}`} type="button" aria-pressed={isLiked} onClick={() => toggleLike(video.id)}><Heart size={16} fill={isLiked ? 'currentColor' : 'none'} /> {isLiked ? 'Liked' : 'Like'}</button>
          <button className={`${styles.secondaryButton} ${isSaved ? styles.selectedButton : ''}`} type="button" aria-pressed={isSaved} onClick={() => toggleFavorite(video.id)}>{isSaved ? <Check size={16} /> : <Bookmark size={16} />}{isSaved ? 'Saved' : 'Save'}</button>
          <button className={styles.secondaryButton} type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)}><Share2 size={16} /> Share</button>
        </div>
        <div className={styles.descriptionCard}><strong>About this video</strong><p>{video.description || 'A new story from the StreamVibe creator community.'}</p></div>
        <section className={styles.commentsPanel} aria-labelledby="comments-title"><div className={styles.sectionHeading}><h2 id="comments-title">Comments</h2><span>{comments.length} comments</span></div>
          <form className={styles.commentForm} onSubmit={postComment}><input aria-label="Write a comment" maxLength={300} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share a thoughtful comment…" /><button className={styles.primaryButton} disabled={!comment.trim()}>Comment</button></form>
          {comments.map((item) => <article className={styles.commentItem} key={item.id}><strong>{item.author}</strong><p>{item.text}</p><div className={styles.commentActions}><button type="button" onClick={() => setComments((all) => all.map((row) => row.id === item.id ? { ...row, votes: row.votes + 1 } : row))}>▲ Helpful · {item.votes}</button><button type="button" onClick={() => setReplyTo(replyTo === item.id ? null : item.id)}>Reply</button></div>
            {(item.replies || []).map((text, index) => <p className={styles.commentReply} key={`${item.id}-${index}`}><strong>You replied:</strong> {text}</p>)}
            {replyTo === item.id && <form className={styles.replyForm} onSubmit={postReply}><input aria-label={`Reply to ${item.author}`} value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply…" /><button type="submit" className={styles.secondaryButton}>Send reply</button></form>}
          </article>)}
        </section>
      </section>
      <aside className={styles.watchAside}>
      <section className={styles.watchChat} aria-label="Live chat preview"><div className={styles.sectionHeading}><h2>Live chat</h2><span>Demo room</span></div><div className={styles.chatMessages} ref={chatRef} aria-live="polite">{liveMessages.map((item, index) => <p className={styles.chatMessage} key={`${item.name}-${index}`}><strong>{item.name}</strong><span>{item.text}</span></p>)}</div><form className={styles.chatForm} onSubmit={postLiveMessage}><input aria-label="Write a watch chat message" value={liveMessage} maxLength={180} onChange={(event) => setLiveMessage(event.target.value)} placeholder="Join the conversation…" /><button aria-label="Send watch chat message" disabled={!liveMessage.trim()}><Play size={15} /></button></form></section>
      <aside className={styles.relatedPanel} aria-label="Related videos"><div className={styles.sectionHeading}><h2>Up next</h2><span>{related.length} videos</span></div>
        {related.length ? related.map((item) => <Link key={item.id} to={`/watch/${item.id}`} className={styles.relatedVideo}>
          <span className={`${styles.relatedThumb} ${styles[item.color] || ''}`}><Play size={18} fill="currentColor" /></span>
          <span><strong>{item.title}</strong><small>{item.creator}</small><small>{item.views}</small></span>
        </Link>) : <p className={styles.mutedText}>More videos from this category are coming soon.</p>}
      </aside></aside>
    </div>
  </main>
}
