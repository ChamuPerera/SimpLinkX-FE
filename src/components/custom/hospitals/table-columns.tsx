import type { Hospital } from "@/services/hospitals";
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

export const hospitalColumns: ColumnDef<Hospital>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <span>{row.getValue("address")}</span>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span>{row.getValue("phone")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => <span>{row.getValue("district")}</span>,
  },
  {
    accessorKey: "location_url",
    header: "Location",
    cell: ({ row }) => (
      <a
        href={row.getValue("location_url")}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Map
      </a>
    ),
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setOpen: (open: boolean) => void;
        setSelectedHospital: (hospital: Hospital) => void;
        setShowDetails: (show: boolean) => void;
      };
      const { setOpen, setSelectedHospital, setShowDetails } = meta;
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
            <PermissionWrapper permissions={[permissions.updateHospitals]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedHospital(row.original);
                  setOpen(true);
                }}
              >
                Edit Hospital
              </DropdownMenuItem>
            </PermissionWrapper>
            <PermissionWrapper permissions={[permissions.viewHospitals]}>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                  setSelectedHospital(row.original);
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
