import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'

describe('HomePage', () => {
  const renderPage = () => render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><HomePage /></MemoryRouter></QueryClientProvider>)
  it('shows the featured section and recommended videos', async () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /find your next favorite/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /recommended for you/i })).toBeInTheDocument()
    expect(await screen.findByText('Chasing the Northern Lights in Iceland')).toBeInTheDocument()
  })

  it('links recommendations to their watch pages', async () => {
    renderPage()
    expect(await screen.findByRole('link', { name: /chasing the northern lights/i })).toHaveAttribute('href', '/watch/aurora')
  })
})
