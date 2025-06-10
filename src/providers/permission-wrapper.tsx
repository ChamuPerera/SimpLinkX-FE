import type { FC } from "react";

import { useAuth } from "@/hooks/use-auth";
import { NotFoundPage } from "@/pages";

export const PermissionWrapper: FC<{
  children: React.ReactNode;
  permissions: string[] | null;
  is404?: boolean;
}> = ({ children, permissions, is404 = false }) => {
  const { user } = useAuth();

  if (!permissions) return <>{children}</>;

  if (!user || !user?.permissions?.some((perm) => permissions.includes(perm))) {
    if (is404) {
      return <NotFoundPage />;
    }
    return null;
  } else {
    // If the user has the required permissions, render the children
    return <>{children}</>;
  }
};
