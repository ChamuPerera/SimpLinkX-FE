/* eslint-disable react-hooks/exhaustive-deps */
import type { User } from "@/services/users";
import type { FC } from "react";
import type { z } from "zod";

import { UserTable } from "@/components/custom/users/table";
import { userColumns } from "@/components/custom/users/table-columns";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { useAuth } from "@/hooks/use-auth";
import { useHospitals } from "@/hooks/use-hospitals";
import { useRoles } from "@/hooks/use-roles";
import {
  useAddUserToHospital,
  useCreateUser,
  useUpdateUser,
  useUpdateUserStatus,
  useUsers,
} from "@/hooks/use-users";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { userSchema } from "@/validations/users";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiError } from "react-icons/bi";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

const userDefaultValues: User = {
  name: "",
  email: "",
  password: "",
  role: "",
  password_confirmation: "",
};

export const Users: FC = React.memo(() => {
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [showHospitalChange, setShowHospitalChange] = useState(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
  });
  const { data } = useUsers({
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    search,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user } = useAuth();

  // clear selected user when dialog closes
  const closeDialog = () => {
    setSelectedUser(null);
    setShowStatusChange(false);
    setShowHospitalChange(false);
    setShowNewUserDialog(false);
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
      <h2 className="text-lg font-semibold">Users</h2>
      <p className="text-sm text-gray-500">Manage users</p>

      {/* user dialog */}
      <UserDialog
        open={showNewUserDialog}
        onClose={closeDialog}
        data={selectedUser}
      />

      {/* change status dialog */}
      <UserChangeStatusDialog
        open={showStatusChange}
        onClose={closeDialog}
        user={selectedUser}
      />

      {/* change hospital dialog */}
      <UserChangeHospitalDialog
        open={showHospitalChange}
        onClose={closeDialog}
        user={selectedUser}
      />

      {/* users list */}
      <div className="mt-4 flex w-full justify-center overflow-hidden">
        <UserTable
          columns={userColumns}
          user={user!}
          data={data?.users || []}
          search={search}
          setSearch={setSearch}
          setSelectedUser={setSelectedUser}
          setShowStatusChange={setShowStatusChange}
          setShowHospitalChange={setShowHospitalChange}
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
          <PermissionWrapper permissions={[permissions.createUsers]}>
            <Button
              size={"sm"}
              variant={"outline"}
              className="w-32"
              onClick={() => setShowNewUserDialog(true)}
            >
              Add New
            </Button>
          </PermissionWrapper>
        </UserTable>
      </div>

      {/* details dialog */}
      {showDetails && selectedUser && (
        <ShowDetails
          showDetails={selectedUser}
          setShowDetails={setShowDetails}
        />
      )}
    </div>
  );
});

const UserDialog: FC<{
  open: boolean;
  onClose: () => void;
  data?: User | null;
}> = React.memo(({ open, onClose, data }) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: createUser, isPending: createPending } = useCreateUser();
  const { mutateAsync: updateUser, isPending: updatePending } = useUpdateUser();
  const { data: roles, isLoading: rolesLoading } = useRoles({
    currentPage: 1,
    pageSize: 10,
  });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: userDefaultValues,
  });

  // form submit handler
  const onSubmit = async (values: z.infer<typeof userSchema>) => {
    setErrors({});
    if (data) {
      const updatedValues = { ...values, id: data.id };
      await updateUser(updatedValues)
        .then(() => {
          toast.success("User updated", {
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
      await createUser(values)
        .then(() => {
          toast.success("User created", {
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
      form.reset(userDefaultValues);
    }
  }, [data]);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        form.reset(userDefaultValues);
      }}
    >
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data ? "Edit User" : "Create User"}</DialogTitle>
          <DialogDescription>
            {data
              ? "Edit the details of the user."
              : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>
        {rolesLoading && (
          <div className="flex justify-center">
            <p className="text-sm text-gray-500">Loading roles...</p>
          </div>
        )}

        {!rolesLoading && (
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

              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage>
                      {errors["email"] && errors["email"][0]}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Role <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles?.roles?.map((role) => (
                          <SelectItem
                            key={role.id}
                            value={role.name}
                            className="capitalize"
                          >
                            {role.name.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {errors["password"] && errors["password"][0]}
                    </FormMessage>
                  </FormItem>
                )}
              />

              {/* password confirmation */}
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {errors["password_confirmation"] &&
                        errors["password_confirmation"][0]}
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
                  disabled={createPending || updatePending || rolesLoading}
                  type="submit"
                  className="mt-3 w-full max-w-40"
                >
                  {(createPending || updatePending) && (
                    <PiSpinnerGapBold className="animate-spin" />
                  )}
                  Save User
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
});

const UserChangeStatusDialog: FC<{
  open: boolean;
  onClose: () => void;
  user: User | null;
}> = React.memo(({ open, onClose, user }) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: updateUser, isPending } = useUpdateUserStatus();
  const [status, setStatus] = useState<"working" | "retired" | "banned">(
    user?.status || "working",
  );

  // form submit handler
  const onSubmit = async () => {
    setErrors({});
    if (user && user.id) {
      await updateUser({ id: user.id, status })
        .then(() => {
          toast.success("User status updated", {
            description: new Date().toLocaleString(),
          });
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

  // set form values if user is available
  useEffect(() => {
    if (user && user.id) {
      setStatus(user.status || "working");
    }
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change User Status</DialogTitle>
          <DialogDescription>
            Change the status of the selected user.
          </DialogDescription>
        </DialogHeader>

        <Select
          onValueChange={(value) =>
            setStatus(value as "working" | "retired" | "banned")
          }
          value={status}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select user status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="working">Working</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>

        {/*common error message */}
        {errors?.message && (
          <div className="flex justify-center">
            <FormMessage
              className="mt-3 flex w-full max-w-xl items-center justify-center rounded-sm bg-red-500 py-2 text-center text-white"
              role="alert"
            >
              <BiError className="h-5 w-5" /> {errors?.message}
            </FormMessage>
          </div>
        )}
        <div className="flex justify-end">
          <Button
            disabled={isPending}
            onClick={onSubmit}
            className="mt-3 w-full max-w-40"
          >
            {isPending && <PiSpinnerGapBold className="animate-spin" />}
            Save Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

const UserChangeHospitalDialog: FC<{
  open: boolean;
  onClose: () => void;
  user: User | null;
}> = React.memo(({ open, onClose, user }) => {
  const [errors, setErrors] = useState<{ [key: string]: string[] | string }>(
    {},
  );
  const { mutateAsync: updateUserHospital, isPending } = useAddUserToHospital();
  const [hospital, setHospital] = useState<number | null>(
    user?.hospital_id || null,
  );
  const [search, setSearch] = useState("");

  const { data: hospitals, isLoading: isHospitalLoading } = useHospitals({
    currentPage: 1,
    pageSize: 5,
    search: search,
  });

  // form submit handler
  const onSubmit = async () => {
    setErrors({});
    if (user && user.id && hospital) {
      await updateUserHospital({ userId: user.id, hospitalId: hospital })
        .then(() => {
          toast.success("User hospital updated", {
            description: new Date().toLocaleString(),
          });
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

  // set form values if user is available
  useEffect(() => {
    if (user && user.id && user.hospital_id) {
      setHospital(user.hospital_id || null);
    }
  }, [user]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change User Hospital</DialogTitle>
          <DialogDescription>
            Change the hospital of the selected user.
          </DialogDescription>
        </DialogHeader>

        <Combobox
          isLoading={isHospitalLoading}
          items={
            hospitals?.hospitals?.map((hospital) => ({
              label: hospital.name,
              value: hospital.id?.toString() || "",
            })) || []
          }
          onChange={setSearch}
          placeholder="Hospital"
          search={search}
          setValue={(val) => setHospital(Number(val))}
          value={hospital?.toString() || ""}
        />

        {/*common error message */}
        {errors?.message && (
          <div className="flex justify-center">
            <FormMessage
              className="mt-3 flex w-full max-w-xl items-center justify-center rounded-sm bg-red-500 py-2 text-center text-white"
              role="alert"
            >
              <BiError className="h-5 w-5" /> {errors?.message || ""}
            </FormMessage>
          </div>
        )}
        <div className="flex justify-end">
          <Button
            disabled={isPending}
            onClick={onSubmit}
            className="mt-3 w-full max-w-40"
          >
            {isPending && <PiSpinnerGapBold className="animate-spin" />}
            Save Hospital
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});

const ShowDetails: FC<{
  showDetails: User | null;
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
            <span className="font-medium">Email:</span> {showDetails?.email}
          </div>
          <div className="capitalize">
            <span className="font-medium">Role:</span>{" "}
            {showDetails?.role.replace(/_/g, " ")}
          </div>
          <div>
            <span className="font-medium">Hospital:</span>{" "}
            {showDetails?.hospital ?? "N/A"}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
