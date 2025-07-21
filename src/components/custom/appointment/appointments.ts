export interface Clinic {
  id: string
  name: string
  specialty: string
  description: string
  doctor: string
  qualifications: string
  experience: string
  availability: string[]
  timeSlots: TimeSlot[]
  icon: string
  department: string
  consultationFee: number
  location: string
}

export interface TimeSlot {
  id: string
  time: string
  available: boolean
  tokensLeft: number
  maxTokens: number
  status: "available" | "limited" | "full"
}

export interface Appointment {
  id: string
  clinicId: string
  patientName: string
  patientPhone: string
  patientEmail: string
  patientAge: number
  patientGender: string
  appointmentDate: string
  timeSlot: string
  tokenNumber: string
  status: "confirmed" | "pending" | "cancelled"
  consultationFee: number
  emergencyContact: string
  medicalHistory: string
}

export interface HealthTip {
  id: string
  title: string
  description: string
  category: string
  icon: string
  priority: "high" | "medium" | "low"
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface PatientForm {
  name: string
  phone: string
  email: string
  age: number
  gender: string
  selectedClinic: string
  selectedDate: string
  selectedTimeSlot: string
  emergencyContact: string
  medicalHistory: string
}
