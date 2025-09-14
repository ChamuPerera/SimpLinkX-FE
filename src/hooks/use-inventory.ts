/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Batch, Inventory } from "@/services/inventory";

import { inventoryServices } from "@/services/inventory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get inventories with pagination
export const useInventories = (data: {
  pageSize: number;
  currentPage: number;
  search?: string;
  identifier?: string;
}) =>
  useQuery({
    queryKey: ["inventories", data],
    queryFn: async () => {
      try {
        const inventories = await inventoryServices.getInventories(data);
        return inventories;
      } catch (error) {
        return {
          inventories: [],
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

// Get inventory by id
export const useInventoryById = (id: number) =>
  useQuery({
    queryKey: ["inventory", id],
    queryFn: async () => {
      try {
        const inventory = await inventoryServices.getInventoryById(id);
        return inventory;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Create inventory
export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Inventory) =>
      inventoryServices.createInventory(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update inventory
export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Inventory) =>
      inventoryServices.updateInventory(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Delete inventory
export const useDeleteInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => inventoryServices.deleteInventory(id),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Add batch to inventory
export const useAddBatchToInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Batch) => inventoryServices.addBatch(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Update batch in inventory
export const useUpdateBatchInInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Batch) => inventoryServices.updateBatch(data),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Delete batch from inventory
export const useDeleteBatchFromInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => inventoryServices.deleteBatch(id),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Release medicine from inventory
export const useReleaseMedicine = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (prescriptionId: number) =>
      inventoryServices.releaseMedicine(prescriptionId),
    onSettled: () => {
      queryClient.refetchQueries({ queryKey: ["inventories"] });
    },
    onError: (error) => {
      return error;
    },
  });
};

// Near expiry inventories
export const useNearExpiryInventories = () =>
  useQuery({
    queryKey: ["near-expiry-inventories"],
    queryFn: async () => {
      try {
        const inventories = await inventoryServices.getNearExpiryInventories();
        return inventories;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

// Low stock inventories
export const useLowStockInventories = () =>
  useQuery({
    queryKey: ["low-stock-inventories"],
    queryFn: async () => {
      try {
        const inventories = await inventoryServices.getLowStockInventories();
        return inventories;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
