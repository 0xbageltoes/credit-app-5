import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useInactivityTimeout } from "@/hooks/use-inactivity-timeout";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Callback from "./pages/auth/Callback";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Use our custom hook for inactivity timeout
  useInactivityTimeout(isAuthenticated);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            {/* Public routes */}
            <Route
              path="/auth/login"
              element={
                <AuthGuard
                  isAuthenticated={isAuthenticated}
                  redirectTo="/dashboard"
                  requireAuth={false}
                >
                  <Login />
                </AuthGuard>
              }
            />
            <Route
              path="/auth/register"
              element={
                <AuthGuard
                  isAuthenticated={isAuthenticated}
                  redirectTo="/dashboard"
                  requireAuth={false}
                >
                  <Register />
                </AuthGuard>
              }
            />
            <Route
              path="/auth/forgot-password"
              element={
                <AuthGuard
                  isAuthenticated={isAuthenticated}
                  redirectTo="/dashboard"
                  requireAuth={false}
                >
                  <ForgotPassword />
                </AuthGuard>
              }
            />
            <Route
              path="/auth/reset-password"
              element={
                <AuthGuard
                  isAuthenticated={isAuthenticated}
                  redirectTo="/dashboard"
                  requireAuth={false}
                >
                  <ResetPassword />
                </AuthGuard>
              }
            />
            <Route path="/auth/callback" element={<Callback />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard/*"
              element={
                <AuthGuard
                  isAuthenticated={isAuthenticated}
                  redirectTo="/auth/login"
                >
                  <Index />
                </AuthGuard>
              }
            />

            {/* Default redirect */}
            <Route
              path="*"
              element={
                <Navigate
                  to={isAuthenticated ? "/dashboard" : "/auth/login"}
                  replace
                />
              }
            />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;