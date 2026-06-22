const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  const loginAndGetToken = async (user) => {
    const response = await api
      .post('/api/login')
      .send({ username: user.username, password: user.password })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    return response.body.token
  }

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    const usersToSave = []
    for (let sampleUser of helper.sampleUsers) {
      sampleUser = { ...sampleUser }
      const passwordHash = await bcrypt.hash(sampleUser.password, 10)
      delete sampleUser.password
      sampleUser.passwordHash = passwordHash
      usersToSave.push(sampleUser)
    }
    await User.insertMany(usersToSave)
  })

  describe('viewing all blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('each blog has unique identifier named id', async() => {
      const response = await api.get('/api/blogs')
      const blogs = response.body
      assert(blogs.every(blog => Object.hasOwn(blog, 'id')))
      assert(blogs.every(blog => !Object.hasOwn(blog, '_id')))
    })

    test('user information is displayed with the each blog', async () => {
      const response = await api.get('/api/blogs')

      const blogs = await helper.blogsInDb()
      const users = await helper.usersInDb()
      for (const user of users) {
        delete user.blogs
      }
      for (const blog of blogs) {
        blog.user = users.find(u => u.id === blog.user)
      }
      response.body.sort((a, b) => a.id - b.id)
      blogs.sort((a, b) => a.id - b.id)
      assert.deepStrictEqual(response.body, blogs)
    })
  })

  describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
    })
  })

  describe('addition of a new blog', () => {
    test('fails with status code 401 when token is not provided', async () => {
      const newBlog = {
        title: 'new blog',
        author: 'test author',
        url: 'www.blog.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })

    describe('when authenticated', () => {
      let token

      beforeEach(async () => {
        token = await loginAndGetToken(helper.sampleUsers[0])
      })

      test('succeeds with valid data', async () => {
        const newBlog = {
          title: 'new blog',
          author: 'test author',
          url: 'www.blog.com',
          likes: 5
        }

        const response = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const id = response.body.id
        const savedBlog = blogsAtEnd.find(blog => blog.id === id)

        assert.deepStrictEqual({
          title: savedBlog.title,
          author: savedBlog.author,
          url: savedBlog.url,
          likes: savedBlog.likes
        }, newBlog)
      })

      test('default value of likes is 0 when missing from the request', async () => {
        const newBlogWithoutLikes = {
          title: 'new blog',
          author: 'test author',
          url: 'www.blog.com',
        }

        const response = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlogWithoutLikes)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const savedBlog = blogsAtEnd.find(blog => blog.id === response.body.id)
        assert.strictEqual(savedBlog.likes, 0)
      })

      test('fails with status code 400 if title is missing', async () => {
        const newBlogWithoutTitle = {
          author: 'test author',
          url: 'www.blog.com',
        }

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlogWithoutTitle)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })

      test('fails with status code 400 if url is missing', async () => {
        const newBlogWithoutUrl = {
          title: 'new blog',
          author: 'test author'
        }

        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlogWithoutUrl)
          .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if authenticated and id is valid', async () => {
      const user = helper.sampleUsers[1]
      const token = await loginAndGetToken(user)

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.find(b => b.user === user._id)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('fails with status code 403 if authenticated but not user of blog', async () => {
      const user = helper.sampleUsers[1]
      const token = await loginAndGetToken(user)

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart.find(b => b.user !== user._id)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(b => b.id)
      assert(ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('modification of a blog', () => {
    test('all fields will be updated if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToModify = blogsAtStart[0]

      blogToModify.likes += 1

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(blogToModify)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const savedModifiedBlog = blogsAtEnd.find(blog => blog.id === blogToModify.id)

      assert.deepStrictEqual(savedModifiedBlog, blogToModify)

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 404 if blog with id does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      const blogToModify = {
        id: validNonexistingId,
        title: 'does not exist',
        author: 'i don\'t exist',
        likes: 0
      }

      await api.put(`/api/blogs/${validNonexistingId}`).send(blogToModify).expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})