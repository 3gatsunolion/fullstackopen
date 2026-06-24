import { useAnecdoteActions, useNotificationActions } from '../store'

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdoteActions()
  const { showNotification } = useNotificationActions()

  const addAnecdote = async (e) => {
    e.preventDefault()
    const anecdote = e.target.anecdote.value
    await createAnecdote(anecdote)
    showNotification(`You added: '${anecdote}'`)
    e.target.reset()
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default AnecdoteForm