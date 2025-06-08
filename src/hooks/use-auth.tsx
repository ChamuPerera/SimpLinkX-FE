/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IUser } from "@/types/user";
import type { RegisterFormValues } from "@/validations/register";
import type { UseMutationResult } from "@tanstack/react-query";
import type { FC, ReactNode } from "react";

import { authServices } from "@/services/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router";

// Authentication context
interface AuthContextType {
  user: IUser | null | undefined;
  isAuthenticated: boolean;
  isUserLoading: boolean;
  login: UseMutationResult<
    IUser,
    Error,
    { email: string; password: string },
    unknown
  >;
  register: UseMutationResult<void, Error, RegisterFormValues, unknown>;
  changePassword: UseMutationResult<
    void,
    Error,
    { currentPassword: string; newPassword: string; confirmPassword: string },
    unknown
  >;
  logout: UseMutationResult<void, Error, void, unknown>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isUserLoading: true,
  isAuthenticated: false,
  login: {} as UseMutationResult<
    IUser,
    Error,
    { email: string; password: string },
    unknown
  >,
  register: {} as UseMutationResult<void, Error, RegisterFormValues, unknown>,
  changePassword: {} as UseMutationResult<
    void,
    Error,
    { currentPassword: string; newPassword: string; confirmPassword: string },
    unknown
  >,
  logout: {} as UseMutationResult<void, Error, void, unknown>,
});

export const AuthProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // get current user
  const { data: user, isLoading: isUserLoading } = useQuery<IUser | null>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const user = await authServices.getCurrentUser();
        return user;
      } catch (_error) {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 1000 * 60 * 5, // 5 min
  });

  // login mutation
  const loginMutation = useMutation({
    mutationFn: (credential: { email: string; password: string }) =>
      authServices.login(credential.email, credential.password),
    onSuccess() {
      queryClient
        .invalidateQueries({
          queryKey: ["user"],
        })
        .then(() => {
          navigate("/dashboard");
        });
    },
  });

  // register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormValues) => authServices.register(data),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      navigate("/login");
    },
  });

  // logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authServices.logout(),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      navigate("/login");
    },
  });

  // change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (passwords: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) =>
      authServices.changePassword(
        passwords.currentPassword,
        passwords.newPassword,
        passwords.confirmPassword,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });

      // redirect to login page
      navigate("/login");
    },
  });

  // context value
  const authContextValue: AuthContextType = {
    user,
    isUserLoading,
    isAuthenticated: !!user,
    login: loginMutation,
    logout: logoutMutation,
    changePassword: changePasswordMutation,
    register: registerMutation,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
