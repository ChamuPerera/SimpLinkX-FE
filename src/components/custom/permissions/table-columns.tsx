import type { Permission } from "@/services/permissions";
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

export const permissionColumns: ColumnDef<Permission>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span>{row.getValue("id")}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("description")}</span>
    ),
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
        setSelectedPermission: (permission: Permission) => void;
        setShowDetails: (show: boolean) => void;
        setShowManagePermissions: (show: boolean) => void;
      };
      const {
        setOpen,
        setSelectedPermission,
        setShowDetails,
        setShowManagePermissions,
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
            <PermissionWrapper permissions={[permissions.updatePermissions]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedPermission(row.original);
                  setOpen(true);
                }}
              >
                Edit Permission
              </DropdownMenuItem>
            </PermissionWrapper>

            <PermissionWrapper permissions={[permissions.assignPermissions]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedPermission(row.original);
                  setShowManagePermissions(true);
                }}
              >
                Manage Permissions
              </DropdownMenuItem>
            </PermissionWrapper>

            <PermissionWrapper permissions={[permissions.viewPermissions]}>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                  setSelectedPermission(row.original);
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
