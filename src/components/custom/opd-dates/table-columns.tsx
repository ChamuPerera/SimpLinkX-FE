import type { OpdDate } from "@/services/opd-dates";
import type { ColumnDef } from "@tanstack/react-table";

import {
  Badge,
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
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const opdDateColumns: ColumnDef<OpdDate>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as string;
      return <div>{format(new Date(date), "PPP")}</div>;
    },
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => {
      return <div className="font-mono">{row.getValue("start_time")}</div>;
    },
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    cell: ({ row }) => {
      return <div className="font-mono">{row.getValue("end_time")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusVariant = (status: string) => {
        switch (status) {
          case "scheduled":
            return "default";
          case "completed":
            return "secondary";
          case "cancelled":
            return "destructive";
          default:
            return "outline";
        }
      };

      return (
        <Badge variant={getStatusVariant(status)} className="capitalize">
          {status || "scheduled"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setOpen: (open: boolean) => void;
        setSelectedOpdDate: (opdDate: OpdDate) => void;
        setShowDetails: (show: boolean) => void;
        setShowStatusDialog: (show: boolean) => void;
      };
      const {
        setOpen,
        setSelectedOpdDate,
        setShowDetails,
        setShowStatusDialog,
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
            <PermissionWrapper permissions={[permissions.manageHospitals]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOpdDate(row.original);
                  setOpen(true);
                }}
              >
                Edit Opd Date
              </DropdownMenuItem>
            </PermissionWrapper>
            <PermissionWrapper permissions={[permissions.manageHospitals]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOpdDate(row.original);
                  setShowStatusDialog(true);
                }}
              >
                Update Status
              </DropdownMenuItem>
            </PermissionWrapper>
            <PermissionWrapper permissions={[permissions.manageHospitals]}>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                  setSelectedOpdDate(row.original);
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
