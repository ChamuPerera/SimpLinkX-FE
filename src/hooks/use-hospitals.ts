/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Hospital } from "@/services/hospitals";

import { hospitalsServices } from "@/services/hospitals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// get hospitals
export const useHospitals = (data: {
  pageSize: number;
  currentPage: number;
  search?: string;
}) =>
  useQuery({
    queryKey: ["hospitals", data],
    queryFn: async () => {
      try {
        const hospitals = await hospitalsServices.getHospitals(data);
        return hospitals;
      } catch (error) {
        return {
          hospitals: [],
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

// get hospital by identifier
export const useHospitalByIdentifier = (identifier: string) =>
  useQuery({
    queryKey: ["hospital", identifier],
    queryFn: async () => {
      try {
        const hospital: Hospital =
          await hospitalsServices.getHospitalByIdentifier(identifier);
        return hospital;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// get single hospital by id
export const useHospitalById = (id: number) =>
  useQuery({
    queryKey: ["hospital", id],
    queryFn: async () => {
      try {
        const hospital = await hospitalsServices.getHospitalById(id);
        return hospital;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// create hospital
export const useCreateHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Hospital) =>
      hospitalsServices.createHospital(data),
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: ["hospitals"],
      });
    },
    onError: (error) => {
      return error;
    },
  });
};

// update hospital
export const useUpdateHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Hospital) =>
      hospitalsServices.updateHospital(data),
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: ["hospitals"],
      });
    },
    onError: (error) => {
      return error;
    },
  });
};

// manage hospital
export const useManageHospital = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Hospital) =>
      hospitalsServices.manageHospital(data),
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: ["hospitals"],
      });
    },
    onError: (error) => {
      return error;
    },
  });
}
