import type { CreatePrescriptionRequest } from "@/types/prescriptions";



import { prescriptionsServices } from "@/services/prescriptions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";





// Get prescriptions with pagination
export const usePrescriptions = (data: {
  pageSize: number;
  currentPage: number;
  search?: string;
}) =>
  useQuery({
    queryKey: ["prescriptions", data],
    queryFn: async () => {
      try {
        const prescriptions =
          await prescriptionsServices.getPrescriptions(data);
        return prescriptions;
      } catch {
        return {
          prescriptions: [],
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

// Get prescription by id
export const usePrescriptionById = (id: number) =>
  useQuery({
    queryKey: ["prescription", id],
    queryFn: async () => {
      try {
        const prescription =
          await prescriptionsServices.getPrescriptionById(id);
        return prescription;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Create prescription
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePrescriptionRequest) =>
      prescriptionsServices.createPrescription(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["prescriptions"] });
      queryClient.refetchQueries({ queryKey: ["opd-token"] });
      queryClient.refetchQueries({ queryKey: ["clinic-token"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update prescription
export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: CreatePrescriptionRequest;
    }) => prescriptionsServices.updatePrescription(id, data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["prescriptions"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Delete prescription
export const useDeletePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) =>
      prescriptionsServices.deletePrescription(id),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["prescriptions"] });
    },
    onError: (error) => {
      return error;
    },
  });
};