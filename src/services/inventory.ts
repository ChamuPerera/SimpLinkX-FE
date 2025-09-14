import type { Hospital } from "@/services/hospitals";
import type { batchSchema, inventorySchema } from "@/validations/inventory";
import type { z } from "zod";

import { api } from "@/services/api";

type InventoryWithoutId = z.infer<typeof inventorySchema>;
export type Inventory = InventoryWithoutId & {
  id?: number;
  available_quantity?: number;
  batches?: Batch[];
  nearby_suggestions: {
    distance_km: number;
    total_quantity: number;
    medicine: {
      drug_name: string;
      type: string;
      brand_name: string;
    };
    hospital: Hospital;
  }[];
};

type BatchWithoutId = z.infer<typeof batchSchema>;
export type Batch = BatchWithoutId & { id?: number };

export type InventoryBatch = {
  batch_id: number;
  batch_number: string;
  expiry_date: string;
  quantity: number;
  days_to_expiry: number;
  medicine: {
    id: number;
    drug_name: string;
    brand_name: string;
    type: string;
    weight: number;
  };
};

export type NearExpiryInventories = {
  thirty_days: InventoryBatch[];
  fourteen_days: InventoryBatch[];
};

export type LowStockInventory = {
  low_stock_inventories: {
    id: number;
    drug_name: string;
    hospital_id: number;
    brand_name: string;
    weight: number;
    type: string;
    total_available_quantity: number;
    batches: Batch[];
  }[];
};

export const inventoryServices = {
  // Get inventories with pagination
  getInventories: async (params: {
    pageSize: number;
    currentPage: number;
    search?: string;
    identifier?: string;
  }) => {
    const { data } = await api.get(
      `/inventory${params.identifier ? `/${params.identifier}` : ""}?page=${params.currentPage}&size=${params.pageSize}${
        params.search ? `&search=${params.search}` : ""
      }`,
    );
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

  // Add a batch to an inventory
  addBatch: async (batch: z.infer<typeof batchSchema>) => {
    const { data } = await api.post("/inventory/batch", batch);
    return data;
  },

  // Update a batch in an inventory
  updateBatch: async (batch: z.infer<typeof batchSchema>) => {
    const { data } = await api.put(`/inventory/batch/${batch.id}`, batch);
    return data;
  },

  // Delete a batch from an inventory
  deleteBatch: async (id: number) => {
    await api.delete(`/inventory/batch/${id}`);
  },

  // Release medicine from inventory
  releaseMedicine: async (prescription: number) => {
    const { data } = await api.post(`/inventory/release`, {
      prescription_id: prescription,
    });
    return data;
  },

  // Near expiry inventories
  getNearExpiryInventories: async () => {
    const { data } = await api.get("/inventories/near-expiry");
    return data as NearExpiryInventories;
  },

  // Get low stock inventories
  getLowStockInventories: async () => {
    const { data } = await api.get("/inventories/low-stock");
    return data as LowStockInventory;
  },
};
