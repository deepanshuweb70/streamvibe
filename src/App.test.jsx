import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { videoCatalog } from './data/videoCatalog'
import { useAppStore } from './store/useAppStore'

describe('StreamVibe main flows', () => {
  beforeEach(() => {
    localStorage.clear()
    useAppStore.setState({ theme: 'light', videos: videoCatalog, favorites: [], likedVideos: [] })
  })

  it('searches, opens a watch page, saves a video, chats live, and adds a studio listing', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/home']}><App /></MemoryRouter>)

    await user.type(await screen.findByRole('textbox', { name: 'Search videos' }), 'Maya Chen')
    const videoLink = await screen.findByRole('link', { name: /chasing the northern lights/i })
    await user.click(videoLink)
    expect(await screen.findByRole('heading', { name: 'Chasing the Northern Lights in Iceland' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^save$/i }))
    expect(screen.getByRole('button', { name: /^saved$/i })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('link', { name: 'Live' }))
    const chatInput = await screen.findByRole('textbox', { name: 'Write a chat message' })
    await user.type(chatInput, 'Great stream!')
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(await screen.findByText('Great stream!')).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Creator Studio' }))
    await user.type(await screen.findByRole('textbox', { name: 'Video title' }), 'My first story')
    await user.click(screen.getByRole('button', { name: /publish listing/i }))
    expect(await screen.findByText('My first story')).toBeInTheDocument()
    await waitFor(() => expect(useAppStore.getState().videos.some((video) => video.title === 'My first story')).toBe(true))
  })

  it('renders a native media player and lets viewers add and upvote comments', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/watch/aurora']}><App /></MemoryRouter>)
    expect(await screen.findByLabelText('Chasing the Northern Lights in Iceland')).toHaveProperty('tagName', 'VIDEO')
    await user.type(screen.getByRole('textbox', { name: 'Write a comment' }), 'Loved the film')
    await user.click(screen.getByRole('button', { name: 'Comment' }))
    expect(await screen.findByText('Loved the film')).toBeInTheDocument()
    const commentCard = screen.getByText('Loved the film').closest('article')
    await user.click(within(commentCard).getByRole('button', { name: /helpful/i }))
    expect(within(commentCard).getByRole('button', { name: '▲ Helpful · 1' })).toBeInTheDocument()
  })
})
