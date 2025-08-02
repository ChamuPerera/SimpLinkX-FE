import type { ClinicToken } from "@/types/appointments";
import type {
  ClinicTokenSchema,
  ClinicTokenUpdateSchema,
} from "@/validations/appointments";
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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  useClinicAvailableSlots,
  useCreateClinicToken,
  useUpdateClinicToken,
} from "@/hooks/use-appointments";
import { useClinicDates } from "@/hooks/use-clinic-dates";
import { usePatients } from "@/hooks/use-patients";
import {
  clinicTokenSchema,
  clinicTokenUpdateSchema,
} from "@/validations/appointments";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ClinicTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token?: ClinicToken;
}

export const ClinicTokenDialog: FC<ClinicTokenDialogProps> = React.memo(
  ({ open, onOpenChange, token }) => {
    const isEdit = Boolean(token);
    const [search, setSearch] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
      {},
    );

    const { data: patientsData, isLoading: isPatientsLoading } = usePatients({
      pageSize: 20,
      currentPage: 1,
      search,
    });

    // Mutations
    const { mutateAsync: createToken, isPending: isCreating } =
      useCreateClinicToken();
    const { mutateAsync: updateToken, isPending: isUpdating } =
      useUpdateClinicToken();

    // Fetch clinic dates for dropdown
    const { data: clinicDatesData } = useClinicDates({
      currentPage: 1,
      pageSize: 100,
      future_only: true,
      status: "scheduled",
    });

    // Form setup
    const form = useForm<ClinicTokenSchema | ClinicTokenUpdateSchema>({
      resolver: zodResolver(
        isEdit ? clinicTokenUpdateSchema : clinicTokenSchema,
      ),
      defaultValues: {
        patient_id: 0,
        clinic_date_id: 0,
        start_time: "",
        end_time: "",
      },
    });

    // Fetch selected clinic date data
    const { data: slots, isLoading: isSlotsLoading } = useClinicAvailableSlots(
      form.watch("clinic_date_id"),
    );

    const onSubmit = async (
      data: ClinicTokenSchema | ClinicTokenUpdateSchema,
    ) => {
      if (isEdit && token?.id) {
        await updateToken({
          id: token.id,
          values: data,
        })
          .then(() => {
            toast.success("Clinic appointment updated successfully", {
              description: new Date().toLocaleString(),
            });
            onOpenChange(false);
            form.reset();
          })
          .catch((error) => {
            setErrors(
              error?.response?.data?.errors || {
                message:
                  error?.response?.data?.message || "Something went wrong",
              },
            );
          });
      } else {
        await createToken(data as ClinicTokenSchema)
          .then(() => {
            toast.success("Clinic appointment created successfully", {
              description: new Date().toLocaleString(),
            });
            onOpenChange(false);
            form.reset();
          })
          .catch((error) => {
            setErrors(
              error?.response?.data?.errors || {
                message:
                  error?.response?.data?.message || "Something went wrong",
              },
            );
          });
      }
    };

    // Reset form when token changes
    useEffect(() => {
      if (token && isEdit) {
        form.reset({
          patient_id: token.patient_id || 0,
          clinic_date_id: token.clinic_id || 0,
          start_time: token.start_time || "",
          end_time: token.end_time || "",
        });
      } else {
        form.reset({
          patient_id: 0,
          clinic_date_id: 0,
          start_time: "",
          end_time: "",
        });
      }
    }, [token, isEdit, form]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit Clinic Appointment" : "Create Clinic Appointment"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the clinic appointment details below."
                : "Fill in the details to create a new clinic appointment."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Patient id */}
              {!isEdit && (
                <FormField
                  control={form.control}
                  name="patient_id"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="mb-2">Patient</Label>
                      <Combobox
                        isLoading={isPatientsLoading}
                        items={
                          patientsData?.patients?.map((patient) => ({
                            label: `${patient.name} (${patient.nic})`,
                            value: patient.id?.toString() || "",
                          })) || []
                        }
                        onChange={setSearch}
                        placeholder="Patient"
                        search={search}
                        setValue={(value) => field.onChange(Number(value))}
                        value={field.value === 0 ? "" : field.value.toString()}
                      />
                      <FormMessage>
                        {errors["patient_id"] && errors["patient_id"][0]}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}

              {/* Clinic Date */}
              {!isEdit && (
                <FormField
                  control={form.control}
                  name="clinic_date_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinic Date</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={
                          field.value === 0 ? undefined : field.value.toString()
                        }
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select clinic date" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clinicDatesData?.clinicDates?.map((clinicDate) => {
                            if (clinicDate.id) {
                              return (
                                <SelectItem
                                  key={clinicDate.id}
                                  value={clinicDate.id?.toString()}
                                >
                                  {new Date(
                                    clinicDate.date,
                                  ).toLocaleDateString()}{" "}
                                  - {clinicDate.clinic?.name || ""}{" "}
                                  {` (${clinicDate.start_time} - ${clinicDate.end_time})`}
                                </SelectItem>
                              );
                            }
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {errors["clinic_date_id"] &&
                          errors["clinic_date_id"][0]}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              )}

              {isEdit && (
                <div className="text-sm pb-2 mb-5 border-b border-gray-300">
                  <p className="">
                    <span className="font-medium">Clinic Date:</span>{" "}
                    {token?.clinic_date?.date
                      ? new Date(token.clinic_date.date).toLocaleDateString()
                      : "N/A"}{" "}
                    - {token?.clinic_date?.clinic?.name || "N/A"}
                  </p>
                  <p className="">
                    <span className="font-medium">Patient:</span>{" "}
                    {token?.patient?.name || "N/A"}
                  </p>
                </div>
              )}

              <Label className="mb-2">Time slots</Label>

              {isSlotsLoading && (
                <p className="text-sm">Loading Time Slots...</p>
              )}

              {!isSlotsLoading && slots?.length === 0 && (
                <p className="text-gray-500 text-sm">No Time Slots available</p>
              )}

              {!isSlotsLoading && !slots && (
                <p className="text-gray-500 text-sm">
                  Select an Clinic date to view time slots
                </p>
              )}

              {/* Start and End Time */}
              <div className="grid grid-cols-3 gap-2">
                {slots?.map((slot, index) => (
                  <Button
                    key={index}
                    variant={
                      form.watch("start_time") === slot.start_time
                        ? "default"
                        : "outline"
                    }
                    size={"sm"}
                    type="button"
                    disabled={slot.available_slots === 0}
                    onClick={() => {
                      form.setValue("start_time", slot.start_time);
                      form.setValue("end_time", slot.end_time);
                    }}
                  >
                    {`${slot.start_time} - ${slot.end_time}`} (
                    {slot.available_slots}
                    {slot?.total_available_slots
                      ? `/${slot.total_available_slots}`
                      : ""}
                    )
                  </Button>
                ))}
              </div>

              <FormMessage>
                {errors["message"] &&
                  (errors["message"] || errors["message"][0])}
              </FormMessage>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating
                    ? isEdit
                      ? "Updating..."
                      : "Creating..."
                    : isEdit
                      ? "Update"
                      : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  },
);
