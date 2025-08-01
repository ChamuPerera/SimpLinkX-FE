import type {
  AddMedicinesRequest,
  ReleaseMedicinesRequest,
} from "@/types/medicines";

import { api } from "@/services/api";

export const medicinesServices = {
  // Add medicines to a prescription
  addMedicines: async (medicinesData: AddMedicinesRequest) => {
    const { data } = await api.post("/medicines", medicinesData);
    return data;
  },

  // Release medicines
  releaseMedicines: async (releaseData: ReleaseMedicinesRequest) => {
    const { data } = await api.post("/medicines/release", releaseData);
    return data;
  },
};
