import type { Role } from "@/services/roles";
import type { FC } from "react";
import type { z } from "zod";

import { RoleTable } from "@/components/custom/roles/table";
import { roleColumns } from "@/components/custom/roles/table-columns";
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
} from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { useCreateRole, useRoles, useUpdateRole } from "@/hooks/use-roles";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { roleSchema } from "@/validations/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

const roleDefaultValues: Role = {
  name: "",
};

export const Roles: FC = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });
  const { data } = useRoles({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
  });
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // clear selected role when dialog closes
  const closeDialog = () => {
    setSelectedRole(null);
    setOpen(false);
  };

  return (
    <div className="flex w-full flex-col">
      <h2 className="text-lg font-semibold">Roles</h2>
      <p className="text-sm text-gray-500">Manage system roles</p>

      {/* role dialog */}
      <RoleDialog open={open} onClose={closeDialog} data={selectedRole} />

      {/* roles list */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <RoleTable
          columns={roleColumns}
          data={data?.roles || []}
          search={search}
          setSearch={setSearch}
          setSelectedRole={setSelectedRole}
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
          <PermissionWrapper permissions={[permissions.createRoles]}>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-32"
              onClick={() => setOpen(true)}
            >
              Add New
            </Button>
          </PermissionWrapper>
        </RoleTable>
      </div>

      {/* details dialog */}
      {showDetails && selectedRole && (
        <ShowDetails
          showDetails={selectedRole}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
});

const RoleDialog: FC<{
  open: boolean;
  onClose: () => void;
  data?: Role | null;
}> = React.memo(({ open, onClose, data }) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: createRole, isPending: createPending } = useCreateRole();
  const { mutateAsync: updateRole, isPending: updatePending } = useUpdateRole();

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: roleDefaultValues,
  });

  // form submit handler
  const onSubmit = async (values: z.infer<typeof roleSchema>) => {
    setErrors({});
    if (data) {
      const updatedValues = { ...values, id: data.id };
      await updateRole(updatedValues)
        .then(() => {
          toast.success("Role updated", {
            description: new Date().toLocaleString(),
          });
          form.reset(roleDefaultValues);
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
      await createRole(values)
        .then(() => {
          toast.success("Role created", {
            description: new Date().toLocaleString(),
          });
          form.reset(roleDefaultValues);
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
      form.reset(roleDefaultValues);
    }
  }, [data, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        form.reset(roleDefaultValues);
      }}
    >
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {data
              ? "Edit the details of the role."
              : "Fill in the details to create a new role."}
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
                    <Input placeholder="Enter role name" {...field} />
                  </FormControl>
                  <FormMessage>
                    {errors["name"] && errors["name"][0]}
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
                Save Role
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

const ShowDetails: FC<{
  showDetails: Role | null;
  setShowDetails: (show: boolean) => void;
}> = React.memo(({ showDetails, setShowDetails }) => {
  return (
    <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Role Details</DialogTitle>
          <DialogDescription className="sr-only">
            Here are the details of the role you selected.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-0.5 text-sm">
          <div>
            <span className="font-medium">ID:</span> {showDetails?.id}
          </div>
          <div>
            <span className="font-medium">Name:</span> {showDetails?.name}
          </div>
          <div>
            <span className="font-medium">Created at:</span>{" "}
            {moment
              .utc(showDetails?.created_at)
              .local()
              .format("YYYY-MM-DD HH:mm:ss")}
          </div>
          <div>
            <span className="font-medium">Updated at:</span>{" "}
            {moment
              .utc(showDetails?.updated_at)
              .local()
              .format("YYYY-MM-DD HH:mm:ss")}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
