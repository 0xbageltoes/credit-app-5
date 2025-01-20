import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Callback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from URL or local storage
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session) {
          // Session exists, redirect to dashboard
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          navigate("/dashboard");
        } else {
          // No session found, try to exchange the code for a session
          const { error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) throw refreshError;
          
          // After refresh, check session again
          const { data: { session: refreshedSession } } = await supabase.auth.getSession();
          
          if (refreshedSession) {
            toast({
              title: "Successfully signed in",
              description: "Welcome back!",
            });
            navigate("/dashboard");
          } else {
            throw new Error("No session found after refresh");
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Please try signing in again.",
        });
        navigate("/auth/login");
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Completing sign in...</h2>
        <p className="text-sm text-muted-foreground">Please wait a moment.</p>
      </div>
    </div>
  );
}