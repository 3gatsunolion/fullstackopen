import { useState } from 'react'
import { Input, TextField, Button, Stack } from '@mui/material'

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
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            label="title"
            size="small"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            label="author"
            size="small"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            label="url"
            size="small"
            value={url}
            onChange={({ target }) => setURL(target.value)}
          />
          <div>
            <Button type="submit" variant="contained">
              create
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm