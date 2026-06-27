import { create } from "zustand";
import { devtools } from "zustand/middleware";
import userService from "../services/users";

const useUserStore = create(
  devtools((set, get) => ({
    users: [],
    actions: {
      initialize: async () => {
        const users = await userService.getAll();
        set(() => ({ users }));
      },
      addBlog: (userId, blog) => {
        const userToUpdate = get().users.find((u) => u.id === userId);
        const newUser = { ...userToUpdate };
        newUser.blogs = userToUpdate.blogs.concat(blog);
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? newUser : u)),
        }));
      },
      removeBlog: (userId, blogId) => {
        const userToUpdate = get().users.find((u) => u.id === userId);
        const newUser = { ...userToUpdate };
        newUser.blogs = userToUpdate.blogs.filter((b) => b.id !== blogId);
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? newUser : u)),
        }));
      },
    },
  })),
);

export default useUserStore;

export const useUsers = () => useUserStore((state) => state.users);
export const useUsersActions = () => useUserStore((state) => state.actions);
