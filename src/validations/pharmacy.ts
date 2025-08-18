import { z } from "zod";

export const pharmacySchema = z.object({
  id: z.coerce.number().optional(),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(255, { message: "Name should contain maximum 255 characters" }),
  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters" })
    .max(500, { message: "Address should contain maximum 500 characters" }),
  phone: z
    .string()
    .min(7, { message: "Phone must be at least 7 characters" })
    .max(20, { message: "Phone should contain maximum 20 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  district: z
    .string()
    .min(2, { message: "District must be at least 2 characters" })
    .max(100, { message: "District should contain maximum 100 characters" }),
  location_url: z.string().url({ message: "Invalid URL" }),
});
