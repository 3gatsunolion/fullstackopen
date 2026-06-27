import { TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";
import { useCurrentUserActions } from "../stores/currentUserStore";
import { useNotificationActions } from "../stores/notificationStore";
import { createQueryErrorHandler } from "../utils/queryErrorHandler";

const style = {
  "& .MuiFilledInput-root": {
    backgroundColor: "white",
  },
};

const LoginForm = () => {
  const { reset: _ru, ...username } = useField("text");
  const { reset: _rp, ...password } = useField("password");

  const { login } = useCurrentUserActions();
  const { showNotification, hideNotification } = useNotificationActions();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await login({ username: username.value, password: password.value });
      hideNotification();
      navigate("/");
    } catch (error) {
      createQueryErrorHandler({
        showNotification,
        messages: {
          unauthorized: "Wrong username or password. Please try again.",
        },
      })(error);
    }
  };

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <div>
            <TextField
              {...username}
              hiddenLabel
              placeholder="username"
              variant="filled"
              size="small"
              sx={style}
            />
          </div>
          <div>
            <TextField
              {...password}
              hiddenLabel
              placeholder="password"
              variant="filled"
              size="small"
              sx={style}
            />
          </div>
          <div>
            <Button type="submit" variant="contained">
              login
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
};

export default LoginForm;
