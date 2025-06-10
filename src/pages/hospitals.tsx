import { Hospitals, Layout, Loader } from "@/components/custom";
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
    title: "Hospitals",
  },
];

export const HospitalsPage = () => {
  return (
    <PrivateRoute>
      <PermissionWrapper
        permissions={[permissions.createHospitals, permissions.updateHospitals]}
        is404
      >
        <Suspense fallback={<Loader />}>
          <Layout breadcrumbs={breadcrumb}>
            <Hospitals />
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
};
