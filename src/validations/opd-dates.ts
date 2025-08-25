import { z } from "zod";

export const opdDateSchema = z
  .object({
    hospital_id: z
      .number()
      .min(1, "Hospital is required")
      .refine((val) => val > 0, "Please select a hospital"),
    date: z.coerce
      .date()
      .refine((date) => new Date(date).getDay() >= new Date().getDay(), {
        message: "Date must be today or in the future",
      }),
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
    status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
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
