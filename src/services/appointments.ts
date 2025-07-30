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
import moment from "moment";

// Clinic Token Services
export const clinicTokenServices = {
  // Get all clinic tokens with pagination and filters
  getClinicTokens: async (params: {
    currentPage?: number;
    pageSize?: number;
    search?: string;
    date?: Date;
    type?: string;
  }) => {
    // Ensure date is in yyyy-mm-dd format if provided
    let date: undefined | string = undefined;
    if (params.date) {
      date = moment(params.date).format("YYYY-MM-DD");
    }
    const { data } = await api.get(`/clinic-tokens`, {
      params: {
        ...params,
        date: date,
      },
    });
    return {
      clinicTokens: data.data as ClinicToken[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get single clinic token by ID
  getClinicToken: async (id: number) => {
    const { data } = await api.get(`/clinic-tokens/${id}`);
    return data as ClinicToken;
  },

  // Get available slots for a clinic date
  getAvailableSlots: async (clinicDateId: number) => {
    const { data } = await api.get(
      `/clinic-dates/${clinicDateId}/available-slots`,
    );
    return data?.slots as AvailableSlot[];
  },

  // Create new clinic token
  createClinicToken: async (clinicToken: ClinicTokenSchema) => {
    const { data } = await api.post("/clinic-tokens", clinicToken);
    return data;
  },

  // Update existing clinic token
  updateClinicToken: async (clinicToken: {
    id: number;
    values: ClinicTokenUpdateSchema;
  }) => {
    const { data } = await api.put(
      `/clinic-tokens/${clinicToken.id}`,
      clinicToken.values,
    );
    return data;
  },

  // Delete clinic token
  deleteClinicToken: async (id: number) => {
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
    date?: Date;
    type?: string;
  }) => {
    // Ensure date is in yyyy-mm-dd format if provided
    let date: undefined | string = undefined;
    if (params.date) {
      date = moment(params.date).format("YYYY-MM-DD");
    }

    const { data } = await api.get(`/opd-tokens`, {
      params: { ...params, date: date },
    });
    return {
      opdTokens: data.data as OpdToken[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get single opd token by ID
  getOpdToken: async (id: number) => {
    const { data } = await api.get(`/opd-tokens/${id}`);
    return data;
  },

  // Get available slots for an opd date
  getAvailableSlots: async (opdDateId: number) => {
    const { data } = await api.get(`/opd-dates/${opdDateId}/available-slots`);
    return data.slots as AvailableSlot[];
  },

  // Create new opd token
  createOpdToken: async (data: OpdTokenSchema) => {
    const { data: responseData } = await api.post("/opd-tokens", data);
    return responseData;
  },

  // Update existing opd token
  updateOpdToken: async (data: {
    id: number;
    values: OpdTokenUpdateSchema;
  }) => {
    const { data: responseData } = await api.put(
      `/opd-tokens/${data.id}`,
      data.values,
    );
    return responseData;
  },

  // Delete opd token
  deleteOpdToken: async (id: number) => {
    await api.delete(`/opd-tokens/${id}`);
  },
};
