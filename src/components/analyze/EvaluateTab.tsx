import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScenarioGenerator } from "@/lib/scenarios/generator";
import CashflowDashboard from "@/components/cashflows/CashflowDashboard";
import { useToast } from "@/components/ui/use-toast";
import { AssumptionsPanel } from "./assumptions/AssumptionsPanel";
import { calculateWAF, calculateModifiedDuration } from "@/lib/scenarios/evaluation-utils";
import type { Database } from "@/integrations/supabase/types";
import type { ScenarioConfig, ScenarioResult } from "@/lib/scenarios/evaluation-types";

type UserAnalysisState = Database['public']['Tables']['user_analysis_state']['Row'];

interface EvaluateTabProps {
  investmentDetails: any; // Replace with proper type when available
}

export const EvaluateTab = ({ investmentDetails }: EvaluateTabProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedScenario, setSelectedScenario] = useState<string>("Base");
  const [assumptions, setAssumptions] = useState<ScenarioConfig>({
    type: "CPR",
    initialValue: 8,
    ramps: [{
      startValue: 8,
      endValue: 12,
      rampPeriods: 12,
      holdPeriods: 24
    }],
    seasonalAdjustments: {
      3: 1.2,
      4: 1.3,
      5: 1.3,
      6: 1.4,
      7: 1.3,
      8: 1.2,
      9: 1.1,
    }
  });

  const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);

  // Get current user using React Query
  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
  });

  // Fetch persisted forecast results
  const { data: analysisState } = useQuery({
    queryKey: ["analysisState"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_analysis_state')
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Error fetching analysis state:", error);
        return null;
      }

      return data as UserAnalysisState;
    },
  });

  // Update forecast results mutation
  const updateForecastResults = useMutation({
    mutationFn: async (scenarioResults: ScenarioResult[]) => {
      if (!userData?.id) {
        throw new Error("No authenticated user");
      }

      const { data: existing } = await supabase
        .from('user_analysis_state')
        .select("id")
        .maybeSingle();

      const serializedResults = scenarioResults.map(result => ({
        ...result,
        cashflows: result.cashflows.map(cf => ({ ...cf })),
        metrics: { ...result.metrics }
      }));

      if (existing) {
        const { error } = await supabase
          .from('user_analysis_state')
          .update({ 
            last_forecast: serializedResults,
            user_id: userData.id 
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_analysis_state')
          .insert([{ 
            last_forecast: serializedResults,
            user_id: userData.id 
          }]);
        if (error) throw error;
      }
    },
    onError: (error) => {
      console.error("Error updating forecast results:", error);
      toast({
        title: "Error saving forecast",
        description: "Failed to save your forecast results.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analysisState"] });
    },
  });

  // Load persisted forecast results
  useEffect(() => {
    if (analysisState?.last_forecast && !scenarios.length) {
      const parsedScenarios = analysisState.last_forecast as unknown as ScenarioResult[];
      setScenarios(parsedScenarios);
    }
  }, [analysisState, scenarios.length]);

  const generateScenarios = () => {
    try {
      const generator = new ScenarioGenerator(120); // 10 years of monthly periods
      const standardScenarios = generator.generateStandardScenarios();
      
      // Convert Map to array of scenario results
      const scenarioResults = Array.from(standardScenarios).map(([name, vector]) => ({
        name,
        cashflows: vector.map((value, index) => ({
          period: index + 1,
          beginningBalance: index === 0 ? (investmentDetails.amount || 0) : 0,
          scheduledPrincipal: value * (investmentDetails.amount || 0) / 100,
          scheduledInterest: (investmentDetails.interest_rate || 0) * (investmentDetails.amount || 0) / 1200,
          prepayments: 0,
          defaultedPrincipal: 0,
          recoveries: 0,
          realizedLoss: 0,
          losses: 0, // Added this field to match CashflowData interface
          weightedAverageCoupon: investmentDetails.interest_rate || 0,
          loanCount: 1,
          delinquentBalance: 0,
          delinquentPercent: 0,
          servicerExpenses: (investmentDetails.amount || 0) * 0.0025 / 12, // Example: 25bps annual servicing fee
          otherExpenses: 0,
          cashflowToOtherTranches: 0,
          netCashflow: 0,
          endingBalance: 0
        })),
        metrics: {
          waf: calculateWAF(vector),
          modifiedDuration: calculateModifiedDuration(vector),
          yield: investmentDetails.interest_rate || 0
        }
      }));

      // Calculate ending balances and net cashflows
      scenarioResults.forEach(scenario => {
        scenario.cashflows.forEach((cf, index) => {
          if (index > 0) {
            cf.beginningBalance = scenario.cashflows[index - 1].endingBalance;
          }
          cf.endingBalance = cf.beginningBalance - cf.scheduledPrincipal - cf.prepayments - cf.realizedLoss;
          cf.netCashflow = cf.scheduledPrincipal + cf.scheduledInterest + cf.prepayments + cf.recoveries - 
                          cf.servicerExpenses - cf.otherExpenses - cf.cashflowToOtherTranches;
        });
      });

      setScenarios(scenarioResults);
      updateForecastResults.mutate(scenarioResults);
      
      toast({
        title: "Scenarios Generated",
        description: "Successfully generated and saved cashflow scenarios",
      });
    } catch (error) {
      console.error("Error generating scenarios:", error);
      toast({
        title: "Error",
        description: "Failed to generate scenarios. Please check the console for details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <AssumptionsPanel
        assumptions={assumptions}
        onAssumptionsChange={setAssumptions}
        onGenerateScenarios={generateScenarios}
        investmentDetails={investmentDetails}
      />

      <div className="bg-white rounded-lg shadow">
        <CashflowDashboard
          scenarios={scenarios}
          onScenarioSelect={setSelectedScenario}
          startDate={investmentDetails.start_date ? new Date(investmentDetails.start_date) : new Date()}
        />
      </div>
    </div>
  );
};