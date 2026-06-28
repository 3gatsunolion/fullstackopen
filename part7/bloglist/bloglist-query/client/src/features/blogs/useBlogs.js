import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import blogService from "./blogService";
import { useNotificationActions } from "../notifications/useNotification";
import { useCurrentUserActions } from "../auth/useCurrentUser";
import { createQueryErrorHandler } from "../../utils/queryErrorHandler";

const useAppContext = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useCurrentUserActions();
  const { showNotification } = useNotificationActions();

  return {
    queryClient,
    navigate,
    logout,
    showNotification,
  };
};

export const useBlogs = () => {
  // Note: useQuery automatically runs the queryFn on mount
  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    staleTime: Infinity, // never becomes stale automatically (since nobody else it editing blogs but me, in production prob comment this out)
    // refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: 1,
    // placeholderData: [],
  });

  return {
    blogs: result.data,
    isPending: result.isPending,
    isError: result.isError,
  };
};

export const useBlog = (id) => {
  const result = useQuery({
    queryKey: ["blogs", id],
    queryFn: () => blogService.getOne(id),
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    blog: result.data,
    isPending: result.isPending,
    isError: result.isError,
  };
};

export const useCreateBlog = () => {
  const { queryClient, navigate, logout, showNotification } = useAppContext();

  const { mutate: mutateFn, ...mutation } = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.setQueryData(["blogs"], (blogs) => {
        if (!blogs) return blogs;
        return blogs.concat(newBlog);
      });
      showNotification(
        `a new blog: ${newBlog.title} by ${newBlog.author} added`,
      );
      // stale blogs in user (can update it manually here, but let's just make
      // it refetch just for funsies)
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/");
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

  return {
    createBlog: mutateFn,
    ...mutation,
  };
};

export const useLikeBlog = () => {
  const { queryClient, logout, showNotification } = useAppContext();

  const { mutate: mutateFn, ...mutation } = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updated) => {
      queryClient.setQueryData(["blogs", updated.id], updated);
      queryClient.setQueryData(["blogs"], (blogs) => {
        if (!blogs) return blogs;
        return blogs.map((b) => (b.id === updated.id ? updated : b));
      });
    },
  });

  return {
    likeBlog: (blog) =>
      mutateFn(
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
    ...mutation,
  };
};

export const useDeleteBlog = () => {
  const { queryClient, navigate, logout, showNotification } = useAppContext();

  const { mutate: mutateFn, ...mutation } = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["blogs"], (blogs) => {
        if (!blogs) return blogs;
        return blogs.filter((b) => b.id !== id);
      });
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

  return {
    deleteBlog: mutateFn,
    ...mutation,
  };
};

export const useCommentBlog = () => {
  const { queryClient, showNotification } = useAppContext();

  const { mutate: mutateFn, ...mutation } = useMutation({
    mutationFn: ({ id, comment }) => blogService.comment(id, comment),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(["blogs", updatedBlog.id], updatedBlog);
      queryClient.setQueryData(["blogs"], (blogs) => {
        if (!blogs) return blogs;
        return blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b));
      });
    },
    onError: createQueryErrorHandler({ showNotification }),
  });

  return {
    comment: (id, comment) => mutateFn({ id, comment }),
    ...mutation,
  };
};
