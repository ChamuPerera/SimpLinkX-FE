import type { OpdToken } from "@/types/appointments";
import type {
  OpdTokenSchema,
  OpdTokenUpdateSchema,
} from "@/validations/appointments";
import type { FC } from "react";

import { Button, Input } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateOpdToken, useUpdateOpdToken } from "@/hooks/use-appointments";
import { useOpdDates } from "@/hooks/use-opd-dates";
import {
  opdTokenSchema,
  opdTokenUpdateSchema,
} from "@/validations/appointments";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface OpdTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token?: OpdToken;
}

export const OpdTokenDialog: FC<OpdTokenDialogProps> = React.memo(
  ({ open, onOpenChange, token }) => {
    const isEdit = Boolean(token);
    const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
      {},
    );

    // Form setup
    const form = useForm<OpdTokenSchema | OpdTokenUpdateSchema>({
      resolver: zodResolver(isEdit ? opdTokenUpdateSchema : opdTokenSchema),
      defaultValues: {
        patient_id: 0,
        opd_date_id: 0,
        start_time: "",
        end_time: "",
      },
    });

    // Mutations
    const { mutateAsync: createToken, isPending: isCreating } =
      useCreateOpdToken();
    const { mutateAsync: updateToken, isPending: isUpdating } =
      useUpdateOpdToken();

    // Fetch OPD dates for dropdown
    const { data: opdDatesData } = useOpdDates({
      currentPage: 1,
      pageSize: 100,
    });

    const onSubmit = async (data: OpdTokenSchema | OpdTokenUpdateSchema) => {
      if (isEdit && token?.id) {
        await updateToken({
          id: token.id,
          values: data,
        })
          .then(() => {
            toast.success("OPD appointment updated successfully", {
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
        await createToken(data as OpdTokenSchema)
          .then(() => {
            toast.success("OPD appointment created successfully", {
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
          opd_date_id: token.opd_date_id || 0,
          start_time: token.start_time || "",
          end_time: token.end_time || "",
        });
      } else {
        form.reset({
          patient_id: 0,
          opd_date_id: 0,
          start_time: "",
          end_time: "",
        });
      }
    }, [token, isEdit, form]);

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Edit OPD Appointment" : "Create OPD Appointment"}
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Update the OPD appointment details below."
                : "Fill in the details to create a new OPD appointment."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter patient ID"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    {errors["patient_id"] && errors["patient_id"][0]}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="opd_date_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OPD Date</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select OPD date" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {opdDatesData?.opdDates?.map((opdDate) => {
                          if (opdDate.id) {
                            return (
                              <SelectItem
                                key={opdDate.id}
                                value={opdDate.id.toString()}
                              >
                                {new Date(opdDate.date).toLocaleDateString()}
                              </SelectItem>
                            );
                          }
                        })}
                      </SelectContent>
                    </Select>
                    {errors["opd_date_id"] && errors["opd_date_id"][0]}
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage>
                        {errors["start_time"] && errors["start_time"][0]}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage>
                        {errors["end_time"] && errors["end_time"][0]}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>

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
