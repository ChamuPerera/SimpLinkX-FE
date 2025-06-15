import type { Permission, RolePermission } from "@/services/permissions";
import type { FC } from "react";
import type { z } from "zod";

import {
  permissionColumns,
  PermissionTable,
} from "@/components/custom/permissions";
import {
  Button,
  Checkbox,
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
  useCreatePermission,
  useCreateRolePermissions,
  usePermissions,
  useRolePermissions,
  useUpdatePermission,
} from "@/hooks/use-permissions";
import { useRoles } from "@/hooks/use-roles";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { permissionSchema } from "@/validations/permissions";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

const permissionDefaultValues: Permission = {
  name: "",
  description: "",
};

export const Permissions: FC = React.memo(() => {
  const [open, setOpen] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showManagePermissions, setShowManagePermissions] =
    useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });
  const { data } = usePermissions({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
  });
  const { data: rolePermissions } = useRolePermissions();
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

  // clear selected permission when dialog closes
  const closeDialog = () => {
    setSelectedPermission(null);
    setOpen(false);
  };

  return (
    <div className="flex w-full flex-col">
      <h2 className="text-lg font-semibold">Permissions</h2>
      <p className="text-sm text-gray-500">Manage system permissions</p>

      {/* permission dialog */}
      <PermissionDialog
        open={open}
        onClose={closeDialog}
        data={selectedPermission}
      />

      {/* manage permissions */}
      <ManagePermissions
        open={showManagePermissions}
        setOpen={setShowManagePermissions}
        rolesPermissions={
          rolePermissions?.find(
            (permission) => permission.id === selectedPermission?.id,
          ) || {
            name: selectedPermission?.name || "",
            id: selectedPermission?.id,
            roles: [],
          }
        }
      />

      {/* permissions list */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <PermissionTable
          columns={permissionColumns}
          data={data?.permissions || []}
          setSelectedPermission={setSelectedPermission}
          setOpen={setOpen}
          search={search}
          setSearch={setSearch}
          setShowDetails={setShowDetails}
          setShowManagePermissions={setShowManagePermissions}
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
          <PermissionWrapper permissions={[permissions.createPermissions]}>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-32"
              onClick={() => setOpen(true)}
            >
              Add New
            </Button>
          </PermissionWrapper>
        </PermissionTable>
      </div>

      {/* details dialog */}
      {showDetails && selectedPermission && (
        <ShowDetails
          showDetails={selectedPermission}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
});

const PermissionDialog: FC<{
  open: boolean;
  onClose: () => void;
  data?: Permission | null;
}> = React.memo(({ open, onClose, data }) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: createPermission, isPending: createPending } =
    useCreatePermission();
  const { mutateAsync: updatePermission, isPending: updatePending } =
    useUpdatePermission();

  const form = useForm<z.infer<typeof permissionSchema>>({
    resolver: zodResolver(permissionSchema),
    defaultValues: permissionDefaultValues,
  });

  // form submit handler
  const onSubmit = async (values: z.infer<typeof permissionSchema>) => {
    setErrors({});
    if (data) {
      await updatePermission({
        name: values.name,
        description: values.description,
        id: data.id,
      })
        .then(() => {
          toast.success("Permission updated", {
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
      await createPermission({
        name: values.name,
        description: values.description,
      })
        .then(() => {
          toast.success("Permission created", {
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
      form.reset(permissionDefaultValues);
    }
  }, [data, form]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        form.reset(permissionDefaultValues);
      }}
    >
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit Permission" : "Create Permission"}
          </DialogTitle>
          <DialogDescription>
            {data
              ? "Edit the details of the permission."
              : "Fill in the details to create a new permission."}
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
                    <Input
                      placeholder="e.g. view_users, create_hospitals"
                      {...field}
                    />
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
                      placeholder="Describe what this permission allows users to do..."
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
                Save Permission
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

const ShowDetails: FC<{
  showDetails: Permission | null;
  setShowDetails: (show: boolean) => void;
}> = React.memo(({ showDetails, setShowDetails }) => {
  return (
    <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permission Details</DialogTitle>
          <DialogDescription className="sr-only">
            Here are the details of the permission you selected.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-0.5 text-sm">
          <div>
            <span className="font-medium">ID:</span> {showDetails?.id}
          </div>
          <div>
            <span className="font-medium">Name:</span>
            <span className="font-mono ml-1">{showDetails?.name}</span>
          </div>
          <div>
            <span className="font-medium">Description:</span>{" "}
            {showDetails?.description}
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

const ManagePermissions: FC<{
  open: boolean;
  rolesPermissions: RolePermission;
  setOpen: (open: boolean) => void;
}> = React.memo(({ open, setOpen, rolesPermissions }) => {
  const { data } = useRoles({
    currentPage: 1,
    pageSize: 100,
  });
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  const { mutateAsync: updateRolesPermissions, isPending } =
    useCreateRolePermissions();

  // set current selected roles when dialog opens
  useEffect(() => {
    if (rolesPermissions) {
      setSelectedRoles(rolesPermissions?.roles?.map((role) => role.id!) || []);
    } else {
      setSelectedRoles([]);
    }
  }, [rolesPermissions]);

  const handleSubmit = async () => {
    if (rolesPermissions.id) {
      await updateRolesPermissions({
        roleId: rolesPermissions.id,
        permissionIds: selectedRoles,
      })
        .then(() => {
          toast.success("Roles updated successfully", {
            description: new Date().toLocaleString(),
          });
          setOpen(false);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Something went wrong");
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permission Details</DialogTitle>
          <DialogDescription className="sr-only">
            Here are the details of the permission you selected.
          </DialogDescription>
        </DialogHeader>

        {/* permission name */}
        <div className="mb-2">
          <span className="font-medium">Name:</span>{" "}
          <span className="font-mono ml-1">{rolesPermissions.name}</span>
        </div>

        <div className="space-y-0.5 text-sm grid grid-cols-2 gap-4 md:grid-cols-3">
          {data?.roles.map((role) => (
            <div key={role.id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedRoles.includes(role.id!)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedRoles((prev) => [...prev, role.id!]);
                  } else {
                    setSelectedRoles((prev) =>
                      prev.filter((id) => id !== role.id!),
                    );
                  }
                }}
              />
              <span className="font-medium">{role.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            size={"sm"}
            disabled={isPending}
            onClick={handleSubmit}
            className="w-40"
          >
            {isPending && <PiSpinnerGapBold className="animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
