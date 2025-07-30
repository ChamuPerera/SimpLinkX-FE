/* eslint-disable react-hooks/exhaustive-deps */
import type { Patient } from "@/services/patients";
import type { FC } from "react";
import type { z } from "zod";

import { PatientTable } from "@/components/custom/patients/table";
import { patientColumns } from "@/components/custom/patients/table-columns";
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
import {
  useCreatePatient,
  usePatients,
  useUpdatePatient,
} from "@/hooks/use-patients";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { cn } from "@/utils";
import { patientsSchema } from "@/validations/patients";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

const patientDefaultValues: Patient = {
  name: "",
  address: "",
  date_of_birth: new Date(),
  gender: "male",
  nic: "",
  phone: "",
};

export const Patients: FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });
  const { data } = usePatients({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // clear selected patient when dialog closes
  const closeDialog = () => {
    setSelectedPatient(null);
    setOpen(false);
    setShowDetails(false);
  };

  // reset current page when search is change
  useEffect(() => {
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  }, [search]);

  return (
    <div className="flex w-full flex-col">
      <h2 className="text-lg font-semibold">Patients</h2>
      <p className="text-sm text-gray-500">Manage patients</p>

      {/* patient dialog */}
      <PatientDialog open={open} onClose={closeDialog} data={selectedPatient} />

      {/* users list */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <PatientTable
          columns={patientColumns}
          data={data?.patients || []}
          search={search}
          setSearch={setSearch}
          setOpen={setOpen}
          setSelectedPatient={setSelectedPatient}
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
          <PermissionWrapper permissions={[permissions.managePatients]}>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-32"
              onClick={() => setOpen(true)}
            >
              Add New
            </Button>
          </PermissionWrapper>
        </PatientTable>
      </div>

      {/* details dialog */}
      {showDetails && selectedPatient && (
        <ShowDetails
          showDetails={selectedPatient}
          setShowDetails={closeDialog}
        />
      )}
    </div>
  );
});

const PatientDialog: FC<{
  open: boolean;
  onClose: () => void;
  data?: Patient | null;
}> = React.memo(({ open, onClose, data }) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: createPatient, isPending: createPending } =
    useCreatePatient();
  const { mutateAsync: updatePatient, isPending: updatePending } =
    useUpdatePatient();

  const form = useForm<z.infer<typeof patientsSchema>>({
    resolver: zodResolver(patientsSchema),
    defaultValues: patientDefaultValues,
  });

  // form submit handler
  const onSubmit = async (values: z.infer<typeof patientsSchema>) => {
    setErrors({});
    if (data) {
      const updatedValues = { ...values, id: data.id };
      await updatePatient(updatedValues)
        .then(() => {
          toast.success("Patient updated", {
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
      await createPatient(values)
        .then(() => {
          toast.success("Patient created", {
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
      form.reset({ ...data, date_of_birth: new Date(data.date_of_birth) });
    } else {
      form.reset(patientDefaultValues);
    }
  }, [data]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        form.reset(patientDefaultValues);
      }}
    >
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data ? "Edit Patient" : "Create Patient"}</DialogTitle>
          <DialogDescription>
            {data
              ? "Edit the details of the patient."
              : "Fill in the details to create a new patient."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 overflow-y-auto p-1"
          >
            {/* name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["name"] && errors["name"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* NIC */}
            <FormField
              control={form.control}
              name="nic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    NIC <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter NIC" {...field} />
                  </FormControl>
                  <FormMessage>{errors["nic"] && errors["nic"][0]}</FormMessage>
                </FormItem>
              )}
            />

            {/* gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Gender <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* date of birth */}
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Date of Birth <span className="text-red-500">*</span>
                  </FormLabel>
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage>
                    {errors["date_of_birth"] && errors["date_of_birth"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Address<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["address"] && errors["address"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {errors["phone"] && errors["phone"][0]}
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
                Save Patient
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

const ShowDetails: FC<{
  showDetails: Patient | null;
  setShowDetails: (show: boolean) => void;
}> = React.memo(({ showDetails, setShowDetails }) => {
  return (
    <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription className="sr-only">
            Here are the details of the user you selected.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-0.5 text-sm">
          <div>
            <span className="font-medium">Name:</span> {showDetails?.name}
          </div>
          <div>
            <span className="font-medium">Gender:</span> {showDetails?.gender}
          </div>
          <div className="capitalize">
            <span className="font-medium">NIC:</span>{" "}
            {showDetails?.nic ?? "N/A"}
          </div>
          <div>
            <span className="font-medium">Date of Birth:</span>{" "}
            {showDetails?.date_of_birth
              ? format(new Date(showDetails.date_of_birth), "PPP")
              : "N/A"}
          </div>
          <div>
            <span className="font-medium">Phone:</span>{" "}
            {showDetails?.phone ?? "N/A"}
          </div>
          <div>
            <span className="font-medium">Address:</span>{" "}
            {showDetails?.address ?? "N/A"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
