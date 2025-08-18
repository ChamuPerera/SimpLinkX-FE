import type { pharmacySchema } from "@/validations/pharmacy";
import type { z } from "zod";

import { api } from "@/services/api";

type PharmacyWithoutId = z.infer<typeof pharmacySchema>;
export type Pharmacy = PharmacyWithoutId & {
  id?: number;
};

export const pharmaciesServices = {
  // Get pharmacies with pagination
  getPharmacies: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
    district?: string;
  }) => {
    const { data } = await api.get(
      `/pharmacies?page=${params.currentPage}&size=${params.pageSize}${
        params.search ? `&search=${params.search}` : ""
      }${params.district ? `&district=${params.district}` : ""}`,
    );
    return {
      pharmacies: data.data as Pharmacy[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // get single hospital by id
  getPharmacyById: async (id: number) => {
    if (!id) {
      throw new Error("Pharmacy ID is required");
    }
    if (id <= 0) {
      throw new Error("Pharmacy ID must be a positive integer");
    }
    const { data } = await api.get(`/pharmacies/single/${id}`);
    return data as Pharmacy;
  },

  // Create a new pharmacy
  createPharmacy: async (pharmacy: Pharmacy) => {
    const { data } = await api.post("/pharmacies", pharmacy);
    return data;
  },

  // Update an existing pharmacy
  updatePharmacy: async (pharmacy: Pharmacy) => {
    const { data } = await api.put(`/pharmacies/${pharmacy.id}`, pharmacy);
    return data;
  },

  // Delete a pharmacy
  deletePharmacy: async (id: number) => {
    await api.delete(`/pharmacies/${id}`);
  },
};
