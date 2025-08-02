import { z } from "zod";

export const clinicPatientSchema = z.object({
  clinic_id: z
    .number()
    .min(1, "Clinic is required")
    .refine((val) => val > 0, "Please select a clinic"),
  patient_id: z
    .number()
    .min(1, "Patient is required")
    .refine((val) => val > 0, "Please select a patient"),
});

export type ClinicPatientSchema = z.infer<typeof clinicPatientSchema>;
