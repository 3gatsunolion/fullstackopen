import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
} from "@mui/material";
import Blog from "./pages/Blog";
import BlogList from "./pages/BlogList";
import BlogForm from "./pages/BlogForm";
import LoginForm from "./pages/LoginForm";
import UserList from "./pages/UserList";
import User from "./pages/User";
import Notification from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";

import { useNotificationActions } from "./stores/notificationStore";
import { useBlogActions } from "./stores/blogStore";
import {
  useCurrentUser,
  useCurrentUserActions,
} from "./stores/currentUserStore";
import { useUsersActions } from "./stores/userStore";

const App = () => {
  const user = useCurrentUser();
  const { initialize: initializeUser, logout } = useCurrentUserActions();
  const { initialize: initializeUsers } = useUsersActions();

  const { hideNotification } = useNotificationActions();
  const { initialize: initializeBlogs } = useBlogActions();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    initializeUser();
    initializeBlogs();
    initializeUsers();
  }, [initializeUser, initializeBlogs, initializeUsers]);

  const handleLogout = () => {
    hideNotification();
    logout();
    navigate("/");
  };

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Blog App
          </Typography>
          <Box sx={{ display: { sm: "block" } }}>
            <Button color="inherit" component={Link} to="/" sx={style}>
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users" sx={style}>
              users
            </Button>
            {user && (
              <Button color="inherit" component={Link} to="/create" sx={style}>
                new blog
              </Button>
            )}
            {user ? (
              <Button color="inherit" onClick={handleLogout} sx={style}>
                logout
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login" sx={style}>
                login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Notification />
      <ErrorBoundary key={location.pathname}>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
