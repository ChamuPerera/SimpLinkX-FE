export interface Prescription {
  id?: number;
  patient_id: number;
  doctor_id?: number | null;
  hospital_id: number;
  pharmacist_id?: number | null;
  date: string;
  status: "draft" | "prescribed" | "dispensed";
  token_type: "opd" | "clinic";
  description?: string | null;
  opd_token_id?: number | null;
  clinic_token_id?: number | null;
  patient?: { id: number; name: string; nic: string };
  doctor?: { id: number; name: string } | null;
  pharmacist?: { id: number; name: string } | null;
  hospital?: { id: number; name: string };
  medicines?: {
    id: number;
    name: string;
    dosage: string;
    frequency: {
      morning: boolean;
      afternoon: boolean;
      night: boolean;
      if_needed: boolean;
    };
    days_supply: number;
    is_external: boolean;
    name_of_external_medicine?: string;
    duration?: string;
    prescription_id: number;
  }[];
}

export interface CreatePrescriptionRequest {
  patient_id: number;
  opd_token_id?: number | null;
  clinic_token_id?: number | null;
}
