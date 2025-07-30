import type { ClinicToken } from "@/types/appointments";
import type { FC } from "react";

import {
  ClinicsTable,
  clinicTableColumns,
  ClinicTokenDialog,
} from "@/components/custom/appointments";
import { Button } from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { useClinicTokens } from "@/hooks/use-appointments";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import React, { useState } from "react";

export const ClinicTokens: FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [, setShowDetails] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [clinicDateFilter, setClinicDateFilter] = useState<Date | undefined>(
    undefined,
  );
  const [typeFilter, setTypeFilter] = useState("default");
  const [selectedClinicToken, setSelectedClinicToken] = useState<
    ClinicToken | undefined
  >();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });

  // Fetch data
  const { data } = useClinicTokens({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
    date: clinicDateFilter,
    type: typeFilter === "default" ? undefined : typeFilter,
  });

  return (
    <div className="flex w-full flex-col">
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <ClinicsTable
          columns={clinicTableColumns}
          data={data?.clinicTokens || []}
          search={search}
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          clinicDateFilter={clinicDateFilter}
          setClinicDateFilter={setClinicDateFilter}
          setSelectedClinicToken={setSelectedClinicToken}
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
        </ClinicsTable>
      </div>

      <PermissionWrapper permissions={[permissions.manageAppointments]}>
        <ClinicTokenDialog
          open={open}
          onOpenChange={setOpen}
          token={selectedClinicToken}
        />
      </PermissionWrapper>
    </div>
  );
});
