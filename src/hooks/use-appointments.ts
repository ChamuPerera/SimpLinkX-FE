import { clinicTokenServices, opdTokenServices } from "@/services/appointments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Clinic Token Hooks
export const useClinicTokens = (data: {
  currentPage?: number;
  pageSize?: number;
  search?: string;
  date?: Date;
  type?: string;
}) =>
  useQuery({
    queryKey: ["clinic-token", data],
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
    queryKey: ["clinic-token", id],
    queryFn: async () => {
      try {
        const clinicDate = await clinicTokenServices.getClinicToken(id);
        return clinicDate;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useClinicAvailableSlots = (clinicDateId: number) => {
  return useQuery({
    queryKey: ["clinic-available-slots", clinicDateId],
    queryFn: async () => {
      try {
        if (clinicDateId === 0) return [];
        const availableSlots =
          await clinicTokenServices.getAvailableSlots(clinicDateId);
        return availableSlots;
      } catch {
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateClinicToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicTokenServices.createClinicToken,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinic-token"] });
      queryClient.refetchQueries({ queryKey: ["hospital"] });
      queryClient.refetchQueries({ queryKey: ["clinic-available-slots"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useUpdateClinicToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicTokenServices.updateClinicToken,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinic-token"] });
      queryClient.refetchQueries({
        queryKey: ["clinic-available-slots"],
      });
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteClinicToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicTokenServices.deleteClinicToken,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinic-token"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// OPD Token Hooks
export const useOpdTokens = (date: {
  currentPage?: number;
  pageSize?: number;
  search?: string;
  date?: Date;
  type?: string;
}) =>
  useQuery({
    queryKey: ["opd-token", date],
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
    queryKey: ["opd-token", id],
    queryFn: async () => {
      try {
        const opdToken = await opdTokenServices.getOpdToken(id);
        return opdToken;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useOpdAvailableSlots = (opdDateId: number) => {
  return useQuery({
    queryKey: ["opd-available-slots", opdDateId],
    queryFn: async () => {
      try {
        if (opdDateId === 0) return [];
        const availableSlots =
          await opdTokenServices.getAvailableSlots(opdDateId);
        return availableSlots;
      } catch {
        return [];
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useCreateOpdToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opdTokenServices.createOpdToken,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["opd-token"] });
      queryClient.refetchQueries({ queryKey: ["hospital"] });
      queryClient.refetchQueries({
        queryKey: ["opd-available-slots"],
      });
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useUpdateOpdToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opdTokenServices.updateOpdToken,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["opd-token"] });
      queryClient.refetchQueries({
        queryKey: ["opd-available-slots"],
      });
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useDeleteOpdToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: opdTokenServices.deleteOpdToken,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["opd-token"] });
    },
    onError: (error) => {
      return error;
    },
  });
};
