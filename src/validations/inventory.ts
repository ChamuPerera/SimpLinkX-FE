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
  batch_number: z
    .string()
    .min(1, { message: "Batch number is required" })
    .max(50, { message: "Batch number should contain maximum 50 characters" }),
  expiry_date: z
    .date()
    .min(new Date(), { message: "Expiry date must be in the future" }),
  quantity: z.coerce
    .number()
    .min(0, { message: "Quantity must be 0 or greater" })
    .max(999999, { message: "Quantity should not exceed 999999" }),
});
