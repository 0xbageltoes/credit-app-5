import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScenarioConfig, ScenarioType } from "@/lib/scenarios/types";
import { ScenarioGenerator } from "@/lib/scenarios/generator";
import CashflowDashboard from "@/components/cashflows/CashflowDashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

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

  const [scenarios, setScenarios] = useState<any[]>([]); // Replace with proper type

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
    mutationFn: async (scenarioResults: any[]) => {
      const { data: existing } = await supabase
        .from('user_analysis_state')
        .select("id")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_analysis_state')
          .update({ last_forecast: scenarioResults })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_analysis_state')
          .insert([{ last_forecast: scenarioResults }]);
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
      setScenarios(analysisState.last_forecast as any[]);
    }
  }, [analysisState, scenarios.length]);

  const handleAssumptionChange = (field: string, value: any) => {
    setAssumptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateScenarios = () => {
    try {
      const generator = new ScenarioGenerator(120); // 10 years of monthly periods
      const standardScenarios = generator.generateStandardScenarios();
      
      // Convert Map to array of scenario results
      const scenarioResults = Array.from(standardScenarios).map(([name, vector]) => ({
        name,
        cashflows: vector.map((value, index) => ({
          period: index + 1,
          scheduledPrincipal: value * (investmentDetails.amount || 0) / 100,
          scheduledInterest: (investmentDetails.interest_rate || 0) * (investmentDetails.amount || 0) / 1200,
          prepayments: 0,
          losses: 0,
          recoveries: 0
        })),
        metrics: {
          waf: calculateWAF(vector),
          modifiedDuration: calculateModifiedDuration(vector),
          yield: investmentDetails.interest_rate || 0
        }
      }));

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
      {/* Assumptions Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Assumptions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="scenarioType">Scenario Type</Label>
            <select
              id="scenarioType"
              value={assumptions.type}
              onChange={(e) => handleAssumptionChange("type", e.target.value as ScenarioType)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="CPR">CPR</option>
              <option value="CDR">CDR</option>
              <option value="Loss Severity">Loss Severity</option>
              <option value="Delinquency">Delinquency</option>
              <option value="Interest Rate">Interest Rate</option>
              <option value="Draw Rate">Draw Rate</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialValue">Initial Value (%)</Label>
            <Input
              id="initialValue"
              type="number"
              value={assumptions.initialValue}
              onChange={(e) => handleAssumptionChange("initialValue", parseFloat(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Ramp Configuration</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Start Value"
                value={assumptions.ramps?.[0]?.startValue}
                onChange={(e) => {
                  const ramps = [...(assumptions.ramps || [])];
                  if (!ramps[0]) ramps[0] = {} as any;
                  ramps[0].startValue = parseFloat(e.target.value);
                  handleAssumptionChange("ramps", ramps);
                }}
              />
              <Input
                type="number"
                placeholder="End Value"
                value={assumptions.ramps?.[0]?.endValue}
                onChange={(e) => {
                  const ramps = [...(assumptions.ramps || [])];
                  if (!ramps[0]) ramps[0] = {} as any;
                  ramps[0].endValue = parseFloat(e.target.value);
                  handleAssumptionChange("ramps", ramps);
                }}
              />
            </div>
          </div>
        </div>

        <Button 
          className="mt-6"
          onClick={generateScenarios}
        >
          Generate Scenarios
        </Button>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow">
        <CashflowDashboard
          scenarios={scenarios}
          onScenarioSelect={setSelectedScenario}
        />
      </div>
    </div>
  );
};

// Helper functions for metrics calculations
const calculateWAF = (vector: number[]): number => {
  if (!vector.length) return 0;
  let sum = 0;
  let weightedSum = 0;
  vector.forEach((value, index) => {
    sum += value;
    weightedSum += value * (index + 1);
  });
  return sum > 0 ? weightedSum / sum / 12 : 0; // Convert to years
};

const calculateModifiedDuration = (vector: number[]): number => {
  // Simplified duration calculation
  return vector.length > 0 ? vector.length / 24 : 0; // Rough estimate in years
};

