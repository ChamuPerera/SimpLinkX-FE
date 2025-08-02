import type { FC } from "react";

import { ClinicPatients, Loader } from "@/components/custom";
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
    title: "Clinic Patients",
  },
];

export const ClinicPatientsPage: FC = React.memo(() => {
  return (
    <PrivateRoute>
      <PermissionWrapper
        permissions={[
          permissions.viewClinicPatients,
          permissions.manageClinicPatients,
        ]}
        is404
      >
        <Suspense fallback={<Loader />}>
          <Layout breadcrumbs={breadcrumb}>
            <ClinicPatients />
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
});
