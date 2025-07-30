import type { OpdDate } from "@/services/opd-dates";
import type { FC } from "react";
import type z from "zod";

import { OpdDateTable } from "@/components/custom/opd-dates/table";
import { opdDateColumns } from "@/components/custom/opd-dates/table-columns";
import {
  Button,
  Calendar,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { useAuth } from "@/hooks/use-auth";
import {
  useCreateOpdDate,
  useOpdDates,
  useUpdateOpdDate,
  useUpdateOpdDateStatus,
} from "@/hooks/use-opd-dates";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { cn } from "@/utils";
import { opdDateSchema } from "@/validations/opd-dates";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

const opdDateDefaultValues: OpdDate = {
  hospital_id: 0,
  date: new Date(),
  start_time: "",
  end_time: "",
  status: "scheduled",
};

export const OpdDates: FC = React.memo(() => {
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showStatusDialog, setShowStatusDialog] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("default");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });
  const { data } = useOpdDates({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
    hospital_id: user?.hospital_id,
    status: statusFilter === "default" ? undefined : statusFilter || undefined,
  });
  const [selectedOpdDate, setSelectedOpdDate] = useState<OpdDate | null>(null);

  // clear selected opd date when dialog closes
  const closeDialog = () => {
    setSelectedOpdDate(null);
    setOpen(false);
    setShowDetails(false);
    setShowStatusDialog(false);
  };

  // reset current page when search or status filter is changed
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  }, [search, statusFilter]);

  return (
    <div className="flex w-full flex-col">
      <h2 className="text-lg font-semibold">OPD Dates</h2>
      <p className="text-sm text-gray-500">
        Manage OPD schedules and appointments
      </p>

      {/* opd date dialog */}
      <OpdDateDialog
        open={open}
        onClose={closeDialog}
        data={selectedOpdDate}
        hospitalId={user?.hospital_id || null}
      />

      {/* opd date status dialog */}
      <OpdDateStatusDialog
        open={showStatusDialog}
        onClose={closeDialog}
        data={selectedOpdDate}
      />

      {/* opd dates list */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <OpdDateTable
          columns={opdDateColumns}
          data={data?.opdDates || []}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setSelectedOpdDate={setSelectedOpdDate}
          setOpen={setOpen}
          setShowDetails={setShowDetails}
          setShowStatusDialog={setShowStatusDialog}
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
          <PermissionWrapper permissions={[permissions.manageHospitals]}>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-32"
              onClick={() => setOpen(true)}
            >
              Add New
            </Button>
          </PermissionWrapper>
        </OpdDateTable>
      </div>

      {/* details dialog */}
      {showDetails && selectedOpdDate && (
        <ShowDetails
          showDetails={selectedOpdDate}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
});

const OpdDateDialog: FC<{
  open: boolean;
  onClose: () => void;
  data?: OpdDate | null;
  hospitalId: number | null;
}> = React.memo(({ open, onClose, data, hospitalId }) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: createOpdDate, isPending: createPending } =
    useCreateOpdDate();
  const { mutateAsync: updateOpdDate, isPending: updatePending } =
    useUpdateOpdDate();

  const form = useForm<z.infer<typeof opdDateSchema>>({
    resolver: zodResolver(opdDateSchema),
    defaultValues: opdDateDefaultValues,
  });

  // form submit handler
  const onSubmit = async (values: z.infer<typeof opdDateSchema>) => {
    setErrors({});
    // standardize date format
    const localMidnightDate = moment(values.date).local().endOf("day");
    const utcDateStringDate = moment(localMidnightDate).utc().format();
    values.date = new Date(utcDateStringDate);
    if (data) {
      const updatedValues = { ...values, id: data.id };
      await updateOpdDate(updatedValues)
        .then(() => {
          toast.success("OPD date updated", {
            description: new Date().toLocaleString(),
          });
          form.reset();
          onClose();
        })
        .catch((error) => {
          setErrors(
            error?.response?.data?.errors || {
              message: error?.response?.data?.message || "Something went wrong",
            },
          );
        });
    } else {
      await createOpdDate(values)
        .then(() => {
          toast.success("OPD date created", {
            description: new Date().toLocaleString(),
          });
          form.reset();
          onClose();
        })
        .catch((error) => {
          setErrors(
            error?.response?.data?.errors || {
              message: error?.response?.data?.message || "Something went wrong",
            },
          );
        });
    }
  };

  // set form values if data is available
  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        status: data.status ?? "scheduled",
        date: data.date ? new Date(data.date) : new Date(),
        hospital_id: data.hospital_id || hospitalId || 0,
      });
    } else {
      form.reset({ ...opdDateDefaultValues, hospital_id: hospitalId || 0 });
    }
  }, [data, form, hospitalId]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        form.reset(opdDateDefaultValues);
      }}
    >
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit OPD Date" : "Create OPD Date"}
          </DialogTitle>
          <DialogDescription>
            {data
              ? "Edit the details of the OPD date."
              : "Fill in the details to create a new OPD date."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 overflow-y-auto p-1"
          >
            {/* date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        startMonth={field.value || new Date()}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < addDays(new Date(), -1) ||
                          // after 2 days
                          date > addDays(new Date(), 2)
                        }
                        captionLayout="label"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* start_time */}
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" placeholder="HH:MM" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["start_time"] && errors["start_time"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* end_time */}
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" placeholder="HH:MM" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["end_time"] && errors["end_time"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage>
                    {errors["status"] && errors["status"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/*common error message */}
            {errors?.message && (
              <div className="flex justify-center">
                <FormMessage className="mt-3 flex w-full max-w-xl items-center justify-center rounded-sm bg-red-500 py-2 text-center text-white">
                  <BiError className="h-5 w-5" /> {errors?.message}
                </FormMessage>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                disabled={createPending || updatePending}
                type="submit"
                className="mt-3 w-full max-w-40"
              >
                {(createPending || updatePending) && (
                  <PiSpinnerGapBold className="animate-spin" />
                )}
                Save OPD Date
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

const OpdDateStatusDialog: FC<{
  open: boolean;
  data: OpdDate | null;
  onClose: () => void;
}> = React.memo(({ open, data, onClose }) => {
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateOpdDateStatus();

  const handleStatusChange = async (status: string) => {
    if (data && data.id) {
      await updateStatus({ id: data.id, status })
        .then(() => {
          toast.success(`OPD date status updated to ${status}`, {
            description: new Date().toLocaleString(),
          });
          onClose();
        })
        .catch((error) => {
          toast.error(
            `Failed to update status: ${error?.response?.data?.message || "Something went wrong"}`,
          );
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update OPD Date Status</DialogTitle>
          <DialogDescription>
            Select a new status for the OPD date.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3">
          {["scheduled", "completed", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={data?.status === status ? "default" : "outline"}
              onClick={() => handleStatusChange(status)}
              disabled={isUpdating}
              className="capitalize"
            >
              {data?.status === status && <Check className="mr-2 h-4 w-4" />}{" "}
              {status}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
});

const ShowDetails: FC<{
  showDetails: OpdDate | null;
  setShowDetails: (show: boolean) => void;
}> = React.memo(({ showDetails, setShowDetails }) => {
  return (
    <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OPD Date Details</DialogTitle>
          <DialogDescription className="sr-only">
            Here are the details of the OPD date you selected.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-0.5 text-sm">
          <div>
            <span className="font-medium">Date:</span>{" "}
            {showDetails?.date &&
              new Date(showDetails.date).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Start Time:</span>{" "}
            {showDetails?.start_time}
          </div>
          <div>
            <span className="font-medium">End Time:</span>{" "}
            {showDetails?.end_time}
          </div>
          <div>
            <span className="font-medium">Status:</span>{" "}
            <span className="capitalize">{showDetails?.status}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
