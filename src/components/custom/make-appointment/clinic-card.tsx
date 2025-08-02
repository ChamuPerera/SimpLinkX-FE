import type { AvailableSlot } from "@/types/appointments";
import type { FC } from "react";

import { Button } from "@/components/ui";
import { useState } from "react";
import { toast } from "sonner";

interface ClinicCardProps {
  date: {
    slots: AvailableSlot[];
    date_id: number;
    date: string;
    location: string;
  };
  handleBook: (data: {
    startTime: string;
    endTime: string;
    dateId: number;
  }) => void;
  service?: string;
  accessGranted?: boolean;
}

export const ClinicCard: FC<ClinicCardProps> = ({
  date,
  handleBook,
  service = "Clinic",
  accessGranted = true,
}) => {
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);

  const handleSlotClick = (slot: AvailableSlot) => {
    setStartTime(slot.start_time);
    setEndTime(slot.end_time);
  };

  const handleSubmit = () => {
    // Ensure both startTime and endTime are set before booking
    if (startTime && endTime) {
      handleBook({
        startTime,
        endTime,
        dateId: date.date_id,
      });
    } else {
      toast.error("Please select a time slot before booking.");
      return;
    }
  };

  return (
    <div className="border border-blue-500 rounded-md p-3">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <h3 className="font-medium text-gray-800">{date.date}</h3>
        <p className="text-gray-500 text-xs">{service} Services</p>
      </div>

      {/* Location */}
      <div className="mb-4">
        <p className="text-sm text-gray-700">Location : {date.location}</p>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-500 mb-2">
          AVAILABLE SLOTS
        </p>
        <div className="flex flex-wrap gap-2">
          {date.slots.map((day) => (
            <Button
              key={day.start_time}
              variant={startTime === day.start_time ? "default" : "outline"}
              size={"sm"}
              type="button"
              disabled={day.available_slots === 0}
              onClick={() => {
                handleSlotClick(day);
              }}
            >
              {`${day.start_time} - ${day.end_time}`} ({day.available_slots})
            </Button>
          ))}

          {(!date.slots || date.slots.length === 0) && (
            <p className="text-gray-500 text-xs">
              No available slots for this date.
            </p>
          )}
        </div>
      </div>

      {/* Book Button */}
      <div className="pt-4 border-t border-gray-200">
        <Button
          disabled={!startTime || !endTime || !accessGranted}
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
        >
          {accessGranted ? "Book Appointment" : "Not Available"}
        </Button>
      </div>
    </div>
  );
};
