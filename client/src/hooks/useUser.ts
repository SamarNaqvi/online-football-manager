import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../service";

interface User {
  name: string;
  email: string;
  token:string;
  access_token:string
}

export const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
};

const storeUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getStoredUser,
    initialData: getStoredUser(),
    staleTime: Infinity,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      //@ts-ignore
      const userData = response?.data;
      storeUser(userData);
      queryClient.setQueryData(["user"], userData);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => {
      storeUser(null);
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
    },
  });
}; 