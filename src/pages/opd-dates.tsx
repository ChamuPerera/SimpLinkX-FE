import type { FC } from "react";

import { Layout, Loader } from "@/components/custom";
import { OpdDates } from "@/components/custom/opd-dates";
import { permissions } from "@/constants/permissions";
import { PermissionWrapper } from "@/providers/permission-wrapper";
import { PrivateRoute } from "@/providers/private-route";
import { Suspense } from "react";

const breadcrumb = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "OPD Dates",
  },
];

export const OpdDatesPage: FC = () => {
  return (
    <PrivateRoute>
      <PermissionWrapper permissions={[permissions.manageHospitals]} is404>
        <Suspense fallback={<Loader />}>
          <Layout breadcrumbs={breadcrumb}>
            <OpdDates />
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
};
