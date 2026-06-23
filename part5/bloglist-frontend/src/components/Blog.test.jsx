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

  const blogUser = { username: 'myusername' }
  const otherUser = { usename: 'otheruser' }
  const mockOnLike = vi.fn()
  const mockOnDelete = vi.fn()

  test('when not authenticated, blog information is displayed but buttons are not', () => {
    render(
      <Blog blog={blog} currUser={null} onLike={mockOnLike} onDelete={mockOnDelete} />
    )

    // default text match: { exact: true }
    expect(screen.getByText(blog.title)).toBeVisible()
    expect(screen.getByText(`by ${blog.author}`)).toBeVisible()
    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(`Added by ${blog.user.name || blog.user.username}`)).toBeVisible()
    expect(screen.getByText(`${blog.likes} ${blog.likes === 1 ? 'like' : 'likes'}`)).toBeVisible()

    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
    // expect(screen.queryByText((_, element) => element.textContent === `${blog.likes} like`)).toBeNull()
  })

  describe('when authenticated', () => {
    test('users who are not the blog’s creator are shown only the like button', () => {
      render(
        <Blog blog={blog} currUser={otherUser} onLike={mockOnLike} onDelete={mockOnDelete} />
      )

      expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
      expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
    })

    test('the blog’s creator is shown both the like and the delete button', async () => {
      render(
        <Blog blog={blog} currUser={blogUser} onLike={mockOnLike} onDelete={mockOnDelete} />
      )

      expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
    })

    test('clicking the like button twice calls event handler twice', async () => {
      render(
        <Blog blog={blog} currUser={blogUser} onLike={mockOnLike} onDelete={mockOnDelete} />
      )

      const user = userEvent.setup()

      const likeButton = screen.getByRole('button', { name: /^like$/i })
      await user.dblClick(likeButton)
      expect(mockOnLike.mock.calls).toHaveLength(2)
    })
  })
})