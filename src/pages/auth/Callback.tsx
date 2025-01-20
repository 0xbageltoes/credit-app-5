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
        // First check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          navigate("/dashboard");
          return;
        }

        // If no session, try to exchange the code for a session
        const { error: signInError } = await supabase.auth.exchangeSessionForToken();
        
        if (signInError) {
          throw signInError;
        }

        // Check session again after exchange
        const { data: { session: newSession }, error: finalError } = await supabase.auth.getSession();
        
        if (finalError) {
          throw finalError;
        }

        if (newSession) {
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
          navigate("/dashboard");
        } else {
          throw new Error("No session found after authentication");
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