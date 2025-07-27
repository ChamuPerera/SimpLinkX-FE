import type { clinicDateSchema } from "@/validations/clinic-dates";
import type { z } from "zod";

import { api } from "@/services/api";

type ClinicDateWithoutId = z.infer<typeof clinicDateSchema>;
export type ClinicDate = ClinicDateWithoutId & { id?: number };

export const clinicDatesServices = {
  // Get clinic dates with pagination and filters
  getClinicDates: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
    clinic_id?: number;
    status?: string;
  }) => {
    const { data } = await api.get(`/clinic-dates`, { params });
    return {
      clinicDates: data.data as ClinicDate[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get a single clinic date by id
  getClinicDateById: async (id: number) => {
    const { data } = await api.get(`/clinic-dates/${id}`);
    return data as ClinicDate;
  },

  // Get clinic dates by clinic id
  getClinicDatesByClinic: async (clinicId: number) => {
    const { data } = await api.get(`/clinic-dates/clinic/${clinicId}`);
    return data as ClinicDate[];
  },

  // Create a new clinic date
  createClinicDate: async (clinicDate: ClinicDate) => {
    const { data } = await api.post("/clinic-dates", clinicDate);
    return data;
  },

  // Update an existing clinic date
  updateClinicDate: async (clinicDate: ClinicDate) => {
    const { data } = await api.put(
      `/clinic-dates/${clinicDate.id}`,
      clinicDate,
    );
    return data;
  },

  // Delete a clinic date
  deleteClinicDate: async (id: number) => {
    await api.delete(`/clinic-dates/${id}`);
  },
};
