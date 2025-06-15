import type { roleSchema } from "@/validations/roles";
import type { z } from "zod";

import { api } from "@/services/api";

type RoleWithoutId = z.infer<typeof roleSchema>;
export type Role = RoleWithoutId & {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
};

export const rolesServices = {
  // Get roles with pagination
  getRoles: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
  }) => {
    const { data } = await api.get(
      `/roles?page=${params.currentPage}&size=${params.pageSize}${
        params.search ? `&search=${params.search}` : ""
      }`,
    );
    return {
      roles: data.data as Role[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get a single role by id
  getRoleById: async (id: number) => {
    const { data } = await api.get(`/roles/${id}`);
    return data as Role;
  },

  // Create a new role
  createRole: async (role: Role) => {
    const { data } = await api.post("/roles", role);
    return data;
  },

  // Update an existing role
  updateRole: async (role: Role) => {
    const { data } = await api.put(`/roles/${role.id}`, role);
    return data;
  },

  // Delete a role
  deleteRole: async (id: number) => {
    await api.delete(`/roles/${id}`);
  },
};
