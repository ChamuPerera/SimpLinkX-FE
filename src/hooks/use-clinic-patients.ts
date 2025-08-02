import { clinicPatientsServices } from "@/services/clinic-patients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get clinic patients with pagination and filters
export const useClinicPatients = (data: {
  pageSize: number;
  currentPage: number;
  search?: string;
  clinic_id?: number;
}) =>
  useQuery({
    queryKey: ["clinic-patients", data],
    queryFn: async () => {
      try {
        const clinicPatients =
          await clinicPatientsServices.getClinicPatients(data);
        return clinicPatients;
      } catch {
        return {
          clinicPatients: [],
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

// Get single clinic patient
export const useClinicPatient = (id: number) => {
  return useQuery({
    queryKey: ["clinic-patient", id],
    queryFn: async () => {
      try {
        const clinicPatient =
          await clinicPatientsServices.getClinicPatientById(id);
        return clinicPatient;
      } catch {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Create clinic patient
export const useCreateClinicPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicPatientsServices.createClinicPatient,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinic-patients"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update clinic patient
export const useUpdateClinicPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicPatientsServices.updateClinicPatient,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinic-patients"] });
      queryClient.refetchQueries({ queryKey: ["clinic-patient"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Delete clinic patient
export const useDeleteClinicPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clinicPatientsServices.deleteClinicPatient,
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["clinic-patients"] });
    },
    onError: (error) => {
      return error;
    },
  });
};
