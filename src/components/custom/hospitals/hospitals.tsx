;

/* eslint-disable react-hooks/exhaustive-deps */
import type { Hospital } from "@/services/hospitals";
import type { FC } from "react";
import type { z } from "zod";



import { hospitalColumns, HospitalTable } from "@/components/custom/hospitals";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { useCreateHospital, useHospitals, useUpdateHospital } from "@/hooks/use-hospitals";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { hospitalSchema } from "@/validations/hospitals";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";





;
























const hospitalDefaultValues: Hospital = {
  name: "",
  address: "",
  phone: "",
  email: "",
  district: "",
  location_url: "",
};

export const Hospitals: FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });
  const { data } = useHospitals({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
  });
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null,
  );

  // clear selected hospital when dialog closes
  const closeDialog = () => {
    setSelectedHospital(null);
    setOpen(false);
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
      <h2 className="text-lg font-semibold">Hospitals</h2>
      <p className="text-sm text-gray-500">Manage hospitals</p>

      {/* hospital dialog */}
      <HospitalDialog
        open={open}
        onClose={closeDialog}
        data={selectedHospital}
      />

      {/* hospitals list */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <HospitalTable
          columns={hospitalColumns}
          data={data?.hospitals || []}
          search={search}
          setSearch={setSearch}
          setSelectedHospital={setSelectedHospital}
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
          <PermissionWrapper permissions={[permissions.createHospitals]}>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-32"
              onClick={() => setOpen(true)}
            >
              Add New
            </Button>
          </PermissionWrapper>
        </HospitalTable>
      </div>

      {/* details dialog */}
      {showDetails && selectedHospital && (
        <ShowDetails
          showDetails={selectedHospital}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
});

const HospitalDialog: FC<{
  open: boolean;
  onClose: () => void;
  data?: Hospital | null;
}> = React.memo(({ open, onClose, data }) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: createHospital, isPending: createPending } =
    useCreateHospital();
  const { mutateAsync: updateHospital, isPending: updatePending } =
    useUpdateHospital();

  const form = useForm<z.infer<typeof hospitalSchema>>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: hospitalDefaultValues,
  });

  // form submit handler
  const onSubmit = async (values: z.infer<typeof hospitalSchema>) => {
    // clear errors
    setErrors({});

    // if data is available
    if (data) {
      // append id to values
      const updatedValues = { ...values, id: data.id };
      await updateHospital(updatedValues)
        .then(() => {
          toast.success("Hospital updated", {
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
      await createHospital(values)
        .then(() => {
          toast.success("Hospital created", {
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
      form.reset(hospitalDefaultValues);
    }
  }, [data]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        form.reset(hospitalDefaultValues);
      }}
    >
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit Hospital" : "Create Hospital"}
          </DialogTitle>
          <DialogDescription>
            {data
              ? "Edit the details of the hospital."
              : "Fill in the details to create a new hospital."}
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
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["name"] && errors["name"][0]}
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter address" {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["phone"] && errors["phone"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["email"] && errors["email"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* district */}
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter district" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["district"] && errors["district"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* location url */}
            <FormField
              control={form.control}
              name="location_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location URL" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["location_url"] && errors["location_url"][0]}
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
                Save Hospital
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

const ShowDetails: FC<{
  showDetails: Hospital | null;
  setShowDetails: (show: boolean) => void;
}> = React.memo(({ showDetails, setShowDetails }) => {
  return (
    <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hospital Details</DialogTitle>
          <DialogDescription className="sr-only">
            Here are the details of the hospital you selected.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-0.5 text-sm">
          <div>
            <span className="font-medium">Name:</span> {showDetails?.name} (
            <a
              href={`/find-hospitals/${showDetails?.identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Visit
            </a>
            )
          </div>
          <div>
            <span className="font-medium">Location:</span>{" "}
          </div>
          <div>
            <span className="font-medium">Address:</span> {showDetails?.address}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {showDetails?.phone}
          </div>
          <div>
            <span className="font-medium">Email:</span> {showDetails?.email}
          </div>
          <div>
            <span className="font-medium">District:</span>{" "}
            {showDetails?.district}
          </div>
          <div>
            <span className="font-medium">Location:</span>{" "}
            <a
              href={showDetails?.location_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {showDetails?.location_url}
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});