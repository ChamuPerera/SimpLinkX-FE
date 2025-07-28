import type { FC } from "react";

import { ClinicTokens, OpdTokens } from "@/components/custom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Calendar, Stethoscope } from "lucide-react";
import React from "react";

export const Appointments: FC = React.memo(() => {
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

      <Tabs defaultValue="opd" className="w-full">
        <TabsList className="w-full max-w-2xl">
          <TabsTrigger value="opd">
            <Stethoscope className="h-4 w-4" />
            OPD Appointments
          </TabsTrigger>
          <TabsTrigger value="clinic">
            <Calendar className="h-4 w-4" />
            Clinic Appointments
          </TabsTrigger>
        </TabsList>
        <TabsContent value="opd">
          <OpdTokens />
        </TabsContent>
        <TabsContent value="clinic">
          <ClinicTokens />
        </TabsContent>
      </Tabs>
    </div>
  );
});
