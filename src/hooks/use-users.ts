/* eslint-disable @typescript-eslint/no-unused-vars */
import type { User } from "@/services/users";

import { usersServices } from "@/services/users";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get users with pagination
export const useUsers = (data: {
  pageSize: number;
  currentPage: number;
  search?: string;
  role?: string;
}) =>
  useQuery({
    queryKey: ["users", data],
    queryFn: async () => {
      try {
        const users = await usersServices.getUsers(data);
        return users;
      } catch (error) {
        return {
          users: [],
          total: 0,
          from: 0,
          to: 0,
          endPage: 0,
        };
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Get user by id
export const useUserById = (id: number) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      try {
        const user = await usersServices.getUserById(id);
        return user;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => usersServices.createUser(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: User) => usersServices.updateUser(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update user status
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: "working" | "retired" | "banned";
    }) => usersServices.updateUserStatus(id, status),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Add user to hospital
export const useAddUserToHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      hospitalId,
    }: {
      userId: number;
      hospitalId: number;
    }) => usersServices.addUserToHospital(userId, hospitalId),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => usersServices.deleteUser(id),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      return error;
    },
  });
};
