const _ = require('lodash')

const totalLikes = (blogs) => blogs.reduce((accum, curr) => accum + curr.likes, 0)

const favoriteBlog = (blogs) => {
  return blogs.length === 0 ? {} : blogs.reduce((accum, curr) => curr.likes > accum.likes ? curr : accum, blogs[0])
}

const mostBlogs = (blogs) => {
  const authors = _(blogs)
    .groupBy('author') // { 'author1': [{ 'author': 'author1', ... }], 'author2': [{ 'author': 'author2' }] }
    .map((blogs, author) => ({ // (value: blogs, key: author)
      author,
      blogs: blogs.length
    }))
    .maxBy('blogs')

  return authors || null
}

const mostLikes = (blogs) => {
  const authors = _(blogs)
    .groupBy('author') // { 'author1': [{ 'author': 'author1', ... }], 'author2': [{ 'author': 'author2' }] }
    .map((blogs, author) => ({ // (value: blogs, key: author)
      author,
      likes: _.sumBy(blogs, 'likes')
    }))
    .maxBy('likes')

  return authors || null
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}