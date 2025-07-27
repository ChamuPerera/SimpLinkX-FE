import { ClinicDates, Layout, Loader } from "@/components/custom";
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
    title: "Clinic Dates",
  },
];

export const ClinicDatesPage = () => {
  return (
    <PrivateRoute>
      <PermissionWrapper permissions={[permissions.manageHospitals]} is404>
        <Suspense fallback={<Loader />}>
          <Layout breadcrumbs={breadcrumb}>
            <ClinicDates />
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
};
