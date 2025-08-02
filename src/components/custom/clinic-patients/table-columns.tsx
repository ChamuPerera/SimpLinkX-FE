import type { ClinicPatient } from "@/services/clinic-patients";
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

export const clinicPatientColumns: ColumnDef<ClinicPatient>[] = [
  {
    accessorKey: "patient.name",
    header: "Patient Name",
    cell: ({ row }) => <span>{row.original.patient?.name}</span>,
  },
  {
    accessorKey: "patient.nic",
    header: "NIC",
    cell: ({ row }) => <span>{row.original.patient?.nic}</span>,
  },
  {
    accessorKey: "clinic.name",
    header: "Clinic Name",
    cell: ({ row }) => <span>{row.original.clinic?.name}</span>,
  },
  {
    accessorKey: "clinic.hospital.name",
    header: "Hospital",
    cell: ({ row }) => <span>{row.original.clinic?.hospital?.name}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Added Date",
    cell: ({ row }) => (
      <span>
        {row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString()
          : "-"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setSelectedClinicPatient: (clinicPatient: ClinicPatient) => void;
        setOpen: (open: boolean) => void;
        handleDelete: (id: number) => void;
        setShowMoreInfo: (show: boolean) => void;
      };
      const {
        setSelectedClinicPatient,
        setOpen,
        handleDelete,
        setShowMoreInfo,
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
            <DropdownMenuItem
              onClick={() => {
                setSelectedClinicPatient(row.original);
                setShowMoreInfo(true);
              }}
            >
              View Details
            </DropdownMenuItem>
            <PermissionWrapper permissions={[permissions.manageClinicPatients]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedClinicPatient(row.original);
                  setOpen(true);
                }}
              >
                Edit Assignment
              </DropdownMenuItem>
            </PermissionWrapper>
            <PermissionWrapper permissions={[permissions.manageClinicPatients]}>
              <DropdownMenuItem
                onClick={() => {
                  if (row.original.id) {
                    handleDelete(row.original.id);
                  }
                }}
                className="text-red-600"
              >
                Remove Assignment
              </DropdownMenuItem>
            </PermissionWrapper>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
