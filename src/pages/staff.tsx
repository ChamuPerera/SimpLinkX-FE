import { Layout, Loader } from "@/components/custom";
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
    title: "Staff",
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
            {/* Add your staff content here */}
            <p className="">To be implemented</p>
          </Layout>
        </Suspense>
      </PermissionWrapper>
    </PrivateRoute>
  );
};
