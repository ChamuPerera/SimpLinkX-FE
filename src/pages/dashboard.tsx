import { Layout, Loader } from "@/components/custom";
import { PrivateRoute } from "@/providers/private-route";
import { Suspense } from "react";

const breadcrumb = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Dashboard",
  },
];

export const DashboardPage = () => {
  return (
    <PrivateRoute>
      <Suspense fallback={<Loader />}>
        <Layout breadcrumbs={breadcrumb}>
          {/* Add your dashboard content here */}
          <p className="">To be implemented</p>
        </Layout>
      </Suspense>
    </PrivateRoute>
  );
};
