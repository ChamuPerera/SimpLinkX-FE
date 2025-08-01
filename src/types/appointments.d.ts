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
  name: string;
  user?: {
    id: number;
    name?: string;
    email?: string;
  };
}

export interface OpdDate {
  id: number;
  date: string;
  hospital_id: number;
  start_time: string;
  end_time: string;
  hospital?: {
    id: number;
    name: string;
  };
}

export interface ClinicDate {
  id: number;
  date: string;
  clinic_id: number;
  start_time: string;
  end_time: string;
  clinic?: {
    id: number;
    name: string;
    hospital_id: number;
    hospital?: {
      id: number;
      name: string;
    };
  };
}

export type Prescription = {
  id: number;
  patient_id: number;
  doctor_id: number;
  pharmacist_id: number;
  hospital_id: number;
  date: string;
  status: "draft" | "prescribed" | "dispensed";
  token_type: "clinic" | "opd";
  description: string;
  clinic_token_id?: number;
  medicines: {
    id: number;
    prescription_id: number;
    name: string;
    dosage: string;
    frequency: {
      morning: boolean;
      afternoon: boolean;
      night: boolean;
      if_needed: boolean;
    };
    days_supply: number;
    duration?: string;
    is_external: boolean;
    name_of_external_medicine?: string;
  }[];
  doctor?: {
    id: number;
    name: string;
  };
  pharmacist?: {
    id: number;
    name: string;
  };
  hospital?: {
    id: number;
    name: string;
  };
};

export interface OpdToken {
  id: number;
  token_number: string;
  patient_id: number;
  opd_date_id: number;
  start_time: string;
  end_time: string;
  type: "self" | "internal";
  patient?: Patient;
  opd_date?: OpdDate;
  prescriptions?: Prescription[];
}

export interface ClinicToken {
  id: number;
  clinic_id: number;
  patient_id: number;
  type: "self" | "internal";
  token_number: string;
  start_time: string;
  end_time: string;
  patient?: Patient;
  clinic_date?: ClinicDate;
  prescriptions?: Prescription[];
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
  available_slots: number;
  total_available_slots?: number;
}
