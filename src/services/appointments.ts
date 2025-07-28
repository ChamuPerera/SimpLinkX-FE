import type {
  AvailableSlot,
  ClinicToken,
  OpdToken,
} from "@/types/appointments";
import type {
  ClinicTokenSchema,
  ClinicTokenUpdateSchema,
  OpdTokenSchema,
  OpdTokenUpdateSchema,
} from "@/validations/appointments";

import { api } from "@/services/api";

// Clinic Token Services
export const clinicTokenServices = {
  // Get all clinic tokens with pagination and filters
  getClinicTokens: async (params: {
    currentPage?: number;
    pageSize?: number;
    search?: string;
    clinic_date_id?: number;
    type?: string;
  }) => {
    const { data } = await api.get(`/clinic-tokens`, { params });
    return {
      clinicTokens: data.data as ClinicToken[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get single clinic token by ID
  getClinicToken: async (id: number): Promise<ClinicToken> => {
    const response = await api.get(`/clinic-tokens/${id}`);
    return response.data;
  },

  // Get available slots for a clinic date
  getAvailableSlots: async (clinicDateId: number): Promise<AvailableSlot[]> => {
    const response = await api.get(
      `/clinic-dates/${clinicDateId}/available-slots`,
    );
    return response.data;
  },

  // Create new clinic token
  createClinicToken: async (data: ClinicTokenSchema) => {
    const response = await api.post("/clinic-tokens", data);
    return response.data;
  },

  // Update existing clinic token
  updateClinicToken: async (data: {
    id: number;
    values: ClinicTokenUpdateSchema;
  }) => {
    const response = await api.put(`/clinic-tokens/${data.id}`, data.values);
    return response.data;
  },

  // Delete clinic token
  deleteClinicToken: async (id: number): Promise<void> => {
    await api.delete(`/clinic-tokens/${id}`);
  },
};

// OPD Token Services
export const opdTokenServices = {
  // Get all opd tokens with pagination and filters
  getOpdTokens: async (params: {
    currentPage?: number;
    pageSize?: number;
    search?: string;
    opd_date_id?: number;
    type?: string;
  }) => {
    const { data } = await api.get(`/opd-tokens`, { params });
    return {
      opdTokens: data.data as OpdToken[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get single opd token by ID
  getOpdToken: async (id: number): Promise<OpdToken> => {
    const response = await api.get(`/opd-tokens/${id}`);
    return response.data;
  },

  // Get available slots for an opd date
  getAvailableSlots: async (opdDateId: number): Promise<AvailableSlot[]> => {
    const response = await api.get(`/opd-dates/${opdDateId}/available-slots`);
    return response.data;
  },

  // Create new opd token
  createOpdToken: async (data: OpdTokenSchema) => {
    const response = await api.post("/opd-tokens", data);
    return response.data;
  },

  // Update existing opd token
  updateOpdToken: async (data: {
    id: number;
    values: OpdTokenUpdateSchema;
  }) => {
    const response = await api.put(`/opd-tokens/${data.id}`, data.values);
    return response.data;
  },

  // Delete opd token
  deleteOpdToken: async (id: number): Promise<void> => {
    await api.delete(`/opd-tokens/${id}`);
  },
};
