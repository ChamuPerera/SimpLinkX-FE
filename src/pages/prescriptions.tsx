import { Layout, Loader, Prescriptions } from "@/components/custom";
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
    title: "Prescriptions",
  },
];

export const PrescriptionsPage = () => {
  return (
    <PrivateRoute>
      <PermissionWrapper permissions={[permissions.viewPrescriptions]} is404>
        <Suspense fallback={<Loader />}>
          <Layout breadcrumbs={breadcrumb}>
            <Prescriptions />
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
};
