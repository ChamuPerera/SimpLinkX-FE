import type { ClinicDate } from "@/services/clinic-dates";
import type { ColumnDef } from "@tanstack/react-table";



import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { MoreHorizontal } from "lucide-react";





const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "scheduled":
      return "default";
    case "completed":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
};

export const clinicDateColumns: ColumnDef<ClinicDate>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => <span>{row.getValue("start_time")}</span>,
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    cell: ({ row }) => <span>{row.getValue("end_time")}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setOpen: (open: boolean) => void;
        setSelectedClinicDate: (clinicDate: ClinicDate) => void;
        setShowDetails: (show: boolean) => void;
        setShowStatusDialog: (show: boolean) => void;
      };
      const { setOpen, setSelectedClinicDate, setShowDetails, setShowStatusDialog } = meta;
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
                  setSelectedClinicDate(row.original);
                  setOpen(true);
                }}
              >
                Edit Clinic Date
              </DropdownMenuItem>
            </PermissionWrapper>
            <PermissionWrapper permissions={[permissions.manageHospitals]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedClinicDate(row.original);
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
                  setSelectedClinicDate(row.original);
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