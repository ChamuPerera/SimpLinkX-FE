import type { User } from "@/services/users";
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

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.getValue("email")}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span className="capitalize">
        {(row.getValue("role") as string).replace(/_/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`capitalize ${row.getValue("status") === "working" ? "text-green-500" : row.getValue("status") === "retired" ? "text-yellow-500" : "text-red-500"}`}
      >
        {row.getValue("role") === "patient" ? "N/A" : row.getValue("status")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setShowStatusChange: (open: boolean) => void;
        setShowHospitalChange: (open: boolean) => void;
        setSelectedUser: (user: User) => void;
        setShowDetails: (show: boolean) => void;
        user: User;
      };
      const {
        setShowStatusChange,
        setShowHospitalChange,
        setSelectedUser,
        setShowDetails,
        user,
      } = meta;
      const role = row.getValue("role") as string;
      const isPatient = role === "patient";
      const isSameAsLoggedInUser = row.original.id === user?.id;

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
            {!isSameAsLoggedInUser && (
              <PermissionWrapper permissions={[permissions.updateUsers]}>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(row.original);
                    setShowStatusChange(true);
                  }}
                >
                  Change Status
                </DropdownMenuItem>
              </PermissionWrapper>
            )}
            {!isSameAsLoggedInUser && !isPatient && (
              <PermissionWrapper
                permissions={[permissions.updateUsersHospital]}
              >
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(row.original);
                    setShowHospitalChange(true);
                  }}
                >
                  Change Hospital
                </DropdownMenuItem>
              </PermissionWrapper>
            )}
            <PermissionWrapper permissions={[permissions.viewUsers]}>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                  setSelectedUser(row.original);
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
