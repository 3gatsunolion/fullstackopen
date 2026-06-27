import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Link,
} from "@mui/material";
import NotFound from "../components/NotFound";
import BlogCommentSection from "../components/BlogCommentSection";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCurrentUser,
  useCurrentUserActions,
} from "../stores/currentUserStore";
import { useBlogActions, useBlogs } from "../stores/blogStore";
import { useNotificationActions } from "../stores/notificationStore";
import { createQueryErrorHandler } from "../utils/queryErrorHandler";

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const currUser = useCurrentUser();
  const { logout } = useCurrentUserActions();
  const blogs = useBlogs();
  const blog = blogs.find((b) => b.id === id);

  const { likeBlog, deleteBlog } = useBlogActions();
  const { showNotification } = useNotificationActions();

  // Not yet initialized, assuming backend has at least 1 blog
  // already stored (kind of hacky, probably could add isPending and isError
  // state like in Tanstack Query, but this works for now)
  if (blogs.length === 0) {
    return <h2>Loading...</h2>;
  }

  if (!blog) {
    return <NotFound />;
  }

  const handleLike = async () => {
    try {
      await likeBlog(blog);
    } catch (error) {
      handleError(error, "like");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await deleteBlog(blog.id);
        navigate("/");
      } catch (error) {
        handleError(error, "delete");
      }
    }
  };

  const handleError = (error, actionType) => {
    createQueryErrorHandler({
      showNotification,
      messages: {
        unauthorized: `Please log in to ${actionType} blog.`,
      },
      onUnauthorized: logout,
    })(error);
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5">{blog.title}</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography sx={{ color: "text.secondary", mt: 1 }}>
            by {blog.author}
          </Typography>
          <Link href={blog.url} target="_blank" rel="noopener" color="primary">
            {blog.url}
          </Link>
          {blog.user && (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Added by {blog.user.name || blog.user.username}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography>
              {`${blog.likes} ${blog.likes === 1 ? "like" : "likes"}`}
            </Typography>
            {currUser && (
              <Button variant="outlined" size="small" onClick={handleLike}>
                like
              </Button>
            )}
            {currUser &&
              blog.user &&
              blog.user.username === currUser.username && (
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleDelete}
                >
                  remove
                </Button>
              )}
          </Box>
          <BlogCommentSection blog={blog} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default Blog;
