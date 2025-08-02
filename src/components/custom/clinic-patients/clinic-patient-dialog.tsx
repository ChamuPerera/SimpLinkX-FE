import type { ClinicPatient } from "@/services/clinic-patients";
import type { ClinicPatientSchema } from "@/validations/clinic-patients";
import type { FC } from "react";

import {
  Button,
  Combobox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui";
import {
  useCreateClinicPatient,
  useUpdateClinicPatient,
} from "@/hooks/use-clinic-patients";
import { useClinics } from "@/hooks/use-clinics";
import { usePatients } from "@/hooks/use-patients";
import { clinicPatientSchema } from "@/validations/clinic-patients";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ClinicPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicPatient?: ClinicPatient;
}

export const ClinicPatientDialog: FC<ClinicPatientDialogProps> = React.memo(
  ({ open, onOpenChange, clinicPatient }) => {
    const isEdit = Boolean(clinicPatient);
    const [clinicSearch, setClinicSearch] = useState("");
    const [patientSearch, setPatientSearch] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
      {},
    );

    // Fetch data
    const { data: clinicsData, isLoading: isClinicsLoading } = useClinics({
      pageSize: 20,
      currentPage: 1,
      search: clinicSearch,
    });

    const { data: patientsData, isLoading: isPatientsLoading } = usePatients({
      pageSize: 20,
      currentPage: 1,
      search: patientSearch,
    });

    // Mutations
    const { mutateAsync: createClinicPatient, isPending: isCreating } =
      useCreateClinicPatient();
    const { mutateAsync: updateClinicPatient, isPending: isUpdating } =
      useUpdateClinicPatient();

    // Form setup
    const form = useForm<ClinicPatientSchema>({
      resolver: zodResolver(clinicPatientSchema),
      defaultValues: {
        clinic_id: 0,
        patient_id: 0,
      },
    });

    // Effect to set form values when editing
    useEffect(() => {
      if (isEdit && clinicPatient && open) {
        form.reset({
          clinic_id: clinicPatient.clinic_id,
          patient_id: clinicPatient.patient_id,
        });
      } else if (!isEdit && open) {
        form.reset({
          clinic_id: 0,
          patient_id: 0,
        });
      }
    }, [isEdit, clinicPatient, open, form]);

    // Form submission
    const onSubmit = async (data: ClinicPatientSchema) => {
      setErrors({});
      const alert = toast.loading(
        isEdit ? "Updating clinic patient..." : "Adding clinic patient...",
      );

      try {
        if (isEdit && clinicPatient?.id) {
          await updateClinicPatient({
            id: clinicPatient.id,
            ...data,
          });
          toast.success("Clinic patient updated successfully", {
            id: alert,
          });
        } else {
          await createClinicPatient(data);
          toast.success("Clinic patient added successfully", {
            id: alert,
          });
        }
        form.reset();
        onOpenChange(false);
      } catch (error: unknown) {
        const errorData =
          error && typeof error === "object" && "response" in error
            ? (
                error as {
                  response: {
                    data: {
                      errors?: Record<string, string[]>;
                      message?: string;
                    };
                  };
                }
              ).response?.data
            : null;
        if (errorData?.errors) {
          setErrors(errorData.errors);
          toast.error("Validation failed", {
            description: "Please check the form for errors",
            id: alert,
          });
        } else if (errorData?.message) {
          toast.error(errorData.message, { id: alert });
        } else {
          toast.error(
            isEdit
              ? "Failed to update clinic patient"
              : "Failed to add clinic patient",
            { id: alert },
          );
        }
      }
    };

    // Prepare clinic options
    const clinicOptions =
      clinicsData?.clinics?.map((clinic) => ({
        label: `${clinic.name} - ${clinic.location}`,
        value: clinic.id?.toString() || "",
      })) || [];

    // Prepare patient options
    const patientOptions =
      patientsData?.patients?.map((patient) => ({
        label: `${patient.name} (${patient.nic})`,
        value: patient.id?.toString() || "",
      })) || [];

    const isLoading = isCreating || isUpdating;

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Clinic Patient" : "Add Clinic Patient"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the clinic patient assignment."
                : "Assign a patient to a clinic."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Clinic Selection */}
              <FormField
                control={form.control}
                name="clinic_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinic</FormLabel>
                    <FormControl>
                      <Combobox
                        items={clinicOptions}
                        search={clinicSearch}
                        onChange={setClinicSearch}
                        isLoading={isClinicsLoading}
                        placeholder="Select clinic..."
                        value={field.value ? field.value.toString() || "" : ""}
                        setValue={(value) => {
                          field.onChange(value ? Number(value) : 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {errors.clinic_id && (
                      <p className="text-sm text-red-500">
                        {Array.isArray(errors.clinic_id)
                          ? errors.clinic_id[0]
                          : errors.clinic_id}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {/* Patient Selection */}
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <FormControl>
                      <Combobox
                        items={patientOptions}
                        search={patientSearch}
                        onChange={setPatientSearch}
                        isLoading={isPatientsLoading}
                        placeholder="Select patient..."
                        value={field.value ? field.value.toString() || "" : ""}
                        setValue={(value) => {
                          field.onChange(value ? Number(value) : 0);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                    {errors.patient_id && (
                      <p className="text-sm text-red-500">
                        {Array.isArray(errors.patient_id)
                          ? errors.patient_id[0]
                          : errors.patient_id}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? isEdit
                      ? "Updating..."
                      : "Adding..."
                    : isEdit
                      ? "Update"
                      : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  },
);
