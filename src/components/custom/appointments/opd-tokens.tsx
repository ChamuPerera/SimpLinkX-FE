import type { OpdToken } from "@/types/appointments";
import type { FC } from "react";

import {
  OpdTable,
  opdTableColumns,
  OpdTokenDialog,
} from "@/components/custom/appointments";
import { Button } from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { useOpdTokens } from "@/hooks/use-appointments";
import { useCreatePrescription } from "@/hooks/use-prescriptions";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import React, { useState } from "react";
import { toast } from "sonner";

export const OpdTokens: FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [, setShowDetails] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [opdDateFilter, setOpdDateFilter] = useState<Date | undefined>(
    undefined,
  );
  const [typeFilter, setTypeFilter] = useState("default");
  const [selectedOpdToken, setSelectedOpdToken] = useState<
    OpdToken | undefined
  >();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });

  const { mutateAsync: createPrescription } = useCreatePrescription();

  // Fetch data
  const { data } = useOpdTokens({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
    date: opdDateFilter,
    type: typeFilter === "default" ? undefined : typeFilter,
  });

  // Add prescriptions function
  const handleCreatePrescriptions = async (selected: {
    patient_id: number;
    opd_token_id: number;
  }) => {
    if (!selected) return;

    const { patient_id, opd_token_id } = selected;

    const alert = toast.loading("Creating prescription...");

    await createPrescription({
      patient_id,
      opd_token_id,
    })
      .then(() => {
        toast.success("Prescription created", {
          id: alert,
        });
      })
      .catch(() => {
        toast.error("Failed to create prescription", {
          id: alert,
        });
      });
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <OpdTable
          columns={opdTableColumns}
          data={data?.opdTokens || []}
          search={search}
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          opdDateFilter={opdDateFilter}
          setOpdDateFilter={setOpdDateFilter}
          setSelectedOpdToken={setSelectedOpdToken}
          handleCreatePrescriptions={handleCreatePrescriptions}
          setOpen={setOpen}
          setShowDetails={setShowDetails}
          setPagination={setPagination}
          pagination={{
            currentPage: pagination.currentPage,
            pageSize: pagination.pageSize,
            from: data?.from || 0,
            to: data?.to || 0,
            total: data?.total || 0,
            endPage: data?.endPage || 0,
          }}
        >
          <PermissionWrapper permissions={[permissions.manageAppointments]}>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-32"
              onClick={() => setOpen(true)}
            >
              Add New
            </Button>
          </PermissionWrapper>
        </OpdTable>
      </div>

      <PermissionWrapper permissions={[permissions.manageAppointments]}>
        <OpdTokenDialog
          open={open}
          onOpenChange={setOpen}
          token={selectedOpdToken}
        />
      </PermissionWrapper>
    </div>
  );
});
