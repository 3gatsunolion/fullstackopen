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

  const style = { width: '400px' }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="title"
            size="small"
            sx={style}
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            label="author"
            size="small"
            sx={style}
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            label="url"
            size="small"
            sx={style}
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