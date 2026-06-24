import { useAnecdotes, useAnecdoteActions, useNotificationActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { voteAnecdote, removeAnecdote } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const handleVote = async (anecdote) => {
    await voteAnecdote(anecdote.id)
    showNotification(`You voted '${anecdote.content}'`)
  }

  const handleDelete = async (anecdote) => {
    await removeAnecdote(anecdote.id)
    showNotification(`You deleted: '${anecdote.content}'`)
  }

  return (
    anecdotes
    .map(anecdote => (
      <div key={anecdote.id}>
        <div>{anecdote.content}</div>
        <div>
          has {anecdote.votes}
          <button onClick={() => handleVote(anecdote)}>vote</button>
        </div>
        {anecdote.votes === 0 &&
        <div>
          <button onClick={() => handleDelete(anecdote)}>delete</button>
        </div>}
      </div>
    ))
  )
}

export default AnecdoteList