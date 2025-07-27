import type { Clinic } from "@/services/clinics";

import { clinicsServices } from "@/services/clinics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get clinics with pagination
export const useClinics = (data: {
  pageSize: number;
  currentPage: number;
  search?: string;
}) =>
  useQuery({
    queryKey: ["clinics", data],
    queryFn: async () => {
      try {
        const clinics = await clinicsServices.getClinics(data);
        return clinics;
      } catch {
        return {
          clinics: [],
          total: 0,
          from: 0,
          to: 0,
          endPage: 0,
        };
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Get clinic by id
export const useClinicById = (id: number) =>
  useQuery({
    queryKey: ["clinic", id],
    queryFn: async () => {
      try {
        const clinic = await clinicsServices.getClinicById(id);
        return clinic;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Create clinic
export const useCreateClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Clinic) => clinicsServices.createClinic(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinics"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update clinic
export const useUpdateClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Clinic) => clinicsServices.updateClinic(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinics"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Delete clinic
export const useDeleteClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => clinicsServices.deleteClinic(id),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinics"] });
    },
    onError: (error) => {
      return error;
    },
  });
};
