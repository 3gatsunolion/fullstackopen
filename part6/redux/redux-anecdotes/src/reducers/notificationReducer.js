import { createSlice } from '@reduxjs/toolkit'

let timer
export const notify = (message, seconds=5) => {
  return async (dispatch) => {
    clearTimeout(timer)
    dispatch(setNotification(message))
    timer = setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer