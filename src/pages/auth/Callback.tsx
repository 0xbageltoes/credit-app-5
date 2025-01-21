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
        console.log("Starting authentication callback process...");
        
        // First check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Initial session check:", {
          hasSession: !!session,
          sessionError,
          session: session ? {
            user: {
              id: session.user.id,
              email: session.user.email,
              app_metadata: session.user.app_metadata,
              user_metadata: session.user.user_metadata
            }
          } : null
        });
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (session) {
          console.log("Valid session found, redirecting to dashboard...");
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          navigate("/dashboard");
          return;
        }

        console.log("No session found, attempting to refresh...");
        
        // If no session, try to refresh it
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        console.log("Session refresh attempt:", {
          success: !!refreshData.session,
          refreshError,
          session: refreshData.session ? {
            user: {
              id: refreshData.session.user.id,
              email: refreshData.session.user.email,
              app_metadata: refreshData.session.user.app_metadata,
              user_metadata: refreshData.session.user.user_metadata
            }
          } : null
        });
        
        if (refreshError) {
          console.error("Refresh error:", refreshError);
          throw refreshError;
        }

        // Check session again after refresh
        const { data: { session: newSession }, error: finalError } = await supabase.auth.getSession();
        
        console.log("Final session check:", {
          hasSession: !!newSession,
          finalError,
          session: newSession ? {
            user: {
              id: newSession.user.id,
              email: newSession.user.email,
              app_metadata: newSession.user.app_metadata,
              user_metadata: newSession.user.user_metadata
            }
          } : null
        });
        
        if (finalError) {
          console.error("Final session error:", finalError);
          throw finalError;
        }

        if (newSession) {
          console.log("Successfully obtained new session, redirecting to dashboard...");
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          navigate("/dashboard");
        } else {
          console.error("No session found after all attempts");
          throw new Error("No session found after authentication");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: error instanceof Error ? error.message : "Please try signing in again.",
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