import { z } from "zod";

export const clinicDateSchema = z
  .object({
    id: z.coerce.number().optional(),
    clinic_id: z.coerce.number().min(1, { message: "Clinic is required" }),
    date: z.coerce
      .date()
      .refine((date) => new Date(date).getDay() >= new Date().getDay(), {
        message: "Date must be today or in the future",
      }),
    start_time: z
      .string()
      .min(1, { message: "Start time is required" })
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Start time must be in HH:MM format",
      }),
    end_time: z
      .string()
      .min(1, { message: "End time is required" })
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "End time must be in HH:MM format",
      }),
    status: z
      .enum(["scheduled", "completed", "cancelled"])
      .default("scheduled")
      .optional(),
  })
  .refine(
    (data) => {
      const start = new Date(`2000-01-01T${data.start_time}`);
      const end = new Date(`2000-01-01T${data.end_time}`);
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    },
  );
