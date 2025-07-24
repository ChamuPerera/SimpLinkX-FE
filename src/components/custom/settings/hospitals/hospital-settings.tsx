import type z from "zod";

import { Loader } from "@/components/custom/loader";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
} from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { useHospitalById, useManageHospital } from "@/hooks/use-hospitals";
import { hospitalSchema } from "@/validations/hospitals";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

export const HospitalSettings = () => {
  const { user } = useAuth();
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: manageHospital, isPending: managePending } =
    useManageHospital();
  const { data: hospital, isLoading: isLoadingHospital } = useHospitalById(
    user?.hospital_id || 0,
  );

  const form = useForm<z.infer<typeof hospitalSchema>>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      district: "",
      location_url: "",
      is_appointment_activated: false,
      is_inventory_activated: false,
    },
  });

  // form submit handler
  const onSubmit = async (values: z.infer<typeof hospitalSchema>) => {
    // clear errors
    setErrors({});

    // if data is available
    await manageHospital(values)
      .then(() => {
        toast.success("Hospital updated", {
          description: new Date().toLocaleString(),
        });
      })
      .catch((error) => {
        setErrors(
          error?.response?.data?.errors || {
            message: error?.response?.data?.message || "Something went wrong",
          },
        );
      });
  };

  // set form values if data is available
  useEffect(() => {
    if (hospital) {
      form.reset(hospital);
    }
  }, [hospital, form]);

  if (isLoadingHospital) return <Loader />;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl">
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

            {/* is_inventory_activated */}
            <FormField
              control={form.control}
              name="is_inventory_activated"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Public Inventory Service</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      {field.value ? (
                        <span className="text-sm text-blue-600">Active</span>
                      ) : (
                        <span className="text-sm text-gray-500">Inactive</span>
                      )}
                    </div>
                  </div>
                  <FormMessage>
                    {errors["is_inventory_activated"] &&
                      errors["is_inventory_activated"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* is_appointment_activated */}
            <FormField
              control={form.control}
              name="is_appointment_activated"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Appointment Service</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      {field.value ? (
                        <span className="text-sm text-blue-600">Active</span>
                      ) : (
                        <span className="text-sm text-gray-500">Inactive</span>
                      )}
                    </div>
                  </div>
                  <FormMessage>
                    {errors["is_appointment_activated"] &&
                      errors["is_appointment_activated"][0]}
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
                disabled={managePending}
                type="submit"
                className="mt-3 w-full max-w-40"
              >
                {managePending && <PiSpinnerGapBold className="animate-spin" />}
                Save Hospital
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
