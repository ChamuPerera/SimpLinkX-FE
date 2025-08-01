import type {
  CreatePrescriptionRequest,
  Prescription,
} from "@/types/prescriptions";

import { api } from "@/services/api";

export const prescriptionsServices = {
  // Get prescriptions with pagination
  getPrescriptions: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
  }) => {
    const { data } = await api.get(
      `/prescriptions?page=${params.currentPage}&size=${params.pageSize}${
        params.search ? `&search=${params.search}` : ""
      }`,
    );
    return {
      prescriptions: data.data as Prescription[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get a single prescription by id
  getPrescriptionById: async (id: number) => {
    const { data } = await api.get(`/prescriptions/${id}`);
    return data as Prescription;
  },

  // Create a new prescription
  createPrescription: async (prescription: CreatePrescriptionRequest) => {
    const { data } = await api.post("/prescriptions", prescription);
    return data;
  },

  // Update an existing prescription
  updatePrescription: async (
    id: number,
    prescription: CreatePrescriptionRequest,
  ) => {
    const { data } = await api.put(`/prescriptions/${id}`, prescription);
    return data;
  },

  // Delete a prescription
  deletePrescription: async (id: number) => {
    const { data } = await api.delete(`/prescriptions/${id}`);
    return data;
  },
};
