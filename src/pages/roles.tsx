import { Layout, Loader, Roles } from "@/components/custom";
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
    title: "Roles",
  },
];

export const RolesPage = () => {
  return (
    <PrivateRoute>
      <PermissionWrapper
        permissions={[
          permissions.viewRoles,
          permissions.createRoles,
          permissions.updateRoles,
        ]}
        is404
      >
        <Suspense fallback={<Loader />}>
          <Layout breadcrumbs={breadcrumb}>
            <Roles />
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
};
