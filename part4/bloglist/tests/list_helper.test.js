const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

const blogs = require('./test_helper').initialBlogs

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes([blogs[0]]), blogs[0].likes)
  })

  test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36)
  })
})

describe('favorite blog', () => {
  test('of empty list is {}', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), {})
  })

  test('when list has only one blog, equals that blog', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([blogs[0]]), blogs[0])
  })

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('when list has only one blog, equals author of that blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([blogs[0]]), { author: blogs[0].author, blogs: 1 })
  })

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), { author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('most likes', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('when list has only one blog, equals author of that blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes([blogs[0]]), { author: blogs[0].author, likes: blogs[0].likes })
  })

  test('of a bigger list is calculated right', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogs), { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})