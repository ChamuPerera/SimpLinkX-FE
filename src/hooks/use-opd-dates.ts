import type { OpdDatesParams } from "@/services/opd-dates";

import { opdDatesServices } from "@/services/opd-dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get opd dates with pagination and filters
export const useOpdDates = (data: OpdDatesParams) => {
  return useQuery({
    queryKey: ["opd-dates", data],
    queryFn: async () => {
      try {
        const opdDates = await opdDatesServices.getOpdDates(data);
        return opdDates;
      } catch {
        return {
          opdDates: [],
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
};

// Get single opd date
export const useOpdDate = (id: number) => {
  return useQuery({
    queryKey: ["opd-date", id],
    queryFn: async () => {
      try {
        if (id === 0) return null;
        const opdDate = await opdDatesServices.getOpdDate(id);
        return opdDate;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Get opd dates by hospital
export const useOpdDatesByHospital = (hospitalId: number) => {
  return useQuery({
    queryKey: ["opd-dates", hospitalId],
    queryFn: () => opdDatesServices.getOpdDatesByHospital(hospitalId),
    enabled: !!hospitalId,
  });
};

// Create opd date mutation
export const useCreateOpdDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opdDatesServices.createOpdDate,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["opd-dates"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update opd date mutation
export const useUpdateOpdDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opdDatesServices.updateOpdDate,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["opd-dates"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update opd date status mutation
export const useUpdateOpdDateStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opdDatesServices.updateOpdDateStatus,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["opd-dates"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Delete opd date mutation
export const useDeleteOpdDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opdDatesServices.deleteOpdDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opd-dates"] });
    },
  });
};
