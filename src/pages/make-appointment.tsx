import type {
  ClinicTokenSchema,
  OpdTokenSchema,
} from "@/validations/appointments";

import { Footer, Loader } from "@/components/custom";
import { Header } from "@/components/custom/header";
import {
  ClinicCard,
  FAQSection,
  HealthTips,
} from "@/components/custom/make-appointment";
import {
  useCreateClinicToken,
  useCreateOpdToken,
} from "@/hooks/use-appointments";
import { useAuth } from "@/hooks/use-auth";
import { useHospitalByIdentifier } from "@/hooks/use-hospitals";
import { HospitalIcon } from "lucide-react";
import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export const MakeAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  // get identifier from url /:identifier
  const { identifier } = useParams();
  const [activeTab, setActiveTab] = useState<"opd" | "clinic">("opd");

  const navigate = useNavigate();

  const { data: hospital, isLoading: isLoadingHospital } =
    useHospitalByIdentifier(identifier as string);

  // Mutations
  const { mutateAsync: createToken } = useCreateClinicToken();
  const { mutateAsync: createTokenOPD } = useCreateOpdToken();

  // Function to handle booking clinic appointments
  const handleBookClinic = async (data: ClinicTokenSchema) => {
    if (!user) {
      toast.error("You must be logged in to book an appointment.");
      navigate(`/login?redirect=/find-hospitals/${identifier}/token`);
      return;
    } else if (!user.role || user.role !== "patient") {
      toast.error("You must be a patient to book an appointment.");
      navigate(`/login?redirect=/find-hospitals/${identifier}/token`);
      return;
    }

    const alert = toast.loading("Creating clinic appointment...");
    await createToken(data)
      .then(() => {
        toast.success("Clinic appointment created successfully", {
          description: new Date().toLocaleString(),
          id: alert,
        });
      })
      .catch(() => {
        toast.error("Failed to create clinic appointment", {
          description: new Date().toLocaleString(),
          id: alert,
        });
      });
  };

  // Function to handle booking OPD appointments
  const handleBookOPD = async (data: OpdTokenSchema) => {
    if (!user) {
      toast.error("You must be logged in to book an appointment.");
      navigate(`/login?redirect=/find-hospitals/${identifier}/token`);
      return;
    } else if (!user.role || user.role !== "patient") {
      toast.error("You must be a patient to book an appointment.");
      navigate(`/login?redirect=/find-hospitals/${identifier}/token`);
      return;
    }

    const alert = toast.loading("Creating OPD appointment...");
    await createTokenOPD(data)
      .then(() => {
        toast.success("OPD appointment created successfully", {
          description: new Date().toLocaleString(),
          id: alert,
        });
      })
      .catch(() => {
        toast.error("Failed to create OPD appointment", {
          description: new Date().toLocaleString(),
          id: alert,
        });
      });
  };

  if (isLoadingHospital) return <Loader />;

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Hospital not found.</p>
      </div>
    );
  }

  // Check if appointment booking is activated for the hospital
  if (!hospital?.is_appointment_activated) {
    return <Navigate to={`/find-hospitals/${identifier}`} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <HospitalIcon className="w-14 h-14 text-white bg-white/20 px-3 rounded-full" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {hospital?.name}{" "}
            </h1>
            <p className="text-base text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Professional healthcare appointment booking with token-based
              system for efficient patient management.
            </p>

            <p className="text-lg text-gray-100">
              {hospital?.address} -{" "}
              <span className="capitalize">{hospital?.district}</span> District
            </p>
            <div className="flex gap-4 flex-col sm:flex-row justify-center items-center">
              <p className="text-sm text-gray-50">
                Contact:{" "}
                <a
                  href={`tel:${hospital?.phone}`}
                  className="text-blue-50 hover:underline"
                >
                  {hospital?.phone ?? "N/A"}
                </a>
              </p>
              <span className="hidden sm:inline">|</span>
              <p className="text-sm text-gray-50">
                Email:{" "}
                <a
                  href={`mailto:${hospital?.email}`}
                  className="text-blue-50 hover:underline"
                >
                  {hospital?.email ?? "N/A"}
                </a>
              </p>{" "}
              <span className="hidden sm:inline">|</span>
              <p className="text-sm text-gray-50">
                Location:{" "}
                <a
                  href={hospital?.location_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-50 hover:underline"
                >
                  {hospital?.location_url
                    ? "View on Map"
                    : "Location not available"}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("opd")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === "opd"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="text-2xl mr-3 hidden sm:block">🏥</span>
                <div>
                  <div className="text-lg">OPD Appointments</div>
                  <div className="text-sm font-normal">
                    Outpatient Department Services
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("clinic")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                activeTab === "clinic"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center">
                <span className="text-2xl mr-3 hidden sm:block">🩺</span>
                <div>
                  <div className="text-lg">Clinic Appointments</div>
                  <div className="text-sm font-normal">
                    Specialized Department Services
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {activeTab === "opd" ? "OPD Services" : "Specialist Clinics"}
            </h2>
            <p className="text-gray-600">
              {activeTab === "opd"
                ? "General outpatient services with token-based appointments"
                : "Specialized medical departments with expert healthcare professionals"}
            </p>
          </div>

          {activeTab === "clinic" && (
            <div>
              {hospital.clinics?.map((clinic, index) => {
                return (
                  <div className="" key={index}>
                    {/* clinic name */}
                    <h2 className="font-medium mb-2 text-lg">
                      Clinic : {clinic.name} -{" "}
                      <span
                        className={`text-xs font-medium ${clinic.access_granted ? "text-green-500" : "text-red-500"}`}
                      >
                        {clinic.access_granted ? "Enrolled" : "Not enrolled"}
                      </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {Object.keys(clinic.dates).map((date) => (
                        <ClinicCard
                          key={clinic.dates[date].date_id}
                          date={{
                            date: date,
                            location: clinic.location,
                            slots: clinic.dates[date].slots,
                            date_id: clinic.dates[date].date_id,
                          }}
                          handleBook={(data) =>
                            handleBookClinic({
                              start_time: data.startTime,
                              end_time: data.endTime,
                              clinic_date_id: data.dateId,
                              patient_id: user?.patient_id || 0,
                            })
                          }
                          accessGranted={clinic.access_granted}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "opd" && hospital.opd && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.keys(hospital.opd)?.map((opd, index) => {
                return (
                  <ClinicCard
                    key={hospital.opd?.[opd].date_id || index}
                    service="OPD"
                    date={{
                      date: opd,
                      location: "OPD",
                      slots: hospital.opd?.[opd]?.slots || [],
                      date_id: hospital.opd?.[opd]?.date_id || 0,
                    }}
                    handleBook={(data) =>
                      handleBookOPD({
                        start_time: data.startTime,
                        end_time: data.endTime,
                        opd_date_id: data.dateId,
                        patient_id: user?.patient_id || 0,
                      })
                    }
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Health Tips Section */}
        <div className="mb-12">
          <HealthTips />
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <FAQSection />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
