import { z } from "zod";

export const patientsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nic: z.string().min(1, "NIC is required"),
  phone: z.string().min(7, "Phone number is required"),
  date_of_birth: z.date(),
  gender: z.enum(["male", "female"]),
  address: z.string().min(1, "Address is required"),
});
