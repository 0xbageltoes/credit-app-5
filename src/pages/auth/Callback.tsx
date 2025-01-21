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
        // Check for error in URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const error = searchParams.get('error') || hashParams.get('error');
        const errorDescription = searchParams.get('error_description') || hashParams.get('error_description');
        
        console.log("URL parameters:", { 
          error,
          errorDescription,
          search: window.location.search,
          hash: window.location.hash
        });

        if (error) {
          // Handle the multiple accounts error specifically
          if (errorDescription?.includes('Multiple accounts with the same email address')) {
            throw new Error(
              "This email is already associated with another login method. " +
              "Please use your original login method (e.g., Google) or use a different email address."
            );
          }
          throw new Error(decodeURIComponent(errorDescription || 'Authentication failed'));
        }

        // Get the URL fragment
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        // If we have tokens in the URL, set the session
        if (accessToken && refreshToken) {
          const { data: { session }, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (setSessionError) throw setSessionError;

          if (session) {
            toast({
              title: "Successfully signed in",
              description: "Welcome back!",
            });
            navigate("/dashboard");
            return;
          }
        }

        // If no tokens in URL, try to get existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        if (session) {
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          navigate("/dashboard");
          return;
        }

        // If we get here, authentication failed
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