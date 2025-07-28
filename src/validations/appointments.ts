import { z } from "zod";

// Patient interface for type definitions
export interface Patient {
  id: number;
  user_id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

// Clinic token validation schema
export const clinicTokenSchema = z
  .object({
    clinic_date_id: z.coerce.number().min(1, { message: "Clinic date is required" }),
    patient_id: z.coerce.number().min(1, { message: "Patient is required" }),
    start_time: z
      .string()
      .min(1, "Start time is required")
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Start time must be in HH:MM format",
      ),
    end_time: z
      .string()
      .min(1, "End time is required")
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "End time must be in HH:MM format",
      ),
  })
  .refine(
    (data) => {
      if (data.start_time && data.end_time) {
        const start = new Date(`1970-01-01T${data.start_time}:00`);
        const end = new Date(`1970-01-01T${data.end_time}:00`);
        return end > start;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    },
  );

// OPD token validation schema
export const opdTokenSchema = z
  .object({
    opd_date_id: z
      .number()
      .min(1, "OPD date is required")
      .refine((val) => val > 0, "Please select an OPD date"),
    patient_id: z
      .number()
      .min(1, "Patient is required")
      .refine((val) => val > 0, "Please select a patient"),
    start_time: z
      .string()
      .min(1, "Start time is required")
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Start time must be in HH:MM format",
      ),
    end_time: z
      .string()
      .min(1, "End time is required")
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "End time must be in HH:MM format",
      ),
  })
  .refine(
    (data) => {
      if (data.start_time && data.end_time) {
        const start = new Date(`1970-01-01T${data.start_time}:00`);
        const end = new Date(`1970-01-01T${data.end_time}:00`);
        return end > start;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    },
  );

// Update schemas (without patient_id and date_id)
export const clinicTokenUpdateSchema = z
  .object({
    start_time: z
      .string()
      .min(1, "Start time is required")
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Start time must be in HH:MM format",
      ),
    end_time: z
      .string()
      .min(1, "End time is required")
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "End time must be in HH:MM format",
      ),
  })
  .refine(
    (data) => {
      if (data.start_time && data.end_time) {
        const start = new Date(`1970-01-01T${data.start_time}:00`);
        const end = new Date(`1970-01-01T${data.end_time}:00`);
        return end > start;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    },
  );

export const opdTokenUpdateSchema = z
  .object({
    start_time: z
      .string()
      .min(1, "Start time is required")
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Start time must be in HH:MM format",
      ),
    end_time: z
      .string()
      .min(1, "End time is required")
      .regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "End time must be in HH:MM format",
      ),
  })
  .refine(
    (data) => {
      if (data.start_time && data.end_time) {
        const start = new Date(`1970-01-01T${data.start_time}:00`);
        const end = new Date(`1970-01-01T${data.end_time}:00`);
        return end > start;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    },
  );

export type ClinicTokenSchema = z.infer<typeof clinicTokenSchema>;
export type OpdTokenSchema = z.infer<typeof opdTokenSchema>;
export type ClinicTokenUpdateSchema = z.infer<typeof clinicTokenUpdateSchema>;
export type OpdTokenUpdateSchema = z.infer<typeof opdTokenUpdateSchema>;
