import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    nic: z.string().min(1, "NIC is required"),
    phone: z.string().min(7, "Phone number is required"),
    date_of_birth: z.date(),
    gender: z.enum(["male", "female"]),
    address: z.string().min(1, "Address is required"),
    password_confirmation: z
      .string()
      .min(8, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
