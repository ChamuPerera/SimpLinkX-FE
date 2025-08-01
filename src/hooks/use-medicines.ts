import type {
  AddMedicinesRequest,
  ReleaseMedicinesRequest,
} from "@/types/medicines";

import { medicinesServices } from "@/services/medicines";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Add medicines
export const useAddMedicines = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddMedicinesRequest) =>
      medicinesServices.addMedicines(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["prescriptions"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Release medicines
export const useReleaseMedicines = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReleaseMedicinesRequest) =>
      medicinesServices.releaseMedicines(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["prescriptions"] });
    },
    onError: (error) => {
      return error;
    },
  });
};
