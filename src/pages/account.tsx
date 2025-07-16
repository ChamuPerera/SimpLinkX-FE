import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Layout, Loader } from "@/components/custom";
import { PrivateRoute } from "@/providers/private-route";
import { Suspense } from "react";

const AccountPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "mandiraperera@gmail.com",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password updated:\n" + JSON.stringify(formData, null, 2));
    // Send to backend here
  };

  return (
    <PrivateRoute>
      <Suspense fallback={<Loader />}>
        <Layout breadcrumbs={[{ title: "Home", url: "/" }, { title: "My Account" }]}>
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
              <h1 className="text-3xl font-bold text-blue-800">Account Settings</h1>
              <p className="text-gray-600 text-sm">Change your password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-9">
              {/* Email (disabled) */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full border rounded px-3 py-2 focus:outline-blue-500"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  className="w-full border rounded px-3 py-2 focus:outline-blue-500"
                />
              </div>

              {/* Submit */}
              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition font-medium"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
          <footer className="text-center text-xs text-gray-500 mt-4">
            &copy; 2025 SimpLinkX. All rights reserved. | A Government of Sri Lanka Initiative
          </footer>
        </Layout>
      </Suspense>
    </PrivateRoute>
  );
};

export default AccountPage;
