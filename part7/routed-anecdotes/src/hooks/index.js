import { useContext, useState } from 'react'
import { AnecdotesContext, AnecdoteActionsContext } from '../AnecdotesContext'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => setValue('')

  return {
    type,
    value,
    onChange,
    reset
  }
}

export const useAnecdotes = () => useContext(AnecdotesContext)
export const useAnecdoteActions = () => useContext(AnecdoteActionsContext)

// export const useAnecdotes = () => {
//   const [anecdotes, setAnecdotes] = useState([])

//   useEffect(() => {
//     anecdoteService
//       .getAll()
//       .then(data => setAnecdotes(data))
//   }, [])

//   const addAnecdote = async (anecdote) => {
//     const newAnecdote = await anecdoteService.createNew({
//       ...anecdote,
//       votes: 0
//     })
//     setAnecdotes(anecdotes.concat(newAnecdote))
//   }

//   const deleteAnecdote = async (id) => {
//     await anecdoteService.remove(id)
//     setAnecdotes(anecdotes.filter(a => a.id !== id))
//   }

//   return {
//     anecdotes,
//     addAnecdote,
//     deleteAnecdote
//   }
// }