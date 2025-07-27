import type { clinicSchema } from "@/validations/clinics";
import type { z } from "zod";

import { api } from "@/services/api";

type ClinicWithoutId = z.infer<typeof clinicSchema>;
export type Clinic = ClinicWithoutId & {
  doctor_id: number | null;
  id?: number;
};

export const clinicsServices = {
  // Get clinics with pagination
  getClinics: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
  }) => {
    const { data } = await api.get(
      `/clinics?page=${params.currentPage}&size=${params.pageSize}${
        params.search ? `&search=${params.search}` : ""
      }`,
    );
    return {
      clinics: data.data as Clinic[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get a single clinic by id
  getClinicById: async (id: number) => {
    const { data } = await api.get(`/clinics/${id}`);
    return data as Clinic;
  },

  // Create a new clinic
  createClinic: async (clinic: Clinic) => {
    const { data } = await api.post("/clinics", clinic);
    return data;
  },

  // Update an existing clinic
  updateClinic: async (clinic: Clinic) => {
    const { data } = await api.put(`/clinics/${clinic.id}`, clinic);
    return data;
  },

  // Delete a clinic
  deleteClinic: async (id: number) => {
    await api.delete(`/clinics/${id}`);
  },
};
