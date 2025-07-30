import type { ClinicDate } from "@/services/clinic-dates";

import { clinicDatesServices } from "@/services/clinic-dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get clinic dates with pagination and filters
export const useClinicDates = (data: {
  pageSize: number;
  currentPage: number;
  search?: string;
  clinic_id?: number;
  status?: string;
  future_only?: boolean;
}) =>
  useQuery({
    queryKey: ["clinic-dates", data],
    queryFn: async () => {
      try {
        const clinicDates = await clinicDatesServices.getClinicDates(data);
        return clinicDates;
      } catch {
        return {
          clinicDates: [],
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

// Get clinic date by id
export const useClinicDateById = (id: number) =>
  useQuery({
    queryKey: ["clinic-date", id],
    queryFn: async () => {
      try {
        if (id === 0) return null;
        const clinicDate = await clinicDatesServices.getClinicDateById(id);
        return clinicDate;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Get clinic dates by clinic id
export const useClinicDatesByClinic = (clinicId: number) =>
  useQuery({
    queryKey: ["clinic-dates-by-clinic", clinicId],
    queryFn: async () => {
      try {
        const clinicDates =
          await clinicDatesServices.getClinicDatesByClinic(clinicId);
        return clinicDates;
      } catch {
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Create clinic date
export const useCreateClinicDate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ClinicDate) =>
      clinicDatesServices.createClinicDate(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinic-dates"] });
      queryClient.refetchQueries({ queryKey: ["clinic-dates-by-clinic"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update clinic date
export const useUpdateClinicDate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ClinicDate) =>
      clinicDatesServices.updateClinicDate(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinic-dates"] });
      queryClient.refetchQueries({ queryKey: ["clinic-dates-by-clinic"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update clinic date status
export const useUpdateClinicDateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clinicDatesServices.updateClinicDateStatus,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinic-dates"] });
      queryClient.refetchQueries({ queryKey: ["clinic-dates-by-clinic"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Delete clinic date
export const useDeleteClinicDate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => clinicDatesServices.deleteClinicDate(id),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinic-dates"] });
      queryClient.refetchQueries({ queryKey: ["clinic-dates-by-clinic"] });
    },
    onError: (error) => {
      return error;
    },
  });
};
