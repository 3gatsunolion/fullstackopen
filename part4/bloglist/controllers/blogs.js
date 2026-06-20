const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Note: When using async/await syntax, Express will automatically call the error-handling middleware
// if an await statement throws an error or the awaited promise is rejected, so no need for calling next(error)
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  if (!request.user) {
    return response.status(request.authError.status).json({ error: request.authError.error })
  }

  const body = request.body

  if (!body.title || !body.url){
    response.status(400).end()
  }
  const blog = new Blog({ ...body, user: request.user._id })

  const savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(request.authError.status).json({ error: request.authError.error })
  }

  const blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  if (blogToDelete.user.toString() === user.id.toString()) {
    await blogToDelete.deleteOne()
    return response.status(204).end()
  } else {
    return response.status(403).json({ error: 'Forbidden: You cannot delete this blog' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blogToModify = await Blog.findById(request.params.id)
  if (!blogToModify) {
    response.status(404).end()
    return
  }

  blogToModify.title = title
  blogToModify.author = author
  blogToModify.url = url
  blogToModify.likes = likes

  const updatedBlog = await blogToModify.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter