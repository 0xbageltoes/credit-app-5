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
        
        // Get the URL fragment
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        console.log("URL parameters:", { 
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hash: window.location.hash,
          search: window.location.search 
        });

        // If we have tokens in the URL, set the session
        if (accessToken && refreshToken) {
          console.log("Found tokens in URL, setting session...");
          const { data: { session }, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          console.log("Set session result:", {
            success: !!session,
            error: setSessionError,
            session: session ? {
              user: {
                id: session.user.id,
                email: session.user.email,
                app_metadata: session.user.app_metadata,
                user_metadata: session.user.user_metadata
              }
            } : null
          });

          if (setSessionError) {
            console.error("Set session error:", setSessionError);
            throw setSessionError;
          }

          if (session) {
            console.log("Successfully set session, redirecting to dashboard...");
            toast({
              title: "Successfully signed in",
              description: "Welcome back!",
            });
            navigate("/dashboard");
            return;
          }
        }

        // If no tokens in URL, try to get existing session
        console.log("No tokens in URL, checking for existing session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log("Session check result:", {
          hasSession: !!session,
          error: sessionError,
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
          console.log("Found existing session, redirecting to dashboard...");
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          navigate("/dashboard");
          return;
        }

        // If we get here, authentication failed
        console.error("No session could be established");
        throw new Error("Authentication failed - no session could be established");

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