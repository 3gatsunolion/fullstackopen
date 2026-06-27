import { useNavigate } from 'react-router-dom'
import  { useAnecdoteActions, useField } from '../hooks'

const CreateNew = () => {
  const { reset: resetContent, ...content } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetInfo, ...info } = useField('text')
  const navigate = useNavigate()
  const { addAnecdote } = useAnecdoteActions()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addAnecdote({ 
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  const reset = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' {...content} />
        </div>
        <div>
          author
          <input name='author' {...author} />
        </div>
        <div>
          url for more info
          <input name='info' {...info} />
        </div>
        <button>create</button>
        <button onClick={reset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew
