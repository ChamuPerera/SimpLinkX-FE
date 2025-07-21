"use client"

import { useState } from "react"
import type { Clinic, PatientForm } from "../components/custom/appointment/appointments"
import { clinics } from "../components/custom/appointment/data/clinics"
import { opdServices } from "../components/custom/appointment/data/opd-services"
import { ClinicCard } from "../components/custom/appointment/clinic-card"
import { AppointmentForm } from "../components/custom/appointment/appointment-form"
import { HealthTips } from "../components/custom/appointment/health-tips"
import { FAQSection } from "../components/custom/appointment/faq-section"
import { Header } from "../components/custom/header";

export default function AppointmentsPage() {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [activeTab, setActiveTab] = useState<"opd" | "clinic">("opd")
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false)
  const [appointmentDetails, setAppointmentDetails] = useState<PatientForm | null>(null)

  const currentServices = activeTab === "opd" ? opdServices : clinics

  const handleServiceSelect = (service: Clinic) => {
    setSelectedClinic(service)
  }

  const handleAppointmentSubmit = (formData: PatientForm) => {
    setAppointmentDetails(formData)
    setShowConfirmation(true)
    setSelectedClinic(null)
  }

  const handleBackToServiceSelection = () => {
    setSelectedClinic(null)
  }

  const handleNewAppointment = () => {
    setShowConfirmation(false)
    setAppointmentDetails(null)
  }

  if (showConfirmation && appointmentDetails) {
    const service = [...opdServices, ...clinics].find((s) => s.id === appointmentDetails.selectedClinic)
    const tokenNumber = `HMS${Date.now().toString().slice(-6)}`
    const appointmentId = `APT${Date.now().toString().slice(-8)}`

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6 text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">Appointment Confirmed!</h1>
              <p className="text-green-100">Your appointment has been successfully scheduled</p>
            </div>

            <div className="p-8">
              {/* Appointment Details */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Appointment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">PATIENT NAME</p>
                      <p className="text-lg font-semibold text-gray-800">{appointmentDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">APPOINTMENT ID</p>
                      <p className="text-lg font-semibold text-blue-600">{appointmentId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">TOKEN NUMBER</p>
                      <p className="text-2xl font-bold text-green-600">{tokenNumber}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">SERVICE</p>
                      <p className="text-lg font-semibold text-gray-800">{service?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">DATE & TIME</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {new Date(appointmentDetails.selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        at {appointmentDetails.selectedTimeSlot}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">LOCATION</p>
                      <p className="text-lg font-semibold text-gray-800">{service?.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">PHONE</p>
                    <p className="text-gray-800">{appointmentDetails.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">AGE</p>
                    <p className="text-gray-800">{appointmentDetails.age} years</p>
                  </div>
                </div>
              </div>

              {/* Email Confirmation Notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800 text-lg">Token Reserved!</h3>
                    <p className="text-green-700">Your appointment token has been successfully reserved</p>
                  </div>
                </div>
                <div className="text-center text-sm text-green-600">
                  <p>Please arrive 15 minutes before your scheduled time.</p>
                  <p className="mt-1">Show this confirmation at the reception desk.</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleNewAppointment}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Book Another Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-opacity-20 bg-white  rounded-full flex items-center justify-center" style={{'background':'#6475d0'}}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 8h10M7 12h4m1 8l-1-1v-1a1 1 0 011-1h2a1 1 0 011 1v1l-1 1"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Hospital Management System</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Professional healthcare appointment booking with token-based system for efficient patient management.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {selectedClinic ? (
          <AppointmentForm
            selectedClinic={selectedClinic}
            onSubmit={handleAppointmentSubmit}
            onBack={handleBackToServiceSelection}
          />
        ) : (
          <>
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
                    <span className="text-2xl mr-3">🏥</span>
                    <div>
                      <div className="text-lg">OPD Appointments</div>
                      <div className="text-sm font-normal">Outpatient Department Services</div>
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
                    <span className="text-2xl mr-3">🩺</span>
                    <div>
                      <div className="text-lg">Clinic Appointments</div>
                      <div className="text-sm font-normal">Specialized Department Services</div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentServices.map((service) => (
                  <ClinicCard key={service.id} clinic={service} onSelect={handleServiceSelect} isSelected={false} />
                ))}
              </div>
            </div>

            {/* Health Tips Section */}
            <div className="mb-12">
              <HealthTips />
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <FAQSection />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
