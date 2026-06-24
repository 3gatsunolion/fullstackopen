const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, likeTimes } = require('./helper')

describe('Blog app', () => {
  const loginUser = {
    name: 'Hello World',
    username: 'whoami',
    password: 'testsecret123'
  }

  const otherUser = {
    name: 'Other',
    username: 'iamnobody',
    password: 'canyouseethis'
  }

  beforeEach(async ({ page, request }) => {
    // empty the db here
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: loginUser
    })
    await request.post('/api/users', {
        data: otherUser
    })

    await page.goto('/')
  })

  describe('Login', () => {
    test('form is shown when you navigate to /login', async ({ page }) => {
      await page.goto('/login')
      await expect(page.getByText('log in to application')).toBeVisible()
      await expect(page.getByRole('textbox', { name: 'username' })).toBeVisible()
      await expect(page.getByRole('textbox', { name: 'password' })).toBeVisible()
    })

    test('succeeds with correct credentials', async ({ page }) => {
      // NOTE: Playwright also offers a solution where the login is performed once before the tests,
      // and each test starts from a state where the application is already logged in.
      // But in order for us to take advantage of this method, the initialization of the application's test data
      // should be done a bit differently than now. In the current solution, the database is reset before each test,
      // and because of this, logging in just once before the tests is impossible. In order for us to use the pre-test
      // login provided by Playwright, the user should be initialized only once before the tests.
      await expect(page.getByText('new blog')).not.toBeVisible()
      await loginWith(page, loginUser.username, loginUser.password)
      // Should redirect to home page
      await expect(page).toHaveURL('/')
      await expect(page.getByText('login')).not.toBeVisible()
      await expect(page.getByText('new blog')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrongusername', 'wrongpassword')

      // Locate the MUI Alert error
      await expect(page.getByRole('alert').filter({ hasText: 'wrong username or password' })).toBeVisible()
      await expect(page.getByText('new blog')).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    const blogs = [
      {
        title: 'title_one',
        author: 'author_one',
        url: 'url_one'
      },
      {
        title: 'title_two',
        author: 'author_two',
        url: 'url_two'
      },
      {
        title: 'title_three',
        author: 'author_three',
        url: 'url_three'
      }
    ]

    beforeEach(async ({ page }) => {
      await loginWith(page, loginUser.username, loginUser.password)
      await page.waitForURL('/')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, blogs[0])
    })

    describe('and a blog is created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blogs[0])
      })

      test('user can like the blog', async ({ page }) => {
        await page.getByRole('link', { name: `${blogs[0].title} by ${blogs[0].author}` }).click()
        // Default 0 likes
        await expect(page.getByText('0 likes')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('1 like')).toBeVisible()
      })

      test('user (who added the blog) can delete the blog', async ({ page }) => {
        // Register the listener so playwright will accept deletion dialog
        page.on('dialog', dialog => dialog.accept())

        await page.getByRole('link', { name: `${blogs[0].title} by ${blogs[0].author}` }).click()

        await page.getByRole('button', { name: 'remove' }).click()

        // Should redirect to home page
        await expect(page).toHaveURL('/')
        await expect(page.getByRole('link', { name: `${blogs[0].title} by ${blogs[0].author}` })).toHaveCount(0)
      })

      test('delete button of blog cannot be seen by any user who did not add the blog', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, otherUser.username, otherUser.password)

        await page.getByRole('link', { name: `${blogs[0].title} by ${blogs[0].author}` }).click()
        await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
        await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
      })
    })

    describe('and a few blogs exist', () => {
      beforeEach(async ({ page }) => {
        for (const blog of blogs) {
          await createBlog(page, blog)   
        }
      })
  
      test('blogs are ordered by likes in descending order', async ({ page }) => {
        // Test likes -> [0, 2, 1] -> so order of blogs should be (by index) [1, 2, 0]
        const likeCounts = [0, 2, 1]

        for (let i = 0; i < blogs.length; i++) {
          const text = `${blogs[i].title} ${blogs[i].author}`
          await page.getByRole('link', { name: `${blogs[i].title} by ${blogs[i].author}` }).click()
          await expect(page.getByRole('button', { name: 'like' })).toBeVisible()

          // for (let j = 0; j < likeCounts[i]; j++) {
          //   // await page.getByText(text).locator('..').getByRole('button', { name: 'like' }).click()
          //   await page.getByRole('button', { name: 'like' }).click()
          //   await expect(page.getByText(`${j + 1} ${j + 1 === 1 ? 'like' : 'likes'}`)).toBeVisible()
          // }
          await likeTimes(page, page.getByRole('button', { name: 'like' }), likeCounts[i])

          await page.goto('/')
        }

        await expect(page.getByRole('link', { name: `${blogs[0].title} by ${blogs[0].author}` })).toBeVisible()

        const blogEls = await page.getByTestId('bloglist').locator('> *').all()

        const newOrder = [1, 2, 0]
        for (const [i, blogElement] of blogEls.entries()) {
          await expect(blogElement.getByRole('link', { name: `${blogs[newOrder[i]].title} by ${blogs[newOrder[i]].author}` })).toBeVisible()
        }
      })
    })
  })
})