import type { OpdToken } from "@/types/appointments";
import type { FC } from "react";

import { OpdTokenDialog } from "@/components/custom/appointments/opd-token-dialog";
import { Button } from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { useDeleteOpdToken, useOpdTokens } from "@/hooks/use-appointments";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import React, { useState } from "react";
import { toast } from "sonner";

export const OpdTokens: FC = React.memo(() => {
  const [search] = useState("");
  const [opdDateFilter] = useState("default");
  const [typeFilter] = useState("default");
  const [pagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<OpdToken | undefined>();

  // Fetch data
  const { data, isLoading, error } = useOpdTokens({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
    opd_date_id:
      opdDateFilter === "default" ? undefined : Number(opdDateFilter),
    type: typeFilter === "default" ? undefined : typeFilter,
  });

  // Delete mutation
  const { mutateAsync: deleteOpdToken } = useDeleteOpdToken();

  // Handle delete function
  const handleDelete = async (id: number) => {
    try {
      await deleteOpdToken(id);
      toast.success("OPD appointment deleted successfully", {
        description: new Date().toLocaleString(),
      });
    } catch {
      toast.error("Failed to delete OPD appointment", {
        description: "Please try again later",
      });
    }
  };

  const handleCreate = () => {
    setSelectedToken(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (token: OpdToken) => {
    setSelectedToken(token);
    setDialogOpen(true);
  };

  const handleDeleteClick = (token: OpdToken) => {
    if (
      token.id &&
      confirm("Are you sure you want to delete this OPD appointment?")
    ) {
      handleDelete(token.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading OPD appointments...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error loading OPD appointments</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">OPD Appointments</h3>
          <p className="text-sm text-gray-500">
            Manage OPD appointment tokens and schedules
          </p>
        </div>
        <PermissionWrapper permissions={[permissions.manageAppointments]}>
          <Button
            size={"sm"}
            variant={"outline"}
            className="w-32"
            onClick={handleCreate}
          >
            Add New
          </Button>
        </PermissionWrapper>
      </div>

      {/* Basic table display */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-900">
                  Token Number
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-900">
                  Patient
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-900">
                  OPD Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-900">
                  Time
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-900">
                  Type
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.opdTokens?.length ? (
                data.opdTokens.map((token) => (
                  <tr key={token.id} className="border-b hover:bg-gray-50/50">
                    <td className="p-4 align-middle">{token.token_number}</td>
                    <td className="p-4 align-middle">
                      {token.patient?.user?.name || "Unknown"}
                    </td>
                    <td className="p-4 align-middle">
                      {token.opd_date?.date
                        ? new Date(token.opd_date.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-4 align-middle">
                      {token.start_time} - {token.end_time}
                    </td>
                    <td className="p-4 align-middle">
                      <span className="capitalize">{token.type}</span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(token)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(token)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="h-24 text-center text-gray-500">
                    No OPD appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination info */}
      {data?.total && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {data.from} to {data.to} of {data.total} results
          </div>
        </div>
      )}

      <OpdTokenDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        token={selectedToken}
      />
    </div>
  );
});
