import type { ClinicPatient } from "@/services/clinic-patients";
import type { FC } from "react";

import { ClinicPatientDialog } from "@/components/custom/clinic-patients/clinic-patient-dialog";
import { ClinicPatientTable } from "@/components/custom/clinic-patients/table";
import { clinicPatientColumns } from "@/components/custom/clinic-patients/table-columns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import { permissions } from "@/constants/permissions";
import {
  useClinicPatients,
  useDeleteClinicPatient,
} from "@/hooks/use-clinic-patients";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

export const ClinicPatients: FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [search, setSearch] = useState("");
  const [clinicFilter, setClinicFilter] = useState<number | undefined>(
    undefined,
  );
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });

  // Fetch clinic patients
  const { data } = useClinicPatients({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
    clinic_id: clinicFilter,
  });

  const [selectedClinicPatient, setSelectedClinicPatient] =
    useState<ClinicPatient | null>(null);

  // Delete mutation
  const { mutateAsync: deleteClinicPatient, isPending: isDeleting } =
    useDeleteClinicPatient();

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setShowDeleteAlert(true);
  };

  // Handle delete
  const confirmDelete = async () => {
    if (deletingId === null) return;

    const alert = toast.loading("Removing patient from clinic...");
    try {
      await deleteClinicPatient(deletingId);
      toast.success("Patient removed from clinic successfully", {
        id: alert,
      });
    } catch {
      toast.error("Failed to remove patient from clinic", {
        id: alert,
      });
    }
  };

  // Clear selected clinic patient when dialog closes
  const closeDialog = () => {
    setSelectedClinicPatient(null);
    setOpen(false);
  };

  // Reset current page when search or filter is changed
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  }, [search, clinicFilter]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Clinic Patients</h2>
          <p className="text-sm text-gray-500">
            Manage patient assignments to clinics
          </p>
        </div>
      </div>

      {/* Clinic Patient Dialog */}
      {open && (
        <ClinicPatientDialog
          open={open}
          onOpenChange={closeDialog}
          clinicPatient={selectedClinicPatient || undefined}
        />
      )}

      {/* More Info Dialog */}
      {showMoreInfo && selectedClinicPatient && (
        <MoreInfo
          clinicPatient={selectedClinicPatient}
          onOpenChange={setShowMoreInfo}
          open={showMoreInfo}
        />
      )}

      {/* delete confirmation alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              prescription.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <PiSpinnerGapBold className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clinic Patients Table */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <ClinicPatientTable
          columns={clinicPatientColumns}
          data={data?.clinicPatients || []}
          search={search}
          setSearch={setSearch}
          clinicFilter={clinicFilter}
          setClinicFilter={setClinicFilter}
          setSelectedClinicPatient={setSelectedClinicPatient}
          setOpen={setOpen}
          setShowMoreInfo={setShowMoreInfo}
          handleDelete={handleDelete}
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
          <PermissionWrapper permissions={[permissions.manageClinicPatients]}>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                setSelectedClinicPatient(null);
                setOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Patient to Clinic
            </Button>
          </PermissionWrapper>
        </ClinicPatientTable>
      </div>
    </div>
  );
});

const MoreInfo: FC<{
  clinicPatient: ClinicPatient;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}> = React.memo(({ clinicPatient, onOpenChange, open }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Clinic Patient Details - {clinicPatient.patient?.name}
          </DialogTitle>
          <DialogDescription>
            View details of the clinic patient assignment.
          </DialogDescription>
        </DialogHeader>

        {/* Details */}
        <div className="text-sm">
          <p>
            <span className="font-medium">Patient Name:</span>{" "}
            {clinicPatient.patient?.name}
          </p>
          <p>
            <span className="font-medium">Clinic Name:</span>{" "}
            {clinicPatient.clinic?.name}
          </p>
          <p>
            <span className="font-medium">Hospital:</span>{" "}
            {clinicPatient.clinic?.hospital?.name}
          </p>
          <p>
            <span className="font-medium">Added Date:</span>{" "}
            {clinicPatient.created_at
              ? new Date(clinicPatient.created_at).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <span className="font-medium">Updated Date:</span>{" "}
            {clinicPatient.updated_at
              ? new Date(clinicPatient.updated_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
});
