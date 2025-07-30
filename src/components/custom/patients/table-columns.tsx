import type { Patient } from "@/services/patients";
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

export const patientColumns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "nic",
    header: "NIC",
    cell: ({ row }) => <span>{row.getValue("nic")}</span>,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("gender") as string}</span>
    ),
  },
  {
    accessorKey: "date_of_birth",
    header: "Date of Birth",
    cell: ({ row }) => (
      <span className="capitalize">
        {new Date(row.getValue("date_of_birth")).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setSelectedPatient: (patient: Patient) => void;
        setOpen: (open: boolean) => void;
        setShowDetails: (show: boolean) => void;
      };
      const { setSelectedPatient, setOpen, setShowDetails } = meta;

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
            <PermissionWrapper permissions={[permissions.managePatients]}>
              <DropdownMenuItem
                onClick={() => {
                  setOpen(true);
                  setSelectedPatient(row.original);
                }}
              >
                Edit Patient
              </DropdownMenuItem>
            </PermissionWrapper>
            <PermissionWrapper permissions={[permissions.viewPatients]}>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                  setSelectedPatient(row.original);
                }}
              >
                More Details
              </DropdownMenuItem>
            </PermissionWrapper>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
