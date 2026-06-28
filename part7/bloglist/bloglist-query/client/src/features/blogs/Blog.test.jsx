import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useParams } from "react-router-dom";
import {
  useBlog,
  useLikeBlog,
  useDeleteBlog,
  useCommentBlog,
} from "./useBlogs";
import * as currentUserStore from "../auth/useCurrentUser";
import Blog from "./Blog";

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock("./useBlogs", () => ({
  useBlog: vi.fn(),
  useLikeBlog: vi.fn(),
  useDeleteBlog: vi.fn(),
  useCommentBlog: vi.fn(),
}));

const blog = {
  id: "blogid!",
  title: "hello",
  author: "whoami",
  likes: 2,
  url: "www.test.com/hello.html",
  user: {
    username: "myusername",
    name: "My Name",
    id: "thisismyid",
  },
  comments: [],
};

const blogUser = { username: "myusername" };
const otherUser = { usename: "otheruser" };
const mockOnLike = vi.fn();
const mockOnDelete = vi.fn();
const mockOnComment = vi.fn();

describe("<Blog />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLikeBlog).mockReturnValue({
      likeBlog: mockOnLike,
    });
    vi.mocked(useDeleteBlog).mockReturnValue({
      deleteBlog: mockOnDelete,
    });
    vi.mocked(useCommentBlog).mockReturnValue({
      comment: mockOnComment,
    });
  });

  test("shows loading when blogs are not yet initialized/fetched", () => {
    vi.mocked(useParams).mockReturnValue({ id: blog.id });

    vi.mocked(useBlog).mockReturnValue({
      blog: [],
      isPending: true,
    });

    // const { debug } = render(<Blog />);
    // debug();
    render(<Blog />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("shows NotFound when blog does not exist", () => {
    vi.mocked(useParams).mockReturnValue({ id: "1" });

    vi.mocked(useBlog).mockReturnValue({
      blog: null,
      isPending: false,
      isError: true,
    });

    render(<Blog />);

    expect(
      screen.getByRole("heading", { name: /404 — page not found/i }),
    ).toBeInTheDocument();
  });

  test("when not authenticated, blog information is displayed but buttons are not", () => {
    vi.mocked(useParams).mockReturnValue({ id: blog.id });
    vi.mocked(useBlog).mockReturnValue({
      blog,
    });

    render(<Blog />);

    // default text match: { exact: true }
    expect(screen.getByText(blog.title)).toBeVisible();
    expect(screen.getByText(`by ${blog.author}`)).toBeVisible();
    expect(screen.getByText(blog.url)).toBeVisible();
    expect(
      screen.getByText(`Added by ${blog.user.name || blog.user.username}`),
    ).toBeVisible();
    expect(
      screen.getByText(`${blog.likes} ${blog.likes === 1 ? "like" : "likes"}`),
    ).toBeVisible();

    expect(screen.queryByRole("button", { name: "like" })).toBeNull();
    expect(screen.queryByRole("button", { name: "remove" })).toBeNull();
  });

  describe("when authenticated", () => {
    beforeEach(() => {
      vi.mocked(useParams).mockReturnValue({ id: blog.id });
    });

    test("users who are not the blog’s creator are shown only the like button", () => {
      vi.spyOn(currentUserStore, "useCurrentUser").mockReturnValue(otherUser);

      render(<Blog />);

      expect(screen.getByRole("button", { name: "like" })).toBeVisible();
      expect(screen.queryByRole("button", { name: "remove" })).toBeNull();
    });

    test("the blog’s creator is shown both the like and the delete button", async () => {
      vi.spyOn(currentUserStore, "useCurrentUser").mockReturnValue(blogUser);

      render(<Blog />);

      expect(screen.getByRole("button", { name: "like" })).toBeVisible();
      expect(screen.getByRole("button", { name: "remove" })).toBeVisible();
    });

    test("clicking the like button twice calls event handler twice", async () => {
      vi.spyOn(currentUserStore, "useCurrentUser").mockReturnValue(blogUser);

      render(<Blog />);

      const user = userEvent.setup();

      const likeButton = screen.getByRole("button", { name: /^like$/i });
      await user.dblClick(likeButton);
      expect(mockOnLike.mock.calls).toHaveLength(2);
    });
  });
});
