import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('shows the featured section and recommended videos', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: /find your next favorite/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /recommended for you/i })).toBeInTheDocument()
    expect(screen.getByText('Chasing the Northern Lights in Iceland')).toBeInTheDocument()
  })

  it('links recommendations to their watch pages', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /chasing the northern lights/i })).toHaveAttribute('href', '/watch/aurora')
  })
})
