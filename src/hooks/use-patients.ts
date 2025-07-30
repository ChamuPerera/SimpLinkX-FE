/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Patient } from "@/services/patients";

import { patientsServices } from "@/services/patients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get patients with pagination
export const usePatients = (data: {
  pageSize: number;
  currentPage: number;
  search?: string;
}) =>
  useQuery({
    queryKey: ["patients", data],
    queryFn: async () => {
      try {
        const patients = await patientsServices.getPatients(data);
        return patients;
      } catch (error) {
        return {
          patients: [],
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

// Get patient by nic
export const usePatientByNic = (nic: string) =>
  useQuery({
    queryKey: ["patient", nic],
    queryFn: async () => {
      try {
        const patient = await patientsServices.getPatientByNic(nic);
        return patient;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Create patient
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Patient) => patientsServices.createPatient(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["patients"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update patient
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Patient) => patientsServices.updatePatient(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["patients"] });
    },
    onError: (error) => {
      return error;
    },
  });
};
