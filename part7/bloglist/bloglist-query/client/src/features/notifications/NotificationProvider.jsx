import { useCallback, useMemo, useReducer, useRef, useEffect } from "react";
import {
  NotificationContext,
  NotificationDispatchContext,
} from "./NotificationContext";

const SHOW_NOTIFICATION = "SHOW_NOTIFICATION";
const CLEAR_NOTIFICATION = "CLEAR_NOTIFICATION";

function notificationReducer(state, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return action.payload;
    case CLEAR_NOTIFICATION:
      return { message: null };
    default:
      return state;
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, {
    message: null,
  });
  const timer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const clearNotification = useCallback(() => {
    dispatch({ type: CLEAR_NOTIFICATION });
  }, []);

  const showNotification = useCallback(
    (message, isError = false, seconds = 5) => {
      clearTimeout(timer.current);
      dispatch({
        type: SHOW_NOTIFICATION,
        payload: { message, isError },
      });
      timer.current = setTimeout(() => {
        clearNotification();
      }, seconds * 1000);
    },
    [clearNotification],
  );

  const actions = useMemo(() => {
    return { showNotification, clearNotification };
  }, [showNotification, clearNotification]);

  return (
    <NotificationContext.Provider value={notification}>
      <NotificationDispatchContext.Provider value={actions}>
        {props.children}
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
};
