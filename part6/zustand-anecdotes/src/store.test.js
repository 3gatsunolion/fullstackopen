import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
  it('`initialize` loads anecdotes from service', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test1', votes: 0 }, { id: 2, content: 'Test2', votes: 0 }]
    // When anecdoteService.getAll is called, mockAnecdotes is returned
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('`createAnecdote` appends a new anecdote', async () => {
    const newAnecdote = { id: 3, content: 'New anecdote', votes: 0 }
    anecdoteService.createNew.mockResolvedValue(newAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.createAnecdote('New anecdote')
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toContainEqual(newAnecdote)
  })

  it('`voteAnecdote` increases the number of votes for an anecdote by 1', async () => {
    const anecdote = { id: 1, content: 'Test', votes: 0 }
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteService.update.mockResolvedValue({ ...anecdote, votes: 1 })

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.voteAnecdote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(1)
  })

  it('`removeAnecdote` deletes the anecdote with the given id', async () => {
    const mockAnecdotes = [{ id: 1, content: 'Test1', votes: 0 }, { id: 2, content: 'Test2', votes: 0 }]
    useAnecdoteStore.setState({ anecdotes: mockAnecdotes })
    anecdoteService.update.mockResolvedValue(1)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.removeAnecdote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    // Deep equality
    expect(anecdotesResult.current).toEqual([mockAnecdotes[1]])
  })
})

describe('useAnecdotes sorting', () => {
  const anecdotes = [
    { id: 1, content: 'A', votes: 0 },
    { id: 2, content: 'B', votes: 2 },
  ]

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes })
  })

  it('returns anecdotes sorted by votes in descending order', () => {
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([anecdotes[1], anecdotes[0]])
  })
})

describe('useAnecdotes filtering', () => {
  const anecdotes = [
    { id: 1, content: 'A', votes: 0 },
    { id: 2, content: 'B', votes: 0 },
  ]

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes })
  })

  it('returns all anecdotes with no filter', () => {
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(anecdotes.length)
  })

  it('filters by given filter', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'a' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toEqual([anecdotes[0]])
  })
})