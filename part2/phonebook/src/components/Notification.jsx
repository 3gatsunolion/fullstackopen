const Notification = ({ notification }) => {
  const { message, className } = notification
  
  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification