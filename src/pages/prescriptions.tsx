import React, { Suspense } from "react";
import { CalendarDays, ClipboardList, Stethoscope, Building2 } from "lucide-react";
import { Layout, Loader } from "@/components/custom";
import { PrivateRoute } from "@/providers/private-route";

const mockPrescription = {
  doctor: "Dr. Nimal Perera",
  hospital: "National Hospital, Colombo",
  date: "2025-06-17",
  medicines: [
    { name: "Paracetamol 500mg", dosage: "1 tablet, 3 times a day after meals" },
    { name: "Amoxicillin 250mg", dosage: "1 capsule, 2 times a day before meals" },
    { name: "Vitamin C", dosage: "1 tablet, once a day" },
  ],
};

const breadcrumbs = [
  { title: "Home", url: "/" },
  { title: "Prescriptions" },
];

const PrescriptionsPage: React.FC = () => {
  return (
    <PrivateRoute>
      <Suspense fallback={<Loader />}>
        <Layout breadcrumbs={breadcrumbs}>
          <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-blue-100">
            {/* Title */}
            <div className="mb-6 border-b pb-4 flex items-center gap-3">
              <ClipboardList className="text-blue-600" size={28} />
              <h1 className="text-2xl font-bold text-blue-800">Your Latest Prescription</h1>
            </div>

            {/* Info Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Stethoscope className="text-blue-500" size={18} />
                <span><strong>Doctor:</strong> {mockPrescription.doctor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="text-blue-500" size={18} />
                <span><strong>Hospital:</strong> {mockPrescription.hospital}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="text-blue-500" size={18} />
                <span><strong>Date:</strong> {mockPrescription.date}</span>
              </div>
            </div>

            {/* Medicine List */}
            <div className="space-y-4">
              {mockPrescription.medicines.map((med, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-blue-50"
                >
                  <h3 className="text-blue-800 font-semibold">{med.name}</h3>
                  <p className="text-gray-700 text-sm mt-1">{med.dosage}</p>
                </div>
              ))}
            </div>
          </div>
        </Layout>
      </Suspense>
    </PrivateRoute>
  );
};

export default PrescriptionsPage;
