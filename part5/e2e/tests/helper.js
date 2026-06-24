const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, username, password)  => {
  await page.goto('/login')
  await page.getByRole('textbox', { name: 'username' }).fill(username)
  await page.getByRole('textbox', { name: 'password' }).fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.goto('/create')
  await page.getByLabel('title').fill(blog.title)
  await page.getByLabel('author').fill(blog.author)
  await page.getByLabel('url').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.waitForURL('/')
  await page.getByRole('link', { name: `${blog.title} by ${blog.author}` }).waitFor()
}

const likeTimes = async (page, button, n) => {
  for (let i = 0; i < n; i++) {
    await button.click()
    await button
      .locator('..')
      .getByText(`${i + 1} ${i + 1 === 1 ? 'like' : 'likes'}`)
      .waitFor()
  }
}

export { loginWith, createBlog, likeTimes }