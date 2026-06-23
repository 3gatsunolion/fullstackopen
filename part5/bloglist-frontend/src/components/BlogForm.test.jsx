import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('should call the event handler with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const mockCreateBlog = vi.fn()

    render(<BlogForm createBlog={mockCreateBlog} />)

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const sendButton = screen.getByText('create')

    const newBlog = {
      title: 'test title',
      author: 'test author',
      url: 'test url'
    }

    await user.type(titleInput, newBlog.title)
    await user.type(authorInput, newBlog.author)
    await user.type(urlInput, newBlog.url)
    await user.click(sendButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0].title).toBe(newBlog.title)
    expect(mockCreateBlog.mock.calls[0][0].author).toBe(newBlog.author)
    expect(mockCreateBlog.mock.calls[0][0].url).toBe(newBlog.url)
  })
})