import type { Prescription } from "@/types/prescriptions";
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

export const prescriptionColumns: ColumnDef<Prescription>[] = [
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => (
      <span>{new Date(row.original.date).toLocaleDateString()}</span>
    ),
  },
  {
    id: "patient",
    header: "Patient",
    cell: ({ row }) => <span>{row.original.patient?.name}</span>,
  },
  {
    id: "token_type",
    header: "Token Type",
    cell: ({ row }) => {
      const tokenType = row.original.token_type as "opd" | "clinic" | null;
      return <span className="capitalize">{tokenType || "N/A"}</span>;
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as
        | "draft"
        | "prescribed"
        | "dispensed"
        | null;
      return <span className="capitalize">{status || "N/A"}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setSelectedPrescription: (prescription: Prescription) => void;
        setShowDetails: (show: boolean) => void;
        setShowMedicines: (show: boolean) => void;
        handleDelete: (id: number) => void;
      };
      const {
        setSelectedPrescription,
        setShowDetails,
        setShowMedicines,
        handleDelete,
      } = meta;

      const manageMedicinePermission =
        row.original.status === "draft"
          ? [permissions.addMedicines]
          : row.original.status === "prescribed"
            ? [permissions.releaseMedicines]
            : null;

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
            <PermissionWrapper permissions={[permissions.viewPrescriptions]}>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                  setSelectedPrescription(row.original);
                }}
              >
                View Details
              </DropdownMenuItem>
            </PermissionWrapper>
            {manageMedicinePermission &&
              manageMedicinePermission.length > 0 && (
                <PermissionWrapper permissions={manageMedicinePermission}>
                  <DropdownMenuItem
                    onClick={() => {
                      setShowMedicines(true);
                      setSelectedPrescription(row.original);
                    }}
                  >
                    Manage Medicines
                  </DropdownMenuItem>
                </PermissionWrapper>
              )}
            <PermissionWrapper permissions={[permissions.deletePrescriptions]}>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(row.original.id!)}
                className="text-red-600"
              >
                Delete Prescription
              </DropdownMenuItem>
            </PermissionWrapper>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
