import { useContext, useEffect, useRef } from "react";
import { SHOW_NOTIFICATION, CLEAR_NOTIFICATION } from "./NotificationProvider";
import {
  NotificationContext,
  NotificationDispatchContext,
} from "./NotificationContext";

export const useNotification = () => useContext(NotificationContext);

let timer;
export const useNotificationActions = () => {
  const dispatch = useContext(NotificationDispatchContext);

  const clearNotification = () => {
    dispatch({ type: CLEAR_NOTIFICATION });
  };

  const showNotification = (message, isError = false, seconds = 5) => {
    clearTimeout(timer);
    dispatch({
      type: SHOW_NOTIFICATION,
      payload: { message, isError },
    });
    timer = setTimeout(() => {
      clearNotification();
    }, seconds * 1000);
  };

  return { showNotification, clearNotification };
};
