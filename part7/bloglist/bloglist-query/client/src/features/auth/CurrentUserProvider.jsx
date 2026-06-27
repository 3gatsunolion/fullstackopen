import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CurrentUserContext,
  CurrentUserActionsContext,
} from "./CurrentUserContext";
import persistentUserService from "./persistentUserService";
import loginService from "./loginService";
import { useNotificationActions } from "../notifications/useNotification";
import { createQueryErrorHandler } from "../../utils/queryErrorHandler";

export const CurrentUserContextProvider = (props) => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const { showNotification, clearNotification } = useNotificationActions();

  const initialize = useCallback(() => {
    const verifiedUser = persistentUserService.getUser();
    setUser(verifiedUser);
  }, []);

  const login = useCallback(
    async (credentials) => {
      try {
        const verifiedUser = await loginService.login(credentials);
        persistentUserService.saveUser(verifiedUser);
        setUser(verifiedUser);
        clearNotification();
        navigate("/");
      } catch (error) {
        createQueryErrorHandler({
          showNotification,
          messages: {
            unauthorized: "Wrong username or password. Please try again.",
          },
        })(error);
      }
    },
    [navigate, showNotification, clearNotification],
  );

  const logout = useCallback(() => {
    persistentUserService.removeUser();
    setUser(null);
  }, []);

  const actions = useMemo(() => {
    return { initialize, login, logout };
  }, [initialize, login, logout]);

  return (
    <CurrentUserContext.Provider value={user}>
      <CurrentUserActionsContext.Provider value={actions}>
        {props.children}
      </CurrentUserActionsContext.Provider>
    </CurrentUserContext.Provider>
  );
};
