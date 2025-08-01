export interface Medicine {
  id?: number;
  prescription_id: number;
  name: string;
  dosage: number;
  days_supply: number;
  is_external: boolean;
  name_of_external_medicine?: string | null;
  frequency?: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
    if_needed: boolean;
  } | null;
  duration?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AddMedicinesRequest {
  prescription_id: number;
  medicines: {
    name: string | null;
    dosage: number;
    days_supply: number;
    is_external: boolean;
    name_of_external_medicine?: string | null;
    frequency?: {
      morning: boolean;
      afternoon: boolean;
      night: boolean;
      if_needed: boolean;
    } | null;
    duration?: string | null;
  }[];
}

export interface ReleaseMedicinesRequest {
  prescription_id: number;
}
