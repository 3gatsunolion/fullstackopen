import { Link, useParams } from "react-router-dom";
import { useUsers } from "../stores/userStore";
import NotFound from "../components/NotFound";
import { Box, Typography } from "@mui/material";

const User = () => {
  const { id } = useParams();
  const user = useUsers().find((user) => user.id === id);

  if (!user) {
    return <NotFound />;
  }

  return (
    <div>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
        <Typography variant="h5">{user.name || user.username}</Typography>
        <Typography variant="h6">added blogs</Typography>
      </Box>
      <ul>
        {user.blogs.map((b) => (
          <li key={b.id}>
            <Link to={`/blogs/${b.id}`}>{b.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;
