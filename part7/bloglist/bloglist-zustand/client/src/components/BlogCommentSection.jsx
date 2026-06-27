import { Box, Button, Typography, TextField } from "@mui/material";
import NotFound from "./NotFound";
import useField from "../hooks/useField";
import { useBlogActions } from "../stores/blogStore";
import { useNotificationActions } from "../stores/notificationStore";
import { createQueryErrorHandler } from "../utils/queryErrorHandler";

const BlogCommentSection = ({ blog }) => {
  const { reset, ...comment } = useField("text");

  const { comment: commentBlog } = useBlogActions();
  const { showNotification } = useNotificationActions();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await commentBlog(blog.id, comment.value);
      reset();
    } catch (error) {
      createQueryErrorHandler({ showNotification })(error);
    }
  };

  return (
    <Box>
      <Typography variant="h6">comments</Typography>
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="comment"
          size="small"
          placeholder="add a comment"
          {...comment}
        />
        <Button type="submit" variant="contained">
          add comment
        </Button>
      </Box>
      <ul>
        {blog.comments.map((c, i) => (
          <li key={`blog-comment-${i}`}>{c}</li>
        ))}
      </ul>
    </Box>
  );
};

export default BlogCommentSection;
