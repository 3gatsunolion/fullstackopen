import { useAnecdoteActions, useAnecdotes } from "../hooks"

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { deleteAnecdote } = useAnecdoteActions()

  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => (
          <li key={anecdote.id}>
            {anecdote.content} <button onClick={() => deleteAnecdote(anecdote.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AnecdoteList
