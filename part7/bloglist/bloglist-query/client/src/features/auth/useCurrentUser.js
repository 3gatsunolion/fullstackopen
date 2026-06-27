import { useContext } from "react";
import {
  CurrentUserContext,
  CurrentUserActionsContext,
} from "./CurrentUserContext";

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useCurrentUserActions = () =>
  useContext(CurrentUserActionsContext);
