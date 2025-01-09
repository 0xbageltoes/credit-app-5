import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function Callback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: "Please try again or contact support.",
        });
        navigate("/auth/login");
        return;
      }

      toast({
        title: "Email verified",
        description: "You can now sign in with your account.",
      });
      navigate("/auth/login");
    };

    handleEmailConfirmation();
  }, [navigate, toast]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Verifying your email...</h2>
        <p className="text-sm text-muted-foreground">Please wait a moment.</p>
      </div>
    </div>
  );
}