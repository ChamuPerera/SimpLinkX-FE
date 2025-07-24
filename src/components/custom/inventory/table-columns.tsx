import type { Inventory } from "@/services/inventory";
import type { ColumnDef } from "@tanstack/react-table";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { MoreHorizontal } from "lucide-react";

export const inventoryColumns: ColumnDef<Inventory>[] = [
  {
    accessorKey: "drug_name",
    header: "Drug Name",
    cell: ({ row }) => <span>{row.getValue("drug_name")}</span>,
  },
  {
    accessorKey: "brand_name",
    header: "Brand Name",
    cell: ({ row }) => <span>{row.getValue("brand_name")}</span>,
  },
  {
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row }) => <span>{row.getValue("weight")}mg</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("type")}</span>
    ),
  },
  {
    accessorKey: "available_quantity",
    header: "Available Qty",
    cell: ({ row }) => (
      <span className="flex justify-center">
        {row.getValue("available_quantity")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setOpen: (open: boolean) => void;
        setBatchOpen: (open: boolean) => void;
        setSelectedInventory: (inventory: Inventory) => void;
        setShowDetails: (show: boolean) => void;
        setShowBatchDetails: (show: boolean) => void;
      };
      const {
        setOpen,
        setBatchOpen,
        setSelectedInventory,
        setShowDetails,
        setShowBatchDetails,
      } = meta;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <PermissionWrapper permissions={[permissions.manageInventories]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedInventory(row.original);
                  setOpen(true);
                }}
              >
                Edit Inventory
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setSelectedInventory(row.original);
                  setBatchOpen(true);
                }}
              >
                Add Batch
              </DropdownMenuItem>
            </PermissionWrapper>
            <PermissionWrapper permissions={[permissions.viewInventories]}>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                  setSelectedInventory(row.original);
                }}
              >
                More Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setShowBatchDetails(true);
                  setSelectedInventory(row.original);
                }}
              >
                View Batches
              </DropdownMenuItem>
            </PermissionWrapper>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
