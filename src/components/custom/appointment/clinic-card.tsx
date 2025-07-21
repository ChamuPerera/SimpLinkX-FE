"use client"

import type { Clinic } from "./appointments"

interface ClinicCardProps {
  clinic: Clinic
  onSelect: (clinic: Clinic) => void
  isSelected: boolean
}

export function ClinicCard({ clinic, onSelect, isSelected }: ClinicCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
        isSelected
          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 transform scale-105"
          : "border-gray-200 hover:border-blue-300"
      }`}
      onClick={() => onSelect(clinic)}
    >
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl mr-4">
          {clinic.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{clinic.name}</h3>
          <p className="text-blue-600 font-semibold text-sm">{clinic.specialty}</p>
          <p className="text-gray-500 text-xs">Clinic Services</p>
        </div>
      </div>

      {/* Location */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-1">LOCATION</p>
        <p className="text-sm text-gray-700">{clinic.location}</p>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">AVAILABLE DAYS</p>
        <div className="flex flex-wrap gap-1">
          {clinic.availability.map((day) => (
            <span key={day} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
              {day.slice(0, 3)}
            </span>
          ))}
        </div>
      </div>

      {/* Book Button */}
      <div className="pt-4 border-t border-gray-200">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors">
          Book Now
        </button>
      </div>
    </div>
  )
}
