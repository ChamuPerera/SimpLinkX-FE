import type { OpdToken } from "@/types/appointments";
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

export const opdTableColumns: ColumnDef<OpdToken>[] = [
  {
    id: "token_number",
    header: "Token Number",
    cell: ({ row }) => <span>{row.original.token_number}</span>,
  },
  {
    id: "patient_name",
    header: "Patient Name",
    cell: ({ row }) => <span>{row.original.patient?.name}</span>,
  },
  {
    id: "nic",
    header: "NIC",
    cell: ({ row }) => <span>{row.original.patient?.nic}</span>,
  },
  {
    id: "opd_date",
    header: "OPD Date",
    cell: ({ row }) => (
      <span>
        {row.original.opd_date?.date
          ? new Date(row.original.opd_date.date).toLocaleDateString()
          : "N/A"}
      </span>
    ),
  },
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => (
      <span>{`${row.original.start_time} - ${row.original.end_time}`}</span>
    ),
  },

  {
    id: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.type ?? "N/A"}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const meta = table.options.meta as {
        setOpen: (open: boolean) => void;
        setSelectedOpdToken: (opdToken: OpdToken) => void;
        setShowDetails: (show: boolean) => void;
        handleCreatePrescriptions: (selected: {
          patient_id: number;
          opd_token_id: number;
        }) => Promise<void>;
      };
      const {
        setOpen,
        setSelectedOpdToken,
        setShowDetails,
        handleCreatePrescriptions,
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
            <PermissionWrapper permissions={[permissions.manageAppointments]}>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOpdToken(row.original);
                  setOpen(true);
                }}
              >
                Edit OPD Token
              </DropdownMenuItem>
            </PermissionWrapper>
            {row.original.prescriptions &&
              row.original.prescriptions.length === 0 && (
                <PermissionWrapper
                  permissions={[permissions.createPrescriptions]}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      handleCreatePrescriptions({
                        opd_token_id: row.original.id,
                        patient_id: row.original.patient_id,
                      });
                    }}
                  >
                    Create Prescription
                  </DropdownMenuItem>
                </PermissionWrapper>
              )}
            <PermissionWrapper permissions={[permissions.viewAppointments]}>
              <DropdownMenuItem
                onClick={() => {
                  setShowDetails(true);
                  setSelectedOpdToken(row.original);
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
