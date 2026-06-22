import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'hello',
    author: 'whoami',
    likes: 2,
    url: 'www.test.com/hello.html',
    user: {
      username: 'myusername',
      name: 'My Name',
      id: 'thisismyid'
    }
  }

  const user = { username: 'myusername' }
  const mockOnLike = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    render(
      <Blog blog={blog} currUser={user} onLike={mockOnLike} onDelete={mockOnDelete} />
    )
  })

  test('at start blog\'s title and author are displayed, but URL and number of likes are not rendered', () => {
    // default text match: { exact: true }
    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeVisible()

    expect(screen.queryByText(blog.url)).toBeNull()

    expect(screen.queryByText((_, element) => element.textContent === `${blog.likes} like`)).toBeNull()
  })

  test('after clicking the `view` button, URL and number of likes are shown', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('view')
    await user.click(showButton)

    expect(screen.queryByText(blog.url)).toBeVisible()
    expect(screen.queryByText((_, element) => element.textContent === `${blog.likes} like`)).toBeVisible()
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('view')
    await user.click(showButton)

    const likeButton = screen.getByRole('button', { name: /^like$/i })
    await user.dblClick(likeButton)
    expect(mockOnLike.mock.calls).toHaveLength(2)
  })
})