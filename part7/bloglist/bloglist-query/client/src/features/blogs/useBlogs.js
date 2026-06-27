import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import blogService from "./blogService";
import { useNotificationActions } from "../notifications/useNotification";
import { useCurrentUserActions } from "../auth/useCurrentUser";
import { createQueryErrorHandler } from "../../utils/queryErrorHandler";

export const useBlogs = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useCurrentUserActions();
  const { showNotification } = useNotificationActions();

  // Note: useQuery automatically runs the queryFn on mount
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    staleTime: Infinity, // never becomes stale automatically (since nobody else it editing blogs but me)
    // refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: 1,
    // placeholderData: [],
  });

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
      showNotification(
        `a new blog: ${newBlog.title} by ${newBlog.author} added`,
      );
      navigate("/");
      // stale blogs in user (can update it manually here, but let's just make
      // it refetch just for funsies)
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: createQueryErrorHandler({
      showNotification,
      messages: {
        unauthorized: "Please log in to create blog.",
        client: "Title, author and URL must not be empty.",
      },
      onUnauthorized: () => {
        logout();
        navigate("/");
      },
    }),
  });

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updated) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id === updated.id ? updated : b)),
      );
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, id) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((b) => b.id !== id),
      );
      navigate("/");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: createQueryErrorHandler({
      showNotification,
      messages: {
        unauthorized: "Please log in to delete blog.",
      },
      onUnauthorized: logout,
    }),
  });

  const commentBlogMutation = useMutation({
    mutationFn: ({ id, comment }) => blogService.comment(id, comment),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((b) => (b.id !== updatedBlog.id ? b : updatedBlog)),
      );
    },
    onError: createQueryErrorHandler({ showNotification }),
  });

  return {
    blogs: result.data,
    isPending: result.isPending,
    isError: result.isError,
    createBlog: newBlogMutation.mutate,
    likeBlog: (blog) =>
      updateBlogMutation.mutate(
        {
          ...blog,
          likes: blog.likes + 1,
        },
        {
          onError: createQueryErrorHandler({
            showNotification,
            messages: {
              unauthorized: "Please log in to like blog.",
            },
            onUnauthorized: logout,
          }),
        },
      ),
    deleteBlog: (blog) => deleteBlogMutation.mutate(blog),
    comment: (id, comment) => commentBlogMutation.mutate({ id, comment }),
  };
};
