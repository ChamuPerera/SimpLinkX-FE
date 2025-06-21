import { roleSchema } from "@/validations/roles";
import { z } from "zod";

// Permission schema
export const permissionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Permission name is required" }),
  description: z
    .string()
    .min(1, {
      message: "Permission description is required",
    })
    .max(255, {
      message: "Permission description must be less than 255 characters",
    }),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Role schema (updated to include permissions)
export const rolePermissionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Role name is required" }),
  roles: z.array(roleSchema).optional(),
});
