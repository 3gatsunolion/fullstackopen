import { TextField, Button, Stack } from "@mui/material";
import useField from "../../hooks/useField";
import { useCurrentUserActions } from "./useCurrentUser";

const style = {
  "& .MuiFilledInput-root": {
    backgroundColor: "white",
  },
};

const LoginForm = () => {
  const { reset: _ru, ...username } = useField("text");
  const { reset: _rp, ...password } = useField("password");

  const { login } = useCurrentUserActions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username: username.value, password: password.value });
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
