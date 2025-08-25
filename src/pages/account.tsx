import type { ChangeEvent, FormEvent } from "react";

import { Layout, Loader } from "@/components/custom";
import { Button, Input, Label } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";
import { PrivateRoute } from "@/providers/private-route";
import React, { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

export const AccountPage: React.FC = () => {
  const { user, changePassword, changeEmail } = useAuth();
  const [formData, setFormData] = useState({
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitPassword = (e: FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    changePassword
      .mutateAsync({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      })
      .then(() => {
        toast.success("Password updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update password");
      });
  };

  const handleSubmitEmail = (e: FormEvent) => {
    e.preventDefault();

    changeEmail
      .mutateAsync({ email: formData.email })
      .then(() => {
        toast.success("Email updated successfully");
      })
      .catch(() => {
        toast.error("Failed to update email");
      });
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  return (
    <PrivateRoute>
      <Suspense fallback={<Loader />}>
        <Layout
          breadcrumbs={[{ title: "Home", url: "/" }, { title: "My Account" }]}
        >
          <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 border border-blue-100">
            {/* Brand Header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo.png" alt="logo" className="h-7 w-7" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SimpLinkX
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-800">
                Account Settings
              </h1>
              <p className="text-gray-600 text-sm">
                Update your account information
              </p>
            </div>

            <form onSubmit={handleSubmitEmail} className="space-y-4 mb-5">
              {/* Email */}
              <div>
                <Label className="block text-gray-700 font-medium mb-1">
                  Email
                </Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              {/* Submit */}
              <div className="text-center flex justify-end">
                <Button size={"sm"} type="submit">
                  {changeEmail.isPending ? "Updating..." : "Update Email"}
                </Button>
              </div>
            </form>

            <form onSubmit={handleSubmitPassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <Label className="block text-gray-700 font-medium mb-1">
                  Current Password
                </Label>
                <Input
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />
              </div>

              {/* New Password */}
              <div>
                <Label className="block text-gray-700 font-medium mb-1">
                  New Password
                </Label>
                <Input
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <Label className="block text-gray-700 font-medium mb-1">
                  Confirm New Password
                </Label>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                />
              </div>

              {/* Submit */}
              <div className="text-center flex justify-end">
                <Button size={"sm"} type="submit">
                  {changePassword.isPending ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
          <footer className="text-center text-xs text-gray-500 mt-4">
            &copy; 2025 SimpLinkX. All rights reserved. | A Government of Sri
            Lanka Initiative
          </footer>
        </Layout>
      </Suspense>
    </PrivateRoute>
  );
};
