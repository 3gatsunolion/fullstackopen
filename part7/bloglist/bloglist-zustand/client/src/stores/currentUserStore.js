import { create } from "zustand";
import { devtools } from "zustand/middleware";
import persistentUserService from "../services/persistentUser";
import loginService from "../services/login";

const useCurrentUserStore = create(
  devtools((set) => ({
    user: null,
    actions: {
      login: async (credentials) => {
        const verifiedUser = await loginService.login(credentials);
        persistentUserService.saveUser(verifiedUser);
        set(() => ({ user: verifiedUser }));
      },
      logout: () => {
        persistentUserService.removeUser();
        set(() => ({ user: null }));
      },
      initialize: () => {
        const user = persistentUserService.getUser();
        set(() => ({ user }));
      },
    },
  })),
);

export default useCurrentUserStore;

export const useCurrentUser = () => useCurrentUserStore((state) => state.user);
export const useCurrentUserActions = () =>
  useCurrentUserStore((state) => state.actions);
