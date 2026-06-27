import { Input, TextField, Button, Stack } from "@mui/material";
import useField from "../../hooks/useField";
import { useBlogs } from "./useBlogs";

const BlogForm = () => {
  const { reset: _rt, ...title } = useField("text");
  const { reset: _ra, ...author } = useField("text");
  const { reset: _ru, ...url } = useField("text");

  const { createBlog } = useBlogs();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    });
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
