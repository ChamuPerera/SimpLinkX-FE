import type { patientsSchema } from "@/validations/patients";
import type { z } from "zod";

import { api } from "@/services/api";

type PatientWithoutId = z.infer<typeof patientsSchema>;
export type Patient = PatientWithoutId & { id?: number };

export const patientsServices = {
  // Get patients with pagination
  getPatients: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
  }) => {
    const { data } = await api.get(
      `/patients?page=${params.currentPage}&size=${params.pageSize}${
        params.search ? `&search=${params.search}` : ""
      }`,
    );
    return {
      patients: data.data as Patient[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get a single patient by nic
  getPatientByNic: async (nic: string) => {
    const { data } = await api.get(`/patients/${nic}`);
    return data as Patient;
  },

  // Create a new patient
  createPatient: async (patient: z.infer<typeof patientsSchema>) => {
    const { data } = await api.post("/patients", patient);
    return data;
  },

  // Update an existing patient
  updatePatient: async (patient: Patient) => {
    const { data } = await api.put(`/patients/${patient.id}`, patient);
    return data;
  },
};
