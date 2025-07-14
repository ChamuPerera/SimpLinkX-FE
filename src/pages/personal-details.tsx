import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Layout, Loader } from "@/components/custom";
import { PrivateRoute } from "@/providers/private-route";
import { Suspense } from "react";

const UpdatePersonalDetailsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "Mandira Perera",
    email: "mandiraperera@gmail.com",
    nic: "200170903050",
    phone: "077-1234567",
    gender: "Female",
    dob: "2001-09-25",
    address: "123, Main Street, Wattala",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Details updated:\n" + JSON.stringify(formData, null, 2));
    // Send updated data to backend here
  };

  return (
    <PrivateRoute>
      <Suspense fallback={<Loader />}>
        <Layout breadcrumbs={[{ title: "Home", url: "/" }, { title: "Personal Details" }]}>
          <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-md p-8 border border-blue-100">
            {/* Brand Header */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src="/logo.png" alt="logo" className="h-7 w-7" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                SimpLinkX
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-800">Personal Details</h1>
              <p className="text-gray-600 text-sm">Update your personal information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-blue-500"
                />
              </div>

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

              {/* NIC (disabled) */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">NIC</label>
                <input
                  name="nic"
                  type="text"
                  value={formData.nic}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone</label>
                <input
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
                <input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-blue-500"
                />
              </div>

              {/* Submit */}
              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition font-medium"
                >
                  Update Details
                </button>
              </div>
            </form>
          </div>
        </Layout>
      </Suspense>
    </PrivateRoute>
  );
};

export default UpdatePersonalDetailsPage;
