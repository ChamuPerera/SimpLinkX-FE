import type { inventorySchema } from "@/validations/inventory";
import type { z } from "zod";

import { api } from "@/services/api";

type InventoryWithoutId = z.infer<typeof inventorySchema>;
export type Inventory = InventoryWithoutId & { id?: number };

export const inventoryServices = {
  // Get inventories with pagination
  getInventories: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
  }) => {
    const { data: response } = await api.get(
      `/inventory?page=${params.currentPage}&size=${params.pageSize}${
        params.search ? `&search=${params.search}` : ""
      }`,
    );
    const data = response.inventories;
    return {
      inventories: data.data as Inventory[],
      total: data.total as number,
      from: data.from as number,
      to: data.to as number,
      endPage: data.last_page as number,
    };
  },

  // Get a single inventory by id
  getInventoryById: async (id: number) => {
    const { data } = await api.get(`/inventory/${id}`);
    return data as Inventory;
  },

  // Create a new inventory
  createInventory: async (inventory: Inventory) => {
    const { data } = await api.post("/inventory", inventory);
    return data;
  },

  // Update an existing inventory
  updateInventory: async (inventory: Inventory) => {
    const { data } = await api.put(`/inventory/${inventory.id}`, inventory);
    return data;
  },

  // Delete an inventory
  deleteInventory: async (id: number) => {
    await api.delete(`/inventory/${id}`);
  },
};
