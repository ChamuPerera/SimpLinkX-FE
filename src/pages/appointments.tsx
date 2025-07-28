import type { FC } from "react";

import { Appointments, Loader } from "@/components/custom";
import { Layout } from "@/components/custom/layout";
import { permissions } from "@/constants/permissions";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { PrivateRoute } from "@/providers/private-route";
import React, { Suspense } from "react";

const breadcrumb = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Clinics",
  },
];

export const AppointmentsPage: FC = React.memo(() => {
  return (
    <PrivateRoute>
      <PermissionWrapper
        permissions={[
          permissions.viewAppointments,
          permissions.manageAppointments,
        ]}
        is404
      >
        <Suspense fallback={<Loader />}>
          <Layout breadcrumbs={breadcrumb}>
            <Appointments />
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
});
