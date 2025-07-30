import type { Clinic } from "@/services/clinics";
import type { FC } from "react";
import type { z } from "zod";

import { ClinicTable } from "@/components/custom/clinics/table";
import { clinicColumns } from "@/components/custom/clinics/table-columns";
import {
  Button,
  Combobox,
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
  Textarea,
} from "@/components/ui";
import { permissions } from "@/constants/permissions";
import {
  useClinics,
  useCreateClinic,
  useUpdateClinic,
} from "@/hooks/use-clinics";
import { useUsers } from "@/hooks/use-users";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { clinicSchema } from "@/validations/clinics";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

const clinicDefaultValues: Clinic = {
  name: "",
  description: "",
  doctor_id: 0,
  location: "",
  total_hourly_tokens: 10,
  self_hourly_tokens: 5,
};

export const Clinics: FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });
  const { data } = useClinics({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
  });
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  // clear selected clinic when dialog closes
  const closeDialog = () => {
    setSelectedClinic(null);
    setOpen(false);
  };

  // reset current page when search is changed
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  }, [search]);

  return (
    <div className="flex w-full flex-col">
      <h2 className="text-lg font-semibold">Clinics</h2>
      <p className="text-sm text-gray-500">Manage clinics</p>

      {/* clinic dialog */}
      <ClinicDialog open={open} onClose={closeDialog} data={selectedClinic} />

      {/* clinics list */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <ClinicTable
          columns={clinicColumns}
          data={data?.clinics || []}
          search={search}
          setSearch={setSearch}
          setSelectedClinic={setSelectedClinic}
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
        </ClinicTable>
      </div>

      {/* details dialog */}
      {showDetails && selectedClinic && (
        <ShowDetails
          showDetails={selectedClinic}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
});

const ClinicDialog: FC<{
  open: boolean;
  onClose: () => void;
  data?: Clinic | null;
}> = React.memo(({ open, onClose, data }) => {
  const [doctorSearch, setDoctorSearch] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: createClinic, isPending: createPending } =
    useCreateClinic();
  const { mutateAsync: updateClinic, isPending: updatePending } =
    useUpdateClinic();

  // Fetch doctors for dropdowns
  const { data: usersData, isLoading: isDoctorsLoading } = useUsers({
    currentPage: 1,
    pageSize: 100,
    role: "doctor",
    search: doctorSearch,
  });

  const form = useForm<z.infer<typeof clinicSchema>>({
    resolver: zodResolver(clinicSchema),
    defaultValues: clinicDefaultValues,
  });

  // form submit handler
  const onSubmit = async (values: z.infer<typeof clinicSchema>) => {
    setErrors({});
    if (data) {
      const updatedValues = { ...values, id: data.id };
      await updateClinic(updatedValues)
        .then(() => {
          toast.success("Clinic updated", {
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
      await createClinic(values)
        .then(() => {
          toast.success("Clinic created", {
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
      form.reset(data);
    } else {
      form.reset(clinicDefaultValues);
    }
  }, [data, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        form.reset(clinicDefaultValues);
      }}
    >
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data ? "Edit Clinic" : "Create Clinic"}</DialogTitle>
          <DialogDescription>
            {data
              ? "Edit the details of the clinic."
              : "Fill in the details to create a new clinic."}
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter clinic name" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["name"] && errors["name"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter clinic description"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {errors["description"] && errors["description"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* doctor_id */}
            <Combobox
              isLoading={isDoctorsLoading}
              items={
                usersData?.users
                  .filter((user) => user.role === "doctor")
                  ?.map((doctor) => ({
                    label: doctor.name,
                    value: doctor.id?.toString() || "",
                  })) || []
              }
              onChange={setDoctorSearch}
              placeholder="Doctor"
              search={doctorSearch}
              setValue={(value) => form.setValue("doctor_id", Number(value))}
              value={
                form.watch("doctor_id") === 0
                  ? ""
                  : form.watch("doctor_id").toString()
              }
            />

            {/* location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinic building</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter clinic location" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["location"] && errors["location"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* total_hourly_tokens */}
            <FormField
              control={form.control}
              name="total_hourly_tokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Hourly Tokens</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter total hourly tokens"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {errors["total_hourly_tokens"] &&
                      errors["total_hourly_tokens"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* self_hourly_tokens */}
            <FormField
              control={form.control}
              name="self_hourly_tokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Self Hourly Tokens</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter self hourly tokens"
                      max={form.watch("total_hourly_tokens")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {errors["self_hourly_tokens"] &&
                      errors["self_hourly_tokens"][0]}
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
                Save Clinic
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

const ShowDetails: FC<{
  showDetails: Clinic | null;
  setShowDetails: (show: boolean) => void;
}> = React.memo(({ showDetails, setShowDetails }) => {
  return (
    <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clinic Details</DialogTitle>
          <DialogDescription className="sr-only">
            Here are the details of the clinic you selected.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-0.5 text-sm">
          <div>
            <span className="font-medium">Name:</span> {showDetails?.name}
          </div>
          <div>
            <span className="font-medium">Description:</span>{" "}
            {showDetails?.description}
          </div>
          <div>
            <span className="font-medium">Location:</span>{" "}
            {showDetails?.location}
          </div>
          <div>
            <span className="font-medium">Total Hourly Tokens:</span>{" "}
            {showDetails?.total_hourly_tokens}
          </div>
          <div>
            <span className="font-medium">Self Hourly Tokens:</span>{" "}
            {showDetails?.self_hourly_tokens}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
