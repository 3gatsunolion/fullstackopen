import { useState } from 'react'

const Anecdote = ({ text, votes }) => {
  return (
    <>
      <div>
        {text}
      </div>
      <div>
        has {votes} vote{votes === 1 ? '' : 's'}
      </div>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const getRandom = () => {
    return Math.floor(Math.random() * anecdotes.length)
  }
   
  const [selected, setSelected] = useState(getRandom())
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const mostVoted = votes.indexOf(Math.max(...votes))

  const handleClick = () => {
    const newVotes = [...votes]
    newVotes[selected]++
    setVotes(newVotes)
  }

  return (
    <div>
      <h2>Anecdote of the Day</h2>
      <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
      <button onClick={handleClick}>vote</button>
      <button onClick={() => setSelected(getRandom())}>next anecdote</button>
      <h2>Anecdote with most votes</h2>
      <Anecdote text={anecdotes[mostVoted]} votes={votes[mostVoted]} />
    </div>
  )
}

export default App