import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin({ username, password })
  }

  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <div>
            <TextField
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              hiddenLabel
              placeholder="username"
              variant="filled"
              size="small"
              sx={{ '& .MuiFilledInput-root': {
                backgroundColor: 'white'
              } }}
            />
          </div>
          <div>
            <TextField
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              hiddenLabel
              placeholder="password"
              variant="filled"
              size="small"
              sx={{ '& .MuiFilledInput-root': {
                backgroundColor: 'white'
              } }}
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
  )
}

export default LoginForm