import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  // useDispatch hook provides any React component access to the dispatch function of the Redux store defined in main.jsx.
  // This allows all components to make changes to the state of the Redux store.
  const dispatch = useDispatch()

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.anecdote.value = ''
    dispatch(appendAnecdote(content))
    dispatch(notify(`You added '${content}'`))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm