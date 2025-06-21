import { z } from "zod";

export const roleSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
});
