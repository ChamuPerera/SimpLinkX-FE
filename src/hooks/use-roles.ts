/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Role } from "@/services/roles";

import { rolesServices } from "@/services/roles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get roles with pagination
export const useRoles = (data: {
  pageSize: number;
  currentPage: number;
  search?: string;
}) =>
  useQuery({
    queryKey: ["roles", data],
    queryFn: async () => {
      try {
        const roles = await rolesServices.getRoles(data);
        return roles;
      } catch (error) {
        return {
          roles: [],
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

// Get role by id
export const useRoleById = (id: number) =>
  useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      try {
        const role = await rolesServices.getRoleById(id);
        return role;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Create role
export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Role) => rolesServices.createRole(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["roles"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update role
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Role) => rolesServices.updateRole(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["roles"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Delete role
export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => rolesServices.deleteRole(id),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["roles"] });
    },
    onError: (error) => {
      return error;
    },
  });
};
