import { z } from "zod";

export const inventorySchema = z.object({
  id: z.coerce.number().optional(),
  drug_name: z
    .string()
    .min(2, { message: "Drug name must be at least 2 characters" })
    .max(255, { message: "Drug name should contain maximum 255 characters" }),
  brand_name: z
    .string()
    .min(2, { message: "Brand name must be at least 2 characters" })
    .max(255, { message: "Brand name should contain maximum 255 characters" }),
  weight: z.coerce.number(),
  type: z.enum(["tablet", "capsule", "syrup", "injection", "ointment"]),
});

export const batchSchema = z.object({
  id: z.coerce.number().optional(),
  batch_number: z
    .string()
    .min(2, { message: "Batch number must be at least 2 characters" })
    .max(255, {
      message: "Batch number should contain maximum 255 characters",
    }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be at least 1" }),
  expiry_date: z.coerce.date().refine((date) => date > new Date(), {
    message: "Expiry date must be in the future",
  }),
  inventory_id: z.coerce.number(),
});
