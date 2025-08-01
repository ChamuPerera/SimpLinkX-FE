import type { userSchema } from "@/validations/users";
import type { z } from "zod";

import { api } from "@/services/api";

type UserWithoutId = z.infer<typeof userSchema>;
export type User = UserWithoutId & {
  id?: number;
  permissions?: string[];
  patient_id?: number;
};

export const usersServices = {
  // Get users with pagination
  getUsers: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
    role?: string;
  }) => {
    const { data } = await api.get(
      `/users?page=${params.currentPage}&size=${params.pageSize}${
        params.search ? `&search=${params.search}` : ""
      } ${params.role ? `&role=${params.role}` : ""}`,
    );
    return {
      users: data.data as User[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get a single user by id
  getUserById: async (id: number) => {
    const { data } = await api.get(`/users/${id}`);
    return data as User;
  },

  // Create a new user
  createUser: async (user: User) => {
    const { data } = await api.post("/users", user);
    return data;
  },

  // Update an existing user
  updateUser: async (user: User) => {
    const { data } = await api.put(`/users/${user.id}`, user);
    return data;
  },

  // Update user status
  updateUserStatus: async (
    id: number,
    status: "working" | "retired" | "banned",
  ) => {
    const { data } = await api.post(`/users/status/${id}`, { status });
    return data;
  },

  // Add user to hospital
  addUserToHospital: async (userId: number, hospitalId: number) => {
    const { data } = await api.post(`/users/hospital/${userId}`, {
      hospital_id: hospitalId,
    });
    return data;
  },

  // Delete a user
  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};
