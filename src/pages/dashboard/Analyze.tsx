import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentSelector } from "@/components/analyze/InvestmentSelector";
import { InvestmentDetails } from "@/components/analyze/InvestmentDetails";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type UserAnalysisState = Database['public']['Tables']['user_analysis_state']['Row'];

const Analyze = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's analysis state
  const { data: analysisState } = useQuery({
    queryKey: ["analysisState"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_analysis_state')
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Error fetching analysis state:", error);
        toast({
          title: "Error fetching saved state",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      return data as UserAnalysisState;
    },
  });

  // Update analysis state mutation
  const updateAnalysisState = useMutation({
    mutationFn: async (investment_id: string) => {
      const { data: existing } = await supabase
        .from('user_analysis_state')
        .select("id")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_analysis_state')
          .update({ selected_instrument: investment_id })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_analysis_state')
          .insert([{ selected_instrument: investment_id }]);
        if (error) throw error;
      }
    },
    onError: (error) => {
      console.error("Error updating analysis state:", error);
      toast({
        title: "Error saving selection",
        description: "Failed to save your instrument selection.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysisState"] });
    },
  });

  // Set initial selection from persisted state
  useEffect(() => {
    if (analysisState?.selected_instrument && !selectedInvestment) {
      setSelectedInvestment(analysisState.selected_instrument);
    }
  }, [analysisState, selectedInvestment]);

  // Handle investment selection
  const handleInvestmentSelect = (value: string) => {
    setSelectedInvestment(value);
    updateAnalysisState.mutate(value);
  };

  return (
    <div className="container mx-auto p-6">
      <InvestmentSelector onSelect={handleInvestmentSelect} />
      {selectedInvestment && <InvestmentDetails investmentId={selectedInvestment} />}
    </div>
  );
};

export default Analyze;