import type { FC } from "react";

import { ClinicTokens, OpdTokens } from "@/components/custom";
import { Button } from "@/components/ui";
import { Calendar, Stethoscope } from "lucide-react";
import React, { useState } from "react";

export const Appointments: FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState("opd");

  return (
    <div className="flex w-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="text-sm text-gray-500">
            Manage OPD and clinic appointments
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === "opd" ? "default" : "ghost"}
          onClick={() => setActiveTab("opd")}
          className="flex items-center gap-2 flex-1"
        >
          <Stethoscope className="h-4 w-4" />
          OPD Appointments
        </Button>
        <Button
          variant={activeTab === "clinic" ? "default" : "ghost"}
          onClick={() => setActiveTab("clinic")}
          className="flex items-center gap-2 flex-1"
        >
          <Calendar className="h-4 w-4" />
          Clinic Appointments
        </Button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "opd" && <OpdTokens />}
        {activeTab === "clinic" && <ClinicTokens />}
      </div>
    </div>
  );
});
