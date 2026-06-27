import { Input, TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";
import { useBlogActions } from "../stores/blogStore";
import { useCurrentUserActions } from "../stores/currentUserStore";
import { useNotificationActions } from "../stores/notificationStore";
import { createQueryErrorHandler } from "../utils/queryErrorHandler";

const BlogForm = () => {
  const { reset: _rt, ...title } = useField("text");
  const { reset: _ra, ...author } = useField("text");
  const { reset: _ru, ...url } = useField("text");
  const navigate = useNavigate();

  const { createBlog } = useBlogActions();
  const { logout } = useCurrentUserActions();
  const { showNotification } = useNotificationActions();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await createBlog({
        title: title.value,
        author: author.value,
        url: url.value,
      });
      navigate("/");
      showNotification(`a new blog: ${title.value} by ${author.value} added`);
    } catch (error) {
      createQueryErrorHandler({
        showNotification,
        messages: {
          unauthorized: "Please log in to create blog.",
          client: "Title, author and URL must not be empty.",
        },
        onUnauthorized: () => {
          logout();
          navigate("/");
        },
      })(error);
    }
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField label="title" size="small" {...title} />
          <TextField label="author" size="small" {...author} />
          <TextField label="url" size="small" {...url} />
          <div>
            <Button type="submit" variant="contained">
              create
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
};

export default BlogForm;
