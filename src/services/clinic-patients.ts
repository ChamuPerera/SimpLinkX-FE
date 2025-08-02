import type { clinicPatientSchema } from "@/validations/clinic-patients";
import type { z } from "zod";

import { api } from "@/services/api";

type ClinicPatientWithoutId = z.infer<typeof clinicPatientSchema>;
export type ClinicPatient = ClinicPatientWithoutId & {
  id?: number;
  clinic?: {
    id: number;
    name: string;
    hospital_id: number;
    hospital?: {
      id: number;
      name: string;
    };
  };
  patient?: {
    id: number;
    name: string;
    nic: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
  created_at?: string;
  updated_at?: string;
};

export const clinicPatientsServices = {
  // Get clinic patients with pagination and filters
  getClinicPatients: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
    clinic_id?: number;
  }) => {
    const { data } = await api.get("/clinic-patients", { params });
    return {
      clinicPatients: data.data as ClinicPatient[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get a single clinic patient by id
  getClinicPatientById: async (id: number) => {
    const { data } = await api.get(`/clinic-patients/${id}`);
    return data as ClinicPatient;
  },

  // Create a new clinic patient
  createClinicPatient: async (clinicPatient: ClinicPatientWithoutId) => {
    const { data } = await api.post("/clinic-patients", clinicPatient);
    return data;
  },

  // Update an existing clinic patient
  updateClinicPatient: async (clinicPatient: ClinicPatient) => {
    const { data } = await api.put(
      `/clinic-patients/${clinicPatient.id}`,
      clinicPatient,
    );
    return data;
  },

  // Delete a clinic patient
  deleteClinicPatient: async (id: number) => {
    await api.delete(`/clinic-patients/${id}`);
  },
};
