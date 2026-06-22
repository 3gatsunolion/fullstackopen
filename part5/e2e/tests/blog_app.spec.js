const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // NOTE: Playwright also offers a solution where the login is performed once before the tests,
      // and each test starts from a state where the application is already logged in.
      // But in order for us to take advantage of this method, the initialization of the application's test data
      // should be done a bit differently than now. In the current solution, the database is reset before each test,
      // and because of this, logging in just once before the tests is impossible. In order for us to use the pre-test
      // login provided by Playwright, the user should be initialized only once before the tests.
      await loginWith(page, loginUser.username, loginUser.password)
      await expect(page.getByText(`${loginUser.username} logged in`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrongusername', 'wrongpassword')

      const errorDiv = page.getByTestId('notification')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText(`${loginUser.username} logged in`)).not.toBeVisible()
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
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, blogs[0])
      await expect(page.getByText(`${blogs[0].title} ${blogs[0].author}`)).toBeVisible()
    })

    describe('and a blog is created', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, blogs[0])
      })

      test('user can like the blog', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        // Default 0 likes
        await expect(page.getByText('0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('1')).toBeVisible()
      })

      test('user (who added the blog) can delete the blog', async ({ page }) => {
        // Register the listener so playwright will accept deletion dialog
        page.on('dialog', dialog => dialog.accept())

        const blogToDelete = page.getByText(`${blogs[0].title} ${blogs[0].author}`)

        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(blogToDelete).toHaveCount(0)
      })

      test('delete button of blog cannot be seen by any user who did not add the blog', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, otherUser.username, otherUser.password)

        await page.getByRole('button', { name: 'view' }).click()
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
          await page.getByText(text).getByRole('button', { name: 'view' }).click()

          for (let j = 0; j < likeCounts[i]; j++) {
            await page.getByText(text).locator('..').getByRole('button', { name: 'like' }).click()
            await expect(page.getByText(text).locator('..').getByText(`${j + 1}`)).toBeVisible()
          }
        }

        for (const [i, blogElement] of (await page.locator('.blog').all()).entries()) {
          await expect(blogElement.getByText(`${likeCounts.length - i - 1}`)).toBeVisible()
        }
      })
    })
  })
})