import type { Role } from "@/services/roles";
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
import moment from "moment";

export const roleColumns: ColumnDef<Role>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span>{row.getValue("id")}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="">{row.getValue("name")}</span>,
  },
  {
    id: "created at",
    header: "Created At",
    cell: ({ row }) => (
      <span className="capitalize">
        {moment
          .utc(row.original.created_at)
          .local()
          .format("YYYY-MM-DD HH:mm:ss")}
      </span>
    ),
  },
  {
    id: "updated at",
    header: "Updated At",
    cell: ({ row }) => (
      <span className="capitalize">
        {moment
          .utc(row.original.updated_at)
          .local()
          .format("YYYY-MM-DD HH:mm:ss")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setOpen: (open: boolean) => void;
        setSelectedRole: (role: Role) => void;
        setShowDetails: (show: boolean) => void;
      };
      const { setOpen, setSelectedRole, setShowDetails } = meta;
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
            <PermissionWrapper permissions={[permissions.updateRoles]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedRole(row.original);
                  setOpen(true);
                }}
              >
                Edit Role
              </DropdownMenuItem>
            </PermissionWrapper>
            <PermissionWrapper permissions={[permissions.viewRoles]}>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                  setSelectedRole(row.original);
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
