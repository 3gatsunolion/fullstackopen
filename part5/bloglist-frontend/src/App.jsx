import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
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
  const [notification, setNotification] = useState({ message: null })

  const timer = useRef(null)
  const blogFormTogglable = useRef(null)

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
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const clearNotification = () => {
    clearInterval(timer.current)
    setNotification({ message: null })
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
    } catch {
      showNotification('wrong username or password', true)
    }
  }

  const logout = () => {
    clearNotification()
    window.localStorage.removeItem(LOGIN_LOCAL_STORAGE_KEY)
    setUser(null)
    blogService.setToken(null)
  }

  const addBlog = async (newBlog) => {
    try {
      const addedBlog = await blogService.create(newBlog)
      updateBlogs(blogs.concat(addedBlog))
      showNotification(`a new blog: ${addedBlog.title} by ${addedBlog.author} added`)
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

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        {notification.message && <Notification notification={notification} />}
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification.message && <Notification notification={notification} />}
      <div>{user.username} logged in <button onClick={logout}>logout</button></div>
      <Togglable buttonLabel="create new blog" ref={blogFormTogglable}>
        <h2>create new</h2>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} currUser={user} onLike={addLike} onDelete={deleteBlog} />
      )}
    </div>
  )
}

export default App