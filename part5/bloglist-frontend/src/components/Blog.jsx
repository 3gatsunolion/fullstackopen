import { useState } from 'react'

const Blog = ({ blog, currUser, onLike, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetailVisibility = () => {
    setShowDetails(!showDetails)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onDelete(blog)
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleDetailVisibility}>{showDetails ? 'hide' : 'view'}</button>
      </div>
      {showDetails && (
        <>
          <div>{blog.url}</div>
          <div>{blog.likes} <button onClick={() => onLike(blog)}>like</button></div>
          <div>{blog.user.name || blog.user.username}</div>
          {blog.user.username === currUser.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </>
      )}
    </div>
  )
}

export default Blog