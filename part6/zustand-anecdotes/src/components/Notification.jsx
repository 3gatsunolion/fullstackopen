import { useNotification } from '../store'

const Notification = () => {
  const notification = useNotification()
 
  if (!notification) return null

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return <div style={style}>{notification}</div>
}

export default Notification