import { Layout, Loader, Permissions } from "@/components/custom";
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
    title: "Permissions",
  },
];

export const PermissionsPage = () => {
  return (
    <PrivateRoute>
      <PermissionWrapper
        permissions={[
          permissions.viewPermissions,
          permissions.createPermissions,
          permissions.updatePermissions,
          permissions.assignPermissions,
          permissions.viewRolePermissions,
        ]}
        is404
      >
        <Suspense fallback={<Loader />}>
          <Layout breadcrumbs={breadcrumb}>
            <Permissions />
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
};
