export interface Clinic {
  id: string;
  name: string;
  specialty: string;
  description: string;
  doctor: string;
  qualifications: string;
  experience: string;
  availability: string[];
  timeSlots: TimeSlot[];
  icon: string;
  department: string;
  consultationFee: number;
  location: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  tokensLeft: number;
  maxTokens: number;
  status: "available" | "limited" | "full";
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: string;
  appointmentDate: string;
  timeSlot: string;
  tokenNumber: string;
  status: "confirmed" | "pending" | "cancelled";
  consultationFee: number;
  emergencyContact: string;
  medicalHistory: string;
}

export interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  priority: "high" | "medium" | "low";
}

// Backend appointment types
export interface Patient {
  id: number;
  user_id: number;
  nic: string;
  user?: {
    id: number;
    name: string;
    email?: string;
  };
}

export interface OpdDate {
  id: number;
  date: string;
  doctor_id: number;
  doctor?: {
    id: number;
    user?: {
      id: number;
      name: string;
    };
  };
}

export interface ClinicDate {
  id: number;
  date: string;
  clinic_id: number;
  clinic?: {
    id: number;
    name: string;
  };
}

export interface OpdToken {
  id: number;
  token_number: string;
  patient_id: number;
  opd_date_id: number;
  start_time: string;
  end_time: string;
  type: "regular" | "urgent" | "follow_up";
  patient?: Patient;
  opd_date?: OpdDate;
}

export interface ClinicToken {
  id: number;
  token_number: string;
  patient_id: number;
  clinic_date_id: number;
  start_time: string;
  end_time: string;
  type: "regular" | "urgent" | "follow_up";
  patient?: Patient;
  clinic_date?: ClinicDate;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface PatientForm {
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  selectedClinic: string;
  selectedDate: string;
  selectedTimeSlot: string;
  emergencyContact: string;
  medicalHistory: string;
}

// OPD Token interfaces
export interface OpdToken {
  id?: number;
  opd_date_id: number;
  patient_id: number;
  type: "self" | "other";
  token_number?: string;
  start_time: string;
  end_time: string;
  created_at?: string;
  updated_at?: string;
  opd_date?: OpdDate & {
    hospital: {
      id: number;
      name: string;
    };
  };
  patient?: Patient;
  prescriptions?: unknown[];
}

// Response interfaces
export interface ClinicTokensResponse {
  clinicTokens: ClinicToken[];
  total: number;
  from: number;
  to: number;
  currentPage: number;
  pageSize: number;
  endPage: number;
}

export interface OpdTokensResponse {
  opdTokens: OpdToken[];
  total: number;
  from: number;
  to: number;
  currentPage: number;
  pageSize: number;
  endPage: number;
}

// Search params interfaces
export interface ClinicTokensParams {
  currentPage?: number;
  pageSize?: number;
  search?: string;
  clinic_date_id?: number;
  type?: string;
}

export interface OpdTokensParams {
  currentPage?: number;
  pageSize?: number;
  search?: string;
  opd_date_id?: number;
  type?: string;
}

// Available slots interface
export interface AvailableSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}
