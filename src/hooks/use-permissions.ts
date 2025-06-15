/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Permission } from "@/services/permissions";

import { permissionsServices } from "@/services/permissions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get all permissions
export const usePermissions = (data: {
  pageSize: number;
  currentPage: number;
  search?: string;
}) =>
  useQuery({
    queryKey: ["permissions", data],
    queryFn: async () => {
      try {
        const permissions = await permissionsServices.getPermissions(data);
        return permissions;
      } catch (error) {
        return {
          permissions: [],
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

// Get all role permissions
export const useRolePermissions = () =>
  useQuery({
    queryKey: ["role-permissions"],
    queryFn: async () => {
      try {
        const rolePermissions = await permissionsServices.getRolePermissions();
        return rolePermissions;
      } catch (error) {
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Create permission
export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Permission) =>
      permissionsServices.createPermission(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["permissions"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update permission
export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Permission) =>
      permissionsServices.updatePermission(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["permissions"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Create/assign role permissions
export const useCreateRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { roleId: number; permissionIds: number[] }) =>
      permissionsServices.createRolePermissions(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["role-permissions"] });
      queryClient.refetchQueries({ queryKey: ["roles"] });
    },
    onError: (error) => {
      return error;
    },
  });
};
