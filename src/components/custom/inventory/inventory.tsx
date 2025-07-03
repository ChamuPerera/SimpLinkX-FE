/* eslint-disable react-hooks/exhaustive-deps */
import type { Inventory } from "@/services/inventory";
import type { FC } from "react";
import type { z } from "zod";

import { InventoryTable } from "@/components/custom/inventory/table";
import { inventoryColumns } from "@/components/custom/inventory/table-columns";
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
} from "@/components/ui";
import { permissions } from "@/constants/permissions";
import {
  useCreateInventory,
  useInventories,
  useUpdateInventory,
} from "@/hooks/use-inventory";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { cn } from "@/utils";
import { inventorySchema } from "@/validations/inventory";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

const inventoryDefaultValues: Inventory = {
  drug_name: "",
  brand_name: "",
  batch_number: "",
  expiry_date: new Date(),
  quantity: 0,
};

export const Inventories: FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });
  const { data } = useInventories({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
  });
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null,
  );

  // clear selected inventory when dialog closes
  const closeDialog = () => {
    setSelectedInventory(null);
    setOpen(false);
  };

  // reset current page when search is changed
  useEffect(() => {
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  }, [search]);

  return (
    <div className="flex w-full flex-col">
      <h2 className="text-lg font-semibold">Inventory</h2>
      <p className="text-sm text-gray-500">Manage inventory</p>

      {/* inventory dialog */}
      <InventoryDialog
        open={open}
        onClose={closeDialog}
        data={selectedInventory}
        setSelectedInventory={setSelectedInventory}
      />

      {/* inventory list */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <InventoryTable
          columns={inventoryColumns}
          data={data?.inventories || []}
          search={search}
          setSearch={setSearch}
          setSelectedInventory={setSelectedInventory}
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
          <PermissionWrapper permissions={[permissions.manageInventories]}>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-32"
              onClick={() => setOpen(true)}
            >
              Add New
            </Button>
          </PermissionWrapper>
        </InventoryTable>
      </div>

      {/* details dialog */}
      {showDetails && selectedInventory && (
        <ShowDetails
          showDetails={selectedInventory}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
});

const InventoryDialog: FC<{
  open: boolean;
  onClose: () => void;
  setSelectedInventory: (inventory: Inventory | null) => void;
  data?: Inventory | null;
}> = React.memo(({ open, onClose, data, setSelectedInventory }) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: createInventory, isPending: createPending } =
    useCreateInventory();
  const { mutateAsync: updateInventory, isPending: updatePending } =
    useUpdateInventory();

  const form = useForm<z.infer<typeof inventorySchema>>({
    resolver: zodResolver(inventorySchema),
    defaultValues: inventoryDefaultValues,
  });

  // form submit handler
  const onSubmit = async (values: z.infer<typeof inventorySchema>) => {
    setErrors({});
    if (data) {
      const updatedValues = { ...values, id: data.id };
      await updateInventory(updatedValues)
        .then(() => {
          toast.success("Inventory updated", {
            description: new Date().toLocaleString(),
          });
          form.reset();
          setSelectedInventory(null);
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
      await createInventory(values)
        .then(() => {
          toast.success("Inventory created", {
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
        expiry_date: data.expiry_date ? new Date(data.expiry_date) : new Date(),
      });
    } else {
      form.reset(inventoryDefaultValues);
    }
  }, [data]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        form.reset(inventoryDefaultValues);
      }}
    >
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit Inventory" : "Create Inventory"}
          </DialogTitle>
          <DialogDescription>
            {data
              ? "Edit the details of the inventory item."
              : "Fill in the details to create a new inventory item."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 overflow-y-auto p-1"
          >
            {/* drug_name */}
            <FormField
              control={form.control}
              name="drug_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drug Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter drug name" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["drug_name"] && errors["drug_name"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* brand_name */}
            <FormField
              control={form.control}
              name="brand_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand name" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["brand_name"] && errors["brand_name"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* batch_number */}
            <FormField
              control={form.control}
              name="batch_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter batch number" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["batch_number"] && errors["batch_number"][0]}
                  </FormMessage>
                </FormItem>
              )}
            />

            {/* expiry_date */}
            <FormField
              control={form.control}
              name="expiry_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date</FormLabel>
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
                        endMonth={
                          // 10 years from now
                          field.value
                            ? new Date(field.value.getFullYear() + 10, 0, 1)
                            : new Date(new Date().getFullYear() + 10, 0, 1)
                        }
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>
                    {errors["quantity"] && errors["quantity"][0]}
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
                Save Inventory
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

const ShowDetails: FC<{
  showDetails: Inventory | null;
  setShowDetails: (show: boolean) => void;
}> = React.memo(({ showDetails, setShowDetails }) => {
  return (
    <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Inventory Details</DialogTitle>
          <DialogDescription className="sr-only">
            Here are the details of the inventory item you selected.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-0.5 text-sm">
          <div>
            <span className="font-medium">Drug Name:</span>{" "}
            {showDetails?.drug_name}
          </div>
          <div>
            <span className="font-medium">Brand Name:</span>{" "}
            {showDetails?.brand_name}
          </div>
          <div>
            <span className="font-medium">Batch Number:</span>{" "}
            {showDetails?.batch_number}
          </div>
          <div>
            <span className="font-medium">Expiry Date:</span>{" "}
            {showDetails?.expiry_date
              ? format(showDetails.expiry_date, "yyyy-MM-dd")
              : "N/A"}
          </div>
          <div>
            <span className="font-medium">Quantity:</span>{" "}
            {showDetails?.quantity}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
