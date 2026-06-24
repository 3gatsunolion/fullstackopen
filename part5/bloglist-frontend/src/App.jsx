import { useState, useEffect, useRef } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useNavigate, useMatch
} from 'react-router-dom'
import { Container, AppBar, Toolbar, Box, Button, Typography } from '@mui/material'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const LOGIN_LOCAL_STORAGE_KEY = 'loggedBlogappUser'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const timer = useRef(null)

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  const blogToDisplay = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  useEffect(() => {
    blogService.getAll().then(blogs =>
      updateBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    // clear on component unmount
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clearInterval(timer.current)
    }
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(LOGIN_LOCAL_STORAGE_KEY)
    if (loggedUserJSON) {
      const currentUser = JSON.parse(loggedUserJSON)
      setUser(currentUser)
      blogService.setToken(currentUser.token)
    }
  }, [])

  const showNotification = (message, isError = false) => {
    clearInterval(timer.current)
    setNotification({ text: message, type: isError ? 'error' : 'success' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const clearNotification = () => {
    clearInterval(timer.current)
    setNotification(null)
  }

  const handleLogin = async (credentials) => {
    try {
      const verifiedUser = await loginService.login(credentials)
      window.localStorage.setItem(
        LOGIN_LOCAL_STORAGE_KEY, JSON.stringify(verifiedUser)
      )
      blogService.setToken(verifiedUser.token)
      clearNotification()
      setUser(verifiedUser)
      navigate('/')
    } catch {
      showNotification('wrong username or password', true)
    }
  }

  const logout = () => {
    clearNotification()
    window.localStorage.removeItem(LOGIN_LOCAL_STORAGE_KEY)
    setUser(null)
    blogService.setToken(null)
    navigate('/')
  }

  const addBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.create(newBlog)
      updateBlogs(blogs.concat(addedBlog))
      showNotification(`a new blog: ${addedBlog.title} by ${addedBlog.author} added`)
      navigate('/')
      return true
    } catch (error) {
      handleError(error)
      return false
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)
      updateBlogs(blogs.filter(b => b.id !== blog.id))
      navigate('/')
    } catch (error) {
      handleError(error)
    }
  }

  const updateBlogs = (updatedBlogs) => {
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
  }

  const addLike = async (blog) => {
    try {
      const { id, title, author, url, likes } = blog
      const updatedBlog = await blogService.update(id, {
        id,
        title,
        author,
        url,
        likes: likes + 1
      })
      updateBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
    } catch (error) {
      handleError(error)
    }
  }

  const handleError = (error) => {
    if (error.response) {
      // 1. Server actually responded
      const statusCode = error.response.status
      // Unauthorized (token probably expired, have to login again)
      if (statusCode === 401) {
        console.log('Unauthorized request. Redirecting to login...')
        logout()
        return
      } else if (statusCode === 400) {
        console.log('Bad Request. Check your payload or query params.')
      } else {
        console.log(`Server responded with another error code: ${statusCode}`)
      }
      showNotification(`${error}`, true)
    } else if (error.request) {
      // 2. The request was made but no response was received
      showNotification(`${error.request}`, true)
    } else {
      // 3. Something happened while setting up the request
      showNotification(`${error.message}`, true)
    }
  }

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Blog App
          </Typography>
          <Box sx={{ display: { sm: 'block' } }}>
            <Button color="inherit" component={Link} to="/" sx={style}>blogs</Button>
            {user && <Button color="inherit" component={Link} to="/create" sx={style}>new blog</Button>}
            {user ?
              <Button color="inherit" onClick={logout} sx={style}>logout</Button> :
              <Button color="inherit" component={Link} to="/login" sx={style}>login</Button>
            }
          </Box>
        </Toolbar>
      </AppBar>
      {notification && <Notification notification={notification} />}
      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route path="/blogs/:id" element={
          <Blog blog={blogToDisplay} currUser={user} onLike={addLike} onDelete={deleteBlog} />
        } />
        <Route path="/create" element={<BlogForm createBlog={addBlog} />} />
        <Route path="/login" element={
          <LoginForm onLogin={handleLogin}/>
        } />
      </Routes>
    </Container>
  )
}

export default App