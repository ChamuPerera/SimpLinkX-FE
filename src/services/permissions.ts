import type {
  permissionSchema,
  rolePermissionSchema,
} from "@/validations/permissions";
import type { z } from "zod";

import { api } from "@/services/api";

type PermissionWithoutId = z.infer<typeof permissionSchema>;
export type Permission = PermissionWithoutId & {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
};
export type RolePermission = z.infer<typeof rolePermissionSchema>;

export const permissionsServices = {
  // Get all permissions
  getPermissions: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
  }) => {
    const { data } = await api.get(
      `/permissions?page=${params.currentPage}&size=${params.pageSize}${
        params.search ? `&search=${params.search}` : ""
      }`,
    );
    return {
      permissions: data.data as Permission[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Create a new permission
  createPermission: async (permission: Permission) => {
    const { data } = await api.post("/permissions", permission);
    return data;
  },

  // Update an existing permission
  updatePermission: async (permission: Permission) => {
    const { data } = await api.put(`/permissions/${permission.id}`, permission);
    return data;
  },

  // Get all role permissions
  getRolePermissions: async () => {
    const { data } = await api.get("/roles/permissions");
    return data as RolePermission[];
  },

  // Create/assign role permissions
  createRolePermissions: async (rolePermissionData: {
    roleId: number;
    permissionIds: number[];
  }) => {
    const { data } = await api.post(
      `/roles/permissions/${rolePermissionData.roleId}`,
      { permission_ids: rolePermissionData.permissionIds },
    );
    return data;
  },
};
