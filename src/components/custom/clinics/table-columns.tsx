import type { Clinic } from "@/services/clinics";
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

export const clinicColumns: ColumnDef<Clinic>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="max-w-xs truncate">{row.getValue("description")}</span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span>{row.getValue("location")}</span>,
  },
  {
    accessorKey: "total_hourly_tokens",
    header: "Total Tokens",
    cell: ({ row }) => <span>{row.getValue("total_hourly_tokens")}</span>,
  },
  {
    accessorKey: "self_hourly_tokens",
    header: "Self Tokens",
    cell: ({ row }) => <span>{row.getValue("self_hourly_tokens")}</span>,
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setOpen: (open: boolean) => void;
        setSelectedClinic: (clinic: Clinic) => void;
        setShowDetails: (show: boolean) => void;
      };
      const { setOpen, setSelectedClinic, setShowDetails } = meta;
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
            <PermissionWrapper permissions={[permissions.manageHospitals]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedClinic(row.original);
                  setOpen(true);
                }}
              >
                Edit Clinic
              </DropdownMenuItem>
            </PermissionWrapper>
            <PermissionWrapper permissions={[permissions.manageHospitals]}>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                  setSelectedClinic(row.original);
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
