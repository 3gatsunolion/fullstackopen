import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const clearForm = () => {
    setTitle('')
    setAuthor('')
    setURL('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await createBlog({ title, author, url })
    if (ok) {
      clearForm()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          title
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            placeholder='enter title'
          />
        </label>
      </div>
      <div>
        <label>
          author
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='enter author'
          />
        </label>
      </div>
      <div>
        <label>
          url
          <input
            type="text"
            value={url}
            onChange={({ target }) => setURL(target.value)}
            placeholder='enter url'
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm