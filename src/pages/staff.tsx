import { Layout, Loader, Users } from "@/components/custom";
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
    title: "People",
  },
];

export const StaffPage = () => {
  return (
    <PrivateRoute>
      <PermissionWrapper
        permissions={[
          permissions.viewUsers,
          permissions.createUsers,
          permissions.updateUsers,
          permissions.updateUsersHospital,
        ]}
        is404
      >
        <Suspense fallback={<Loader />}>
          <Layout breadcrumbs={breadcrumb}>
            <Users />
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
};
