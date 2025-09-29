import type { AddMedicinesRequest } from "@/types/medicines";
import type { FC } from "react";

import {
  Button,
  Checkbox,
  Combobox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from "@/components/ui";
import { permissions } from "@/constants/permissions";
import { useInventories } from "@/hooks/use-inventory";
import { useAddMedicines, useReleaseMedicines } from "@/hooks/use-medicines";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { PiSpinnerGapBold } from "react-icons/pi";
import { toast } from "sonner";

interface AddMedicinesProps {
  prescriptionId: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface MedicineForm {
  name: string;
  dosage: number;
  days_supply: number;
  is_external: boolean;
  name_of_external_medicine: string;
  frequency: {
    morning: boolean;
    afternoon: boolean;
    night: boolean;
    if_needed: boolean;
  };
  duration: string;
}

const initialMedicine: MedicineForm = {
  name: "",
  dosage: 1,
  days_supply: 1,
  is_external: false,
  name_of_external_medicine: "",
  frequency: {
    morning: false,
    afternoon: false,
    night: false,
    if_needed: false,
  },
  duration: "",
};

export const AddMedicines: FC<AddMedicinesProps> = ({
  prescriptionId,
  open,
  setOpen,
}) => {
  const [medicines, setMedicines] = useState<MedicineForm[]>([initialMedicine]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const { data: medicinesData, isLoading: isInventoryLoading } = useInventories(
    {
      currentPage: 1,
      pageSize: 10,
      search,
    },
  );

  const addMedicinesMutation = useAddMedicines();
  const releaseMedicinesMutation = useReleaseMedicines();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData: AddMedicinesRequest = {
        prescription_id: prescriptionId,
        medicines: medicines.map((medicine) => ({
          name: !medicine.is_external ? medicine.name : null,
          dosage: medicine.dosage,
          days_supply: medicine.days_supply,
          is_external: medicine.is_external,
          name_of_external_medicine: medicine.is_external
            ? medicine.name_of_external_medicine || null
            : null,
          frequency: medicine.frequency,
          duration: medicine.duration || null,
        })),
      };

      await addMedicinesMutation.mutateAsync(requestData);
      toast.success("Medicines added successfully");
      setOpen(false);
      setMedicines([initialMedicine]);
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to add medicines",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReleaseMedicines = async () => {
    setIsSubmitting(true);
    try {
      await releaseMedicinesMutation.mutateAsync({
        prescription_id: prescriptionId,
      });
      toast.success("Medicines released successfully");
      setOpen(false);
    } catch (error: unknown) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to release medicines",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateMedicine = (
    index: number,
    field: keyof MedicineForm,
    value: string | number | boolean,
  ) => {
    setMedicines((prev) =>
      prev.map((medicine, i) =>
        i === index ? { ...medicine, [field]: value } : medicine,
      ),
    );
  };

  const updateFrequency = (
    index: number,
    frequencyField: keyof MedicineForm["frequency"],
    value: boolean,
  ) => {
    setMedicines((prev) =>
      prev.map((medicine, i) =>
        i === index
          ? {
              ...medicine,
              frequency: { ...medicine.frequency, [frequencyField]: value },
            }
          : medicine,
      ),
    );
  };

  const addMedicine = () => {
    setMedicines((prev) => [...prev, { ...initialMedicine }]);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines((prev) => prev.filter((_, i) => i !== index));
    }
  };

  React.useEffect(() => {
    if (open) {
      setMedicines([initialMedicine]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Medicines</DialogTitle>
          <DialogDescription>
            Add medicines to the prescription or release existing medicines.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <PermissionWrapper permissions={[permissions.releaseMedicines]}>
            <Button
              type="button"
              variant="outline"
              onClick={handleReleaseMedicines}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <PiSpinnerGapBold className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Release Medicines
            </Button>
          </PermissionWrapper>

          <PermissionWrapper permissions={[permissions.addMedicines]}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {medicines.map((medicine, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Medicine {index + 1}</h4>
                    {medicines.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMedicine(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>
                        Medicine <span className="text-red-500">*</span>
                      </Label>
                      <Combobox
                        isLoading={isInventoryLoading}
                        items={
                          medicinesData?.inventories?.map((medicine) => ({
                            label: `${medicine.drug_name} (${medicine.available_quantity})`,
                            value: medicine.drug_name || "",
                          })) || []
                        }
                        onChange={setSearch}
                        placeholder="Medicine"
                        search={search}
                        setValue={(value) =>
                          updateMedicine(index, "name", value)
                        }
                        value={medicine.name}
                        disabled={medicine.is_external}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`dosage-${index}`}>
                        Dosage <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`dosage-${index}`}
                        type="number"
                        min="1"
                        value={medicine.dosage}
                        onChange={(e) =>
                          updateMedicine(
                            index,
                            "dosage",
                            Number(e.target.value),
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`days-supply-${index}`}>
                        Days Supply <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`days-supply-${index}`}
                        type="number"
                        min="1"
                        value={medicine.days_supply}
                        onChange={(e) =>
                          updateMedicine(
                            index,
                            "days_supply",
                            Number(e.target.value),
                          )
                        }
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id={`external-${index}`}
                        checked={medicine.is_external}
                        onCheckedChange={(checked) =>
                          updateMedicine(index, "is_external", checked)
                        }
                      />
                      <Label htmlFor={`external-${index}`}>
                        Is External Medicine
                      </Label>
                    </div>
                  </div>

                  {medicine.is_external && (
                    <div className="space-y-2">
                      <Label htmlFor={`external-name-${index}`}>
                        External Medicine Name
                      </Label>
                      <Input
                        id={`external-name-${index}`}
                        value={medicine.name_of_external_medicine}
                        onChange={(e) =>
                          updateMedicine(
                            index,
                            "name_of_external_medicine",
                            e.target.value,
                          )
                        }
                        placeholder="Enter external medicine name"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`morning-${index}`}
                          checked={medicine.frequency.morning}
                          onCheckedChange={(checked) =>
                            updateFrequency(
                              index,
                              "morning",
                              checked as boolean,
                            )
                          }
                        />
                        <Label htmlFor={`morning-${index}`}>Morning</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`afternoon-${index}`}
                          checked={medicine.frequency.afternoon}
                          onCheckedChange={(checked) =>
                            updateFrequency(
                              index,
                              "afternoon",
                              checked as boolean,
                            )
                          }
                        />
                        <Label htmlFor={`afternoon-${index}`}>Afternoon</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`night-${index}`}
                          checked={medicine.frequency.night}
                          onCheckedChange={(checked) =>
                            updateFrequency(index, "night", checked as boolean)
                          }
                        />
                        <Label htmlFor={`night-${index}`}>Night</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`if-needed-${index}`}
                          checked={medicine.frequency.if_needed}
                          onCheckedChange={(checked) =>
                            updateFrequency(
                              index,
                              "if_needed",
                              checked as boolean,
                            )
                          }
                        />
                        <Label htmlFor={`if-needed-${index}`}>If Needed</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`duration-${index}`}>Special Notes</Label>
                    <Textarea
                      id={`duration-${index}`}
                      value={medicine.duration}
                      onChange={(e) =>
                        updateMedicine(index, "duration", e.target.value)
                      }
                      placeholder="Enter Special Notes"
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addMedicine}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Medicine
              </Button>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <PiSpinnerGapBold className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Add Medicines
                </Button>
              </div>
            </form>
          </PermissionWrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};
