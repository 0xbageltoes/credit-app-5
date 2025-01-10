import { Navigate } from "react-router-dom";

interface AuthGuardProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectTo: string;
  requireAuth?: boolean;
}

export const AuthGuard = ({
  children,
  isAuthenticated,
  redirectTo,
  requireAuth = true,
}: AuthGuardProps) => {
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};