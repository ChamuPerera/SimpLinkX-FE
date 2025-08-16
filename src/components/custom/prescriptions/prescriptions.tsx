/* eslint-disable react-hooks/exhaustive-deps */
import type { Prescription } from "@/types/prescriptions";
import type { FC } from "react";

import { AddMedicines } from "@/components/custom/medicines";
import { PrescriptionTable } from "@/components/custom/prescriptions/table";
import { prescriptionColumns } from "@/components/custom/prescriptions/table-columns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import {
  useDeletePrescription,
  usePrescriptions,
} from "@/hooks/use-prescriptions";
import React, { useEffect, useState } from "react";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

export const Prescriptions: FC = React.memo(() => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showMedicines, setShowMedicines] = useState<boolean>(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });

  const { data } = usePrescriptions({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
  });

  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const deletePrescriptionMutation = useDeletePrescription();

  const closeDeleteAlert = () => {
    setShowDeleteAlert(false);
    setDeletingId(null);
  };

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      await deletePrescriptionMutation.mutateAsync(deletingId);
      toast.success("Prescription deleted successfully");
      closeDeleteAlert();
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to delete prescription",
      );
    }
  };

  // reset current page when search changes
  useEffect(() => {
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  }, [search]);

  return (
    <div className="flex w-full flex-col">
      <h2 className="text-lg font-semibold">Prescriptions</h2>
      <p className="text-sm text-gray-500">
        Manage prescriptions and medicines
      </p>

      {/* prescription details dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="w-full sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>View prescription information</DialogDescription>
          </DialogHeader>

          {selectedPrescription && (
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Patient:</span>{" "}
                {selectedPrescription.patient?.name} (
                {selectedPrescription.patient?.nic})
              </div>
              <div>
                <span className="font-medium">Doctor:</span>{" "}
                {selectedPrescription.doctor?.name || "N/A"}
              </div>
              <div>
                <span className="font-medium">Pharmacist:</span>{" "}
                {selectedPrescription.pharmacist?.name || "N/A"}
              </div>
              <div>
                <span className="font-medium">Hospital:</span>{" "}
                {selectedPrescription?.hospital?.name}
              </div>
              <div>
                <span className="font-medium">Date:</span>{" "}
                {new Date(selectedPrescription.date).toLocaleDateString()}
              </div>
              <div className="capitalize">
                <span className="font-medium">Status:</span>{" "}
                {selectedPrescription.status}
              </div>
              <div className="capitalize">
                <span className="font-medium">Token Type:</span>{" "}
                {selectedPrescription.token_type}
              </div>
              <div className="w-full">
                <p className="font-medium">Medicines:</p>{" "}
                {selectedPrescription.medicines &&
                selectedPrescription.medicines.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-full">
                    {selectedPrescription.medicines.map((med, index) => {
                      const frequency =
                        typeof med.frequency === "string"
                          ? JSON.parse(med.frequency)
                          : med.frequency;
                      return (
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
                                Morning : {frequency?.morning ? "Yes" : "No"}
                              </p>
                              <p className="ps-5 italic">
                                Afternoon :{" "}
                                {frequency?.afternoon ? "Yes" : "No"}
                              </p>
                              <p className="ps-5 italic">
                                Night : {frequency?.night ? "Yes" : "No"}
                              </p>
                              <p className="ps-5 italic">
                                If Needed :{" "}
                                {frequency?.if_needed ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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

      {/* medicines management dialog */}
      {selectedPrescription && (
        <AddMedicines
          prescriptionId={selectedPrescription.id!}
          open={showMedicines}
          setOpen={setShowMedicines}
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
            <AlertDialogCancel onClick={closeDeleteAlert}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deletePrescriptionMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePrescriptionMutation.isPending ? (
                <PiSpinnerGapBold className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* prescriptions list */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <PrescriptionTable
          columns={prescriptionColumns}
          data={data?.prescriptions || []}
          search={search}
          setSearch={setSearch}
          setSelectedPrescription={setSelectedPrescription}
          setShowDetails={setShowDetails}
          setShowMedicines={setShowMedicines}
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
        ></PrescriptionTable>
      </div>
    </div>
  );
});
