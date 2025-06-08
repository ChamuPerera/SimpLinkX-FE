import type { FC } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { ImSpinner3 } from "react-icons/im";
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

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <ImSpinner3 className="animate-spin" />
  );
};
