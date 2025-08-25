import type { OpdToken } from "@/types/appointments";
import type { FC } from "react";

import {
  OpdTable,
  opdTableColumns,
  OpdTokenDialog,
} from "@/components/custom/appointments";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { useOpdTokens } from "@/hooks/use-appointments";
import { useAuth } from "@/hooks/use-auth";
import { useCreatePrescription } from "@/hooks/use-prescriptions";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import React, { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export const OpdTokens: FC = React.memo(() => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [moreInfoOpen, setMoreInfoOpen] = useState(false);
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
        {/* More info */}
        <MoreInfo
          open={moreInfoOpen}
          setOpen={() => {
            setMoreInfoOpen(false);
            setSelectedOpdToken(undefined);
          }}
          selectedOpdToken={selectedOpdToken}
        />
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
          setShowDetails={setMoreInfoOpen}
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

          {user?.role === "patient" && (
            <Link to={"/find-hospitals"} className="w-32">
              <Button size={"sm"} variant={"default"} className="w-32">
                New OPD Visit
              </Button>
            </Link>
          )}
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

const MoreInfo: FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedOpdToken: OpdToken | undefined;
}> = ({ open, setOpen, selectedOpdToken }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>OPD token Details</DialogTitle>
          <DialogDescription>View OPD token information</DialogDescription>
        </DialogHeader>

        {selectedOpdToken && (
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-medium">Patient:</span>{" "}
              {selectedOpdToken.patient?.name} ({selectedOpdToken.patient?.nic})
            </div>
            <div>
              <span className="font-medium">Doctor:</span>{" "}
              {selectedOpdToken?.prescriptions?.[0]?.doctor?.name || "N/A"}
            </div>
            <div>
              <span className="font-medium">Pharmacist:</span>{" "}
              {selectedOpdToken?.prescriptions?.[0]?.pharmacist?.name || "N/A"}
            </div>
            <div>
              <span className="font-medium">Hospital:</span>{" "}
              {selectedOpdToken?.opd_date?.hospital?.name || "N/A"}
            </div>
            <div>
              <span className="font-medium">Date:</span>{" "}
              {selectedOpdToken?.prescriptions?.[0]?.date
                ? new Date(
                    selectedOpdToken.prescriptions[0].date,
                  ).toLocaleDateString()
                : "N/A"}
            </div>
            <div className="capitalize">
              <span className="font-medium">Prescription Status:</span>{" "}
              {selectedOpdToken?.prescriptions?.[0]?.status || "N/A"}
            </div>
            <div className="capitalize">
              <span className="font-medium">Token Type:</span>{" "}
              {selectedOpdToken.type}
            </div>
            <div className="w-full">
              <p className="font-medium">Medicines:</p>{" "}
              {selectedOpdToken?.prescriptions?.[0]?.medicines &&
              selectedOpdToken?.prescriptions?.[0]?.medicines.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-full">
                  {selectedOpdToken?.prescriptions?.[0]?.medicines.map(
                    (med, index) => (
                      <div key={med.id} className=" border-b py-1">
                        <p className="font-medium">
                          {index + 1}.{" "}
                          {med.is_external
                            ? `${med.name_of_external_medicine} (External)`
                            : med.name}
                        </p>
                        <div className="ps-3 text-xs">
                          <p className="">
                            Dosage: {med.dosage} units, Days Supply:{" "}
                            {med.days_supply}
                          </p>
                          {med.duration && <p>Duration: {med.duration}</p>}
                          <div>
                            Frequency:{" "}
                            <p className="ps-5 italic">
                              Morning : {med.frequency?.morning ? "Yes" : "No"}
                            </p>
                            <p className="ps-5 italic">
                              Afternoon :{" "}
                              {med.frequency?.afternoon ? "Yes" : "No"}
                            </p>
                            <p className="ps-5 italic">
                              Night : {med.frequency?.night ? "Yes" : "No"}
                            </p>
                            <p className="ps-5 italic">
                              If Needed :{" "}
                              {med.frequency?.if_needed ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="mt-0.5 text-xs text-gray-500">
                  No medicines added.
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
