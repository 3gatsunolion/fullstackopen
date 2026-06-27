import { useState, useEffect, useCallback, useMemo } from 'react'
import anecdoteService from './services/anecdotes'
import { AnecdotesContext, AnecdoteActionsContext } from './AnecdotesContext'

const AnecdotesContextProvider = (props) => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService
      .getAll()
      .then(data => setAnecdotes(data))
  }, [])

  const addAnecdote = useCallback(async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew({
      ...anecdote,
      votes: 0
    })
    setAnecdotes(anecdotes => anecdotes.concat(newAnecdote))
  }, [])

  const deleteAnecdote = useCallback(async (id) => {
    await anecdoteService.remove(id)
    setAnecdotes(anecdotes => anecdotes.filter(a => a.id !== id))
  }, [])

  // Otherwise each time { addAnecdote, deleteAnecdote } creates a new object
  // which causes re-render
  const actions = useMemo(() => ({
    addAnecdote,
    deleteAnecdote,
  }), [addAnecdote, deleteAnecdote])

  return (
    <AnecdotesContext.Provider value={anecdotes}>
      <AnecdoteActionsContext.Provider value={actions}>
        {props.children}
      </AnecdoteActionsContext.Provider>
    </AnecdotesContext.Provider>
  )
}

export default AnecdotesContextProvider