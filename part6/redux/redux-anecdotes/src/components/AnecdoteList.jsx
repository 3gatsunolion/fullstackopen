import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => {
    if (state.filter === '') {
      return state.anecdotes
    }

    return state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
  })

  const handleVote = anecdote => {
    dispatch(vote(anecdote.id))
    dispatch(notify(`You voted '${anecdote.content}'`))
  }

  return (
    <div>
   {anecdotes
      .toSorted((a, b) => b.votes - a.votes)
      .map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList