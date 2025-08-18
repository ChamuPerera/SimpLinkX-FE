import { Layout, Loader, Pharmacies } from "@/components/custom";
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
    title: "Pharmacies",
  },
];

export const PharmaciesPage = () => {
  return (
    <PrivateRoute>
      <PermissionWrapper permissions={[permissions.managePharmacy]} is404>
        <Suspense fallback={<Loader />}>
          <Layout breadcrumbs={breadcrumb}>
            <Pharmacies />
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
};
