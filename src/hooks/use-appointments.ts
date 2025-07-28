import type { ClinicTokensParams, OpdTokensParams } from "@/types/appointments";

import { clinicTokenServices, opdTokenServices } from "@/services/appointments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Clinic Token Query Keys
const clinicTokenKeys = {
  all: ["clinic-tokens"] as const,
  lists: () => [...clinicTokenKeys.all, "list"] as const,
  list: (params: ClinicTokensParams) =>
    [...clinicTokenKeys.lists(), params] as const,
  details: () => [...clinicTokenKeys.all, "detail"] as const,
  detail: (id: number) => [...clinicTokenKeys.details(), id] as const,
  slots: (clinicDateId: number) =>
    [...clinicTokenKeys.all, "slots", clinicDateId] as const,
};

// OPD Token Query Keys
const opdTokenKeys = {
  all: ["opd-tokens"] as const,
  lists: () => [...opdTokenKeys.all, "list"] as const,
  list: (params: OpdTokensParams) => [...opdTokenKeys.lists(), params] as const,
  details: () => [...opdTokenKeys.all, "detail"] as const,
  detail: (id: number) => [...opdTokenKeys.details(), id] as const,
  slots: (opdDateId: number) =>
    [...opdTokenKeys.all, "slots", opdDateId] as const,
};

// Clinic Token Hooks
export const useClinicTokens = (data: {
  currentPage?: number;
  pageSize?: number;
  search?: string;
  clinic_date_id?: number;
  type?: string;
}) =>
  useQuery({
    queryKey: ["opd-tokens", data],
    queryFn: async () => {
      try {
        const clinicDates = await clinicTokenServices.getClinicTokens(data);
        return clinicDates;
      } catch {
        return {
          clinicTokens: [],
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

export const useClinicToken = (id: number) => {
  return useQuery({
    queryKey: clinicTokenKeys.detail(id),
    queryFn: () => clinicTokenServices.getClinicToken(id),
    enabled: !!id,
  });
};

export const useClinicAvailableSlots = (clinicDateId: number) => {
  return useQuery({
    queryKey: clinicTokenKeys.slots(clinicDateId),
    queryFn: () => clinicTokenServices.getAvailableSlots(clinicDateId),
    enabled: !!clinicDateId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCreateClinicToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicTokenServices.createClinicToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicTokenKeys.lists() });
    },
  });
};

export const useUpdateClinicToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicTokenServices.updateClinicToken,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clinicTokenKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: clinicTokenKeys.detail(data.id),
        });
      }
      if (data.clinic_date_id) {
        queryClient.invalidateQueries({
          queryKey: clinicTokenKeys.slots(data.clinic_date_id),
        });
      }
    },
  });
};

export const useDeleteClinicToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicTokenServices.deleteClinicToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicTokenKeys.lists() });
    },
  });
};

// OPD Token Hooks
export const useOpdTokens = (date: {
  currentPage?: number;
  pageSize?: number;
  search?: string;
  opd_date_id?: number;
  type?: string;
}) =>
  useQuery({
    queryKey: ["opd-tokens", date],
    queryFn: async () => {
      try {
        const clinicDates = await opdTokenServices.getOpdTokens(date);
        return clinicDates;
      } catch {
        return {
          opdTokens: [],
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

export const useOpdToken = (id: number) => {
  return useQuery({
    queryKey: opdTokenKeys.detail(id),
    queryFn: () => opdTokenServices.getOpdToken(id),
    enabled: !!id,
  });
};

export const useOpdAvailableSlots = (opdDateId: number) => {
  return useQuery({
    queryKey: opdTokenKeys.slots(opdDateId),
    queryFn: () => opdTokenServices.getAvailableSlots(opdDateId),
    enabled: !!opdDateId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCreateOpdToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opdTokenServices.createOpdToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opdTokenKeys.lists() });
    },
  });
};

export const useUpdateOpdToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opdTokenServices.updateOpdToken,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: opdTokenKeys.lists() });
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: opdTokenKeys.detail(data.id),
        });
      }
      if (data.opd_date_id) {
        queryClient.invalidateQueries({
          queryKey: opdTokenKeys.slots(data.opd_date_id),
        });
      }
    },
  });
};

export const useDeleteOpdToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opdTokenServices.deleteOpdToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opdTokenKeys.lists() });
    },
  });
};
