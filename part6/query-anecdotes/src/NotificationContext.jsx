import { createContext, useState, useRef, useEffect } from 'react'

const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = (props) => {
  const [notification, setNotification] = useState('')
  const timer = useRef(null)

  useEffect(() => {
    return () => clearTimeout(timer.current)
  }, [])
  
  const showNotification = (message, seconds=5) => {
    clearTimeout(timer.current)
    setNotification(message)
    timer.current = setTimeout(() => {
      setNotification('')
    }, seconds * 1000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {props.children}
    </NotificationContext.Provider>
  )
}