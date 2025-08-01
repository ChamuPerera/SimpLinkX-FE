import { z } from "zod";

export const medicineFrequencySchema = z.object({
  morning: z.boolean().default(false),
  afternoon: z.boolean().default(false),
  night: z.boolean().default(false),
  if_needed: z.boolean().default(false),
});

export const medicineSchema = z.object({
  name: z
    .string()
    .min(1, "Medicine name is required")
    .max(255, "Name too long"),
  dosage: z.number().min(1, "Dosage must be at least 1"),
  days_supply: z.number().min(1, "Days supply must be at least 1"),
  is_external: z.boolean().default(false),
  name_of_external_medicine: z
    .string()
    .max(255, "External medicine name too long")
    .optional()
    .nullable(),
  frequency: medicineFrequencySchema.optional().nullable(),
  duration: z.string().max(255, "Duration too long").optional().nullable(),
});

export const addMedicinesSchema = z.object({
  prescription_id: z.number().min(1, "Prescription is required"),
  medicines: z
    .array(medicineSchema)
    .min(1, "At least one medicine is required"),
});

export const releaseMedicinesSchema = z.object({
  prescription_id: z.number().min(1, "Prescription is required"),
});
