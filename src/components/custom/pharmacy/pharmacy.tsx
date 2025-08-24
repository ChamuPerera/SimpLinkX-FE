/* eslint-disable react-hooks/exhaustive-deps */
import type { Pharmacy } from "@/services/pharmacy";
import type { FC } from "react";
import type { z } from "zod";

import { pharmacyColumns, PharmacyTable } from "@/components/custom/pharmacy";
import {
  Button,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { districts } from "@/constants/districts";
import { permissions } from "@/constants/permissions";
import {
  useCreatePharmacy,
  usePharmacies,
  useUpdatePharmacy,
} from "@/hooks/use-pharmacy";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { pharmacySchema } from "@/validations/pharmacy";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

const pharmacyDefaultValues: Pharmacy = {
  name: "",
  address: "",
  phone: "",
  email: "",
  district: "",
  location_url: "",
};

export const Pharmacies: FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });
  const { data } = usePharmacies({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
    district,
  });
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null,
  );

  // clear selected pharmacy when dialog closes
  const closeDialog = () => {
    setSelectedPharmacy(null);
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
      <h2 className="text-lg font-semibold">Rajya Osusala outlets</h2>
      <p className="text-sm text-gray-500">Manage Rajya Osusala outlets</p>

      {/* pharmacy dialog */}
      <PharmacyDialog
        open={open}
        onClose={closeDialog}
        data={selectedPharmacy}
      />

      {/* pharmacies list */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <PharmacyTable
          columns={pharmacyColumns}
          data={data?.pharmacies || []}
          search={search}
          district={district}
          setDistrict={setDistrict}
          setSearch={setSearch}
          setSelectedPharmacy={setSelectedPharmacy}
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
        </PharmacyTable>
      </div>

      {/* details dialog */}
      {showDetails && selectedPharmacy && (
        <ShowDetails
          showDetails={selectedPharmacy}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
});

const PharmacyDialog: FC<{
  open: boolean;
  onClose: () => void;
  data?: Pharmacy | null;
}> = React.memo(({ open, onClose, data }) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: createPharmacy, isPending: createPending } =
    useCreatePharmacy();
  const { mutateAsync: updatePharmacy, isPending: updatePending } =
    useUpdatePharmacy();

  const form = useForm<z.infer<typeof pharmacySchema>>({
    resolver: zodResolver(pharmacySchema),
    defaultValues: pharmacyDefaultValues,
  });

  // form submit handler
  const onSubmit = async (values: z.infer<typeof pharmacySchema>) => {
    // clear errors
    setErrors({});

    // if data is available
    if (data) {
      // append id to values
      const updatedValues = { ...values, id: data.id };
      await updatePharmacy(updatedValues)
        .then(() => {
          toast.success("Pharmacy updated", {
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
      await createPharmacy(values)
        .then(() => {
          toast.success("Pharmacy created", {
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
      form.reset(pharmacyDefaultValues);
    }
  }, [data]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        form.reset(pharmacyDefaultValues);
      }}
    >
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit Rajya Osusala Outlet" : "Create Rajya Osusala Outlet"}
          </DialogTitle>
          <DialogDescription>
            {data
              ? "Edit the details of the Rajya Osusala Outlet."
              : "Fill in the details to create a new Rajya Osusala Outlet."}
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value === "" ? undefined : field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your district" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {districts.map((district) => (
                        <SelectItem
                          key={district}
                          value={district}
                          className="capitalize"
                        >
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                Save Osusala Outlet
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

const ShowDetails: FC<{
  showDetails: Pharmacy | null;
  setShowDetails: (show: boolean) => void;
}> = React.memo(({ showDetails, setShowDetails }) => {
  return (
    <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pharmacy Details</DialogTitle>
          <DialogDescription className="sr-only">
            Here are the details of the pharmacy you selected.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-0.5 text-sm">
          <div>
            <span className="font-medium">Name:</span> {showDetails?.name}
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
