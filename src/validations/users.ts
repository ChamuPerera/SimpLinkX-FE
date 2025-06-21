import { z } from "zod";

export const userSchema = z
  .object({
    id: z.coerce.number().optional(),
    hospital_id: z.coerce.number().optional(),
    hospital: z.string().optional(),
    status: z.enum(["working", "retired", "banned"]).optional(),
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    role: z.string().min(1, { message: "Role is required" }),
    password_confirmation: z
      .string()
      .min(6, { message: "Password confirmation is required" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
