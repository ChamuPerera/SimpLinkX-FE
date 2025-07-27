import type { opdDateSchema } from "@/validations/opd-dates";
import type z from "zod";

import { api } from "@/services/api";

export interface OpdDatesResponse {
  opdDates: OpdDate[];
  total: number;
  from: number;
  to: number;
  currentPage: number;
  pageSize: number;
  endPage: number;
}

export interface OpdDatesParams {
  currentPage?: number;
  pageSize?: number;
  search?: string;
  hospital_id?: number;
  status?: string;
}

type OpdDateWithoutId = z.infer<typeof opdDateSchema>;
export type OpdDate = OpdDateWithoutId & { id?: number };

export const opdDatesServices = {
  // Get all opd dates with pagination and filters
  getOpdDates: async (params: OpdDatesParams) => {
    const { data } = await api.get("/opd-dates", { params });
    return {
      opdDates: data.data as OpdDate[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get single opd date by ID
  getOpdDate: async (id: number): Promise<OpdDate> => {
    const { data } = await api.get(`/opd-dates/${id}`);
    return data as OpdDate;
  },

  // Get opd dates by hospital ID
  getOpdDatesByHospital: async (hospitalId: number): Promise<OpdDate[]> => {
    const { data } = await api.get(`/opd-dates/hospital/${hospitalId}`);
    return data as OpdDate[];
  },

  // Create new opd date
  createOpdDate: async (data: Omit<OpdDate, "id">): Promise<OpdDate> => {
    const { data: responseData } = await api.post("/opd-dates", data);
    return responseData as OpdDate;
  },

  // Update existing opd date
  updateOpdDate: async (data: OpdDate): Promise<OpdDate> => {
    const { data: responseData } = await api.put(`/opd-dates/${data.id}`, data);
    return responseData as OpdDate;
  },

  // Delete opd date
  deleteOpdDate: async (id: number): Promise<void> => {
    await api.delete(`/opd-dates/${id}`);
  },
};
