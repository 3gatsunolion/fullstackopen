import { Alert } from "@mui/material";
import { useNotification } from "../stores/notificationStore";

const Notification = () => {
  const { message, isError } = useNotification();

  if (!message) {
    return null;
  }

  return (
    <Alert
      style={{ marginTop: 10, marginBottom: 10 }}
      severity={isError ? "error" : "success"}
    >
      {message}
    </Alert>
  );
};

export default Notification;
