import React, { useState } from "react";

const AccountPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "077-1234567",
    gender: "Male",
    nic: "991234567V",
    dob: "2000-01-01",
    address: "123, Main Street, Colombo",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated:\n" + JSON.stringify(formData, null, 2));
    // send to API here
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8 space-y-8 border border-blue-100"
      >
        {/* Title */}
        {/* Brand: Logo + Name on the same line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src="/logo.png" alt="logo" className="h-7 w-7" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SimpLinkX
            </span>
          </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-800">My Account</h1>
          <p className="text-gray-600 text-sm">Update your personal information</p>
        </div>

        {/* Fields */}
        <div className="grid gap-4">
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
        </div>

        {/* Submit */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition font-medium"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountPage;
