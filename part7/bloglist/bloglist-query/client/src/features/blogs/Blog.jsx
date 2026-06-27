import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Link,
} from "@mui/material";
import NotFound from "../../components/NotFound";
import BlogCommentSection from "./BlogCommentSection";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../auth/useCurrentUser";
import { useBlogs } from "./useBlogs";

const Blog = () => {
  const { id } = useParams();

  const currUser = useCurrentUser();
  const { blogs, isPending, isError, likeBlog, deleteBlog } = useBlogs();

  if (isPending) {
    return <h2>Loading...</h2>;
  }

  const blog = blogs.find((b) => b.id === id);

  if (isError || !blog) {
    return <NotFound />;
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await deleteBlog(blog.id);
    }
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
              <Button
                variant="outlined"
                size="small"
                onClick={() => likeBlog(blog)}
              >
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
