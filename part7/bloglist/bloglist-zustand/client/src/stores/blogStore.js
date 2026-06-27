import { create } from "zustand";
import { devtools } from "zustand/middleware";
import blogService from "../services/blogs";
import useUserStore from "./userStore";

const useBlogStore = create(
  devtools((set, get) => ({
    blogs: [],
    actions: {
      likeBlog: async (blog) => {
        const updated = await blogService.update(blog.id, {
          ...blog,
          likes: blog.likes + 1,
        });
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === blog.id ? updated : b)),
        }));
      },
      createBlog: async (blog) => {
        const newBlog = await blogService.create(blog);
        set((state) => ({
          blogs: state.blogs.concat(newBlog),
        }));
        useUserStore.getState().actions.addBlog(newBlog.user.id, newBlog);
      },
      deleteBlog: async (id) => {
        await blogService.remove(id);
        const blogDeleted = get().blogs.find((b) => b.id === id);
        set((state) => ({
          blogs: state.blogs.filter((b) => b.id !== id),
        }));
        useUserStore.getState().actions.removeBlog(blogDeleted.user.id, id);
      },
      comment: async (id, comment) => {
        const updatedBlog = await blogService.comment(id, comment);
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === id ? updatedBlog : b)),
        }));
      },
      initialize: async () => {
        const blogs = await blogService.getAll();
        set(() => ({ blogs }));
      },
    },
  })),
);

export default useBlogStore;

export const useBlogs = () => {
  const blogs = useBlogStore((state) => state.blogs);
  return blogs.toSorted((a, b) => b.likes - a.likes);
};
export const useBlogActions = () => useBlogStore((state) => state.actions);
