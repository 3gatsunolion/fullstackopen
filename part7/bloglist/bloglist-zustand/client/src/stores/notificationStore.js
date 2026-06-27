import { create } from "zustand";

let timer;
const useNotificationStore = create((set, get) => ({
  message: null,
  isError: false,
  actions: {
    showNotification: (message, isError = false, seconds = 5) => {
      clearTimeout(timer);
      set(() => ({ message, isError }));
      timer = setTimeout(() => {
        get().actions.hideNotification();
      }, seconds * 1000);
    },
    hideNotification: () => {
      clearTimeout(timer);
      set(() => ({ message: null }));
    },
  },
}));

export default useNotificationStore;

export const useNotification = () => {
  const message = useNotificationStore((s) => s.message);
  const isError = useNotificationStore((s) => s.isError);

  return { message, isError };
};

export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
