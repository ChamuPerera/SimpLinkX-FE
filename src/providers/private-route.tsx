import type { FC } from "react";

import { Loader } from "@/components/custom";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const PrivateRoute: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, isUserLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isUserLoading) {
      navigate("/login");
    }
  }, [isAuthenticated, isUserLoading, navigate]);

  return isAuthenticated ? <>{children}</> : <Loader />;
};
