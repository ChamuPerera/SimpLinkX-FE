import type { AvailableSlot } from "@/types/appointments";
import type { hospitalSchema } from "@/validations/hospitals";
import type { z } from "zod";

import { api } from "@/services/api";

type HospitalWithoutId = z.infer<typeof hospitalSchema>;
export type Hospital = HospitalWithoutId & {
  id?: number;
  clinics?: {
    name: string;
    description: string;
    location: string;
    access_granted : boolean;
    dates: {
      [date: string]: {
        slots: AvailableSlot[];
        date_id: number;
      };
    };
  }[];
  opd?: {
    [date: string]: {
      slots: AvailableSlot[];
      date_id: number;
    };
  };
};

export const hospitalsServices = {
  // Get hospitals with pagination
  getHospitals: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
  }) => {
    const { data } = await api.get(
      `/hospitals?page=${params.currentPage}&size=${params.pageSize}${
        params.search ? `&search=${params.search}` : ""
      }`,
    );
    return {
      hospitals: data.data as Hospital[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // get a single hospital by identifier
  getHospitalByIdentifier: async (identifier: string) => {
    const { data } = await api.get(`/hospitals/${identifier}`);
    return data as Hospital;
  },

  // get single hospital by id
  getHospitalById: async (id: number) => {
    if (!id) {
      throw new Error("Hospital ID is required");
    }
    if (id <= 0) {
      throw new Error("Hospital ID must be a positive integer");
    }
    const { data } = await api.get(`/hospitals/single/${id}`);
    return data as Hospital;
  },

  // Create a new hospital
  createHospital: async (hospital: Hospital) => {
    const { data } = await api.post("/hospitals", hospital);
    return data;
  },

  // Update an existing hospital
  updateHospital: async (hospital: Hospital) => {
    const { data } = await api.put(`/hospitals/${hospital.id}`, hospital);
    return data;
  },

  // Manage hospital settings
  manageHospital: async (hospital: Hospital) => {
    const { data } = await api.post(`/hospitals/manage`, hospital);
    return data;
  },

  // Delete a hospital
  deleteHospital: async (id: number) => {
    await api.delete(`/hospitals/${id}`);
  },
};
