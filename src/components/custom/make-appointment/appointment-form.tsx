import type { Clinic, PatientForm } from "@/types/appointments";
import type React from "react";

import { useState } from "react";

interface AppointmentFormProps {
  selectedClinic: Clinic;
  onSubmit: (formData: PatientForm) => void;
  onBack: () => void;
}

export function AppointmentForm({
  selectedClinic,
  onSubmit,
  onBack,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<PatientForm>({
    name: "",
    phone: "",
    email: "",
    age: 0,
    gender: "",
    selectedClinic: selectedClinic.id,
    selectedDate: "",
    selectedTimeSlot: "",
    emergencyContact: "",
    medicalHistory: "",
  });

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit({
        ...formData,
        selectedDate,
        selectedTimeSlot,
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.name &&
      formData.phone &&
      formData.age &&
      selectedDate &&
      selectedTimeSlot
    );
  };

  const getNextFourDays = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 4; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isDateAvailable = (date: Date) => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    return selectedClinic.availability.includes(dayName);
  };

  const generateTimeSlots = () => {
    const slots = [];
    const startTime = 8 * 60; // 8:00 AM in minutes
    const endTime = 16 * 60; // 4:00 PM in minutes

    for (let time = startTime; time <= endTime; time += 10) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const timeString = `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;

      // Randomly set some slots as booked for demonstration
      const isBooked = Math.random() < 0.3; // 30% chance of being booked

      slots.push({
        id: `slot-${time}`,
        time: timeString,
        available: !isBooked,
        tokensLeft: isBooked ? 0 : 1,
        maxTokens: 1,
        status: isBooked ? "full" : "available",
      });
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-blue-100 hover:text-white transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Services
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Book Your Appointment</h1>
            <p className="text-blue-100">{selectedClinic.name}</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-8 py-4 bg-gray-50 border-b">
        <div className="flex items-center justify-center space-x-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step}
              </div>
              <span
                className={`ml-2 text-sm ${currentStep >= step ? "text-blue-600" : "text-gray-500"}`}
              >
                {step === 1
                  ? "Personal Info"
                  : step === 2
                    ? "Select Date & Time"
                    : "Confirmation"}
              </span>
              {step < 3 && <div className="w-16 h-0.5 bg-gray-300 ml-4"></div>}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="25"
                  value={formData.age || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      age: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!formData.name || !formData.phone || !formData.age}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next: Select Date & Time
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Select Date & Time
              </h2>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Personal Info
              </button>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Choose Appointment Date <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getNextFourDays().map((date, index) => {
                  const dateString = date.toISOString().split("T")[0];
                  const available = isDateAvailable(date);

                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={!available}
                      className={`p-4 rounded-lg border text-sm font-medium transition-all ${
                        selectedDate === dateString
                          ? "bg-blue-600 text-white border-blue-600 transform scale-105"
                          : available
                            ? "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                            : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      }`}
                      onClick={() => available && setSelectedDate(dateString)}
                    >
                      <div className="text-center">
                        <div className="font-bold">{formatDate(date)}</div>
                        <div className="text-xs mt-1">
                          {available ? "Available" : "Closed"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Choose Time Slot <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-96 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.available}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        selectedTimeSlot === slot.time
                          ? "bg-blue-600 text-white border-blue-600 transform scale-105"
                          : slot.available
                            ? "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                            : "bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed"
                      }`}
                      onClick={() =>
                        slot.available && setSelectedTimeSlot(slot.time)
                      }
                    >
                      <div className="text-center">
                        <div className="font-bold">{slot.time}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                disabled={!selectedDate || !selectedTimeSlot}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Review & Confirm
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Review Your Appointment
              </h2>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to Date & Time
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Patient Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Name:</span> {formData.name}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {formData.phone}
                    </p>
                    <p>
                      <span className="font-medium">Age:</span> {formData.age}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Appointment Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Service:</span>{" "}
                      {selectedClinic.name}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {selectedTimeSlot}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                Important Instructions
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Arrive 15 minutes before your appointment time</li>
                <li>• Bring valid ID</li>
                <li>• Your token number will be provided upon confirmation</li>
              </ul>
            </div>

            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Previous
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
