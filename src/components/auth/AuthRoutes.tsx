import { Navigate, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Callback from "@/pages/auth/Callback";

interface AuthRoutesProps {
  isAuthenticated: boolean;
}

export const AuthRoutes = ({ isAuthenticated }: AuthRoutesProps) => {
  return (
    <>
      <Route
        path="/auth/login"
        element={
          !isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route
        path="/auth/register"
        element={
          !isAuthenticated ? <Register /> : <Navigate to="/dashboard" replace />
        }
      />
      <Route
        path="/auth/forgot-password"
        element={
          !isAuthenticated ? (
            <ForgotPassword />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/auth/reset-password"
        element={
          !isAuthenticated ? (
            <ResetPassword />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route path="/auth/callback" element={<Callback />} />
    </>
  );
};