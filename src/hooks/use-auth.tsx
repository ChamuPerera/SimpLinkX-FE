/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User } from "@/services/users";
import type { RegisterFormValues } from "@/validations/register";
import type { UseMutationResult } from "@tanstack/react-query";
import type { FC, ReactNode } from "react";

import { authServices } from "@/services/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router";

// Authentication context
interface AuthContextType {
  user: User | null | undefined;
  isAuthenticated: boolean;
  isUserLoading: boolean;
  login: UseMutationResult<
    User,
    Error,
    { email: string; password: string; rememberMe: boolean; navigate?: string },
    unknown
  >;
  register: UseMutationResult<void, Error, RegisterFormValues, unknown>;
  changePassword: UseMutationResult<
    void,
    Error,
    { currentPassword: string; newPassword: string; confirmPassword: string },
    unknown
  >;
  changeEmail: UseMutationResult<void, Error, { email: string }, unknown>;
  forgotPassword: UseMutationResult<void, Error, { email: string }, unknown>;
  validateResetToken: UseMutationResult<
    { valid: boolean; email: string },
    Error,
    { token: string; email: string },
    unknown
  >;
  resetPassword: UseMutationResult<
    void,
    Error,
    {
      token: string;
      email: string;
      newPassword: string;
      confirmPassword: string;
    },
    unknown
  >;
  logout: UseMutationResult<void, Error, void, unknown>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isUserLoading: true,
  isAuthenticated: false,
  login: {} as UseMutationResult<
    User,
    Error,
    { email: string; password: string; rememberMe: boolean; navigate?: string },
    unknown
  >,
  register: {} as UseMutationResult<void, Error, RegisterFormValues, unknown>,
  forgotPassword: {} as UseMutationResult<
    void,
    Error,
    { email: string },
    unknown
  >,
  validateResetToken: {} as UseMutationResult<
    { valid: boolean; email: string },
    Error,
    { token: string; email: string },
    unknown
  >,
  resetPassword: {} as UseMutationResult<
    void,
    Error,
    {
      token: string;
      email: string;
      newPassword: string;
      confirmPassword: string;
    },
    unknown
  >,
  changePassword: {} as UseMutationResult<
    void,
    Error,
    { currentPassword: string; newPassword: string; confirmPassword: string },
    unknown
  >,
  changeEmail: {} as UseMutationResult<void, Error, { email: string }, unknown>,
  logout: {} as UseMutationResult<void, Error, void, unknown>,
});

export const AuthProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // get current user
  const { data: user, isLoading: isUserLoading } = useQuery<User | null>({
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
    mutationFn: (credential: {
      email: string;
      password: string;
      rememberMe: boolean;
      navigate?: string;
    }) =>
      authServices.login(
        credential.email,
        credential.password,
        credential.rememberMe,
      ),
    onSuccess(_, credential) {
      queryClient
        .invalidateQueries({
          queryKey: ["user"],
        })
        .then(() => {
          navigate(credential.navigate || "/dashboard");
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
      navigate("/login", { replace: true });
    },
  });

  // change email mutation
  const changeEmailMutation = useMutation({
    mutationFn: (data: { email: string }) =>
      authServices.changeEmail(data.email),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  // forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: (data: { email: string }) =>
      authServices.forgotPassword(data.email),
    onSuccess: () => {
      // redirect to login page
      navigate("/login");
    },
  });

  // validate reset token mutation
  const validateResetTokenMutation = useMutation({
    mutationFn: (data: { token: string; email: string }) =>
      authServices.validateResetToken(data.token, data.email),

    onSuccess: (data) => {
      return { valid: data.valid, email: data.email };
    },
  });

  // reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: {
      token: string;
      email: string;
      newPassword: string;
      confirmPassword: string;
    }) =>
      authServices.resetPassword(
        data.token,
        data.email,
        data.newPassword,
        data.confirmPassword,
      ),
    onSuccess: () => {
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
    forgotPassword: forgotPasswordMutation,
    validateResetToken: validateResetTokenMutation,
    resetPassword: resetPasswordMutation,
    changePassword: changePasswordMutation,
    changeEmail: changeEmailMutation,
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
