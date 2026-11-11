import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Play, Radio, Send, Users } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import styles from '../App.module.css'

const startingMessages = [
  { name: 'Lena', text: 'This is the perfect Sunday soundtrack ☕' },
  { name: 'Arjun', text: 'That sax solo was lovely!' },
  { name: 'Milo', text: 'Listening while I work. Thanks for streaming!' },
]

export default function LivePage() {
  const videos = useAppStore((state) => state.videos)
  const liveStreams = videos.filter((video) => video.live)
  const [selectedId, setSelectedId] = useState(liveStreams[0]?.id ?? '')
  const [messages, setMessages] = useState(startingMessages)
  const [message, setMessage] = useState('')
  const activeStream = liveStreams.find((stream) => stream.id === selectedId) ?? liveStreams[0]

  function sendMessage(event) {
    event.preventDefault()
    const text = message.trim()
    if (!text) return
    setMessages((current) => [...current, { name: 'You', text }])
    setMessage('')
  }

  return <main className={styles.page}>
    <p className={styles.eyebrow}>Live now</p><h1 className={styles.title}>Be here for the moment.</h1><p className={styles.subtitle}>Watch live creators and join the conversation.</p>
    {activeStream ? <div className={styles.liveLayout}>
      <section className={styles.liveMain}>
        <div className={`${styles.livePlayer} ${styles[activeStream.color] || ''}`}><span className={styles.liveBadge}><Radio size={13} /> LIVE</span><span className={styles.livePulse}><Play size={30} fill="currentColor" /></span><span className={styles.viewerCount}><Users size={15} /> 2.4K watching</span></div>
        <p className={styles.eyebrow}>{activeStream.category} · Live room</p><h2 className={styles.subTitle}>{activeStream.title}</h2><p className={styles.mutedText}>Streaming with {activeStream.creator}</p>
        {liveStreams.length > 1 && <div className={styles.streamPicker}><h3>More live streams</h3>{liveStreams.filter((stream) => stream.id !== activeStream.id).map((stream) => <button key={stream.id} type="button" className={styles.secondaryButton} onClick={() => setSelectedId(stream.id)}><Radio size={15} /> {stream.title}</button>)}</div>}
      </section>
      <section className={styles.chatPanel} aria-label="Live chat"><div className={styles.chatHeader}><div><MessageCircle size={17} /><strong>Live chat</strong></div><span>{messages.length} messages</span></div>
        <div className={styles.chatMessages} aria-live="polite">{messages.map((item, index) => <p className={styles.chatMessage} key={`${item.name}-${index}`}><strong>{item.name}</strong><span>{item.text}</span></p>)}</div>
        <form className={styles.chatForm} onSubmit={sendMessage}><input aria-label="Write a chat message" maxLength={180} placeholder="Say something kind…" value={message} onChange={(event) => setMessage(event.target.value)} /><button aria-label="Send message" type="submit" disabled={!message.trim()}><Send size={16} /></button></form>
      </section>
    </div> : <div className={styles.emptyState}><Radio size={30} /><h2>No one is live right now</h2><p>Check back soon or explore the latest stories.</p><Link to="/home" className={styles.secondaryButton}>Explore videos</Link></div>}
  </main>
}
