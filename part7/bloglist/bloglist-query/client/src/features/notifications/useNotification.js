import { useContext } from "react";
import {
  NotificationContext,
  NotificationDispatchContext,
} from "./NotificationContext";

export const useNotification = () => useContext(NotificationContext);
export const useNotificationActions = () =>
  useContext(NotificationDispatchContext);
