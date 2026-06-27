import { useQuery } from "@tanstack/react-query";
import userService from "./userService";

export const useUsers = () => {
  // console.log("re-render");
  // Note: useQuery automatically runs the queryFn on mount
  const result = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    staleTime: Infinity,
    // refetchOnWindowFocus: false,
    retry: 1,
    placeholderData: [],
  });

  return {
    users: result.data,
    isPending: result.isPending,
    isError: result.isError,
  };
};
