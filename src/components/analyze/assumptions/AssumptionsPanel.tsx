import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScenarioConfig, ScenarioType } from "@/lib/scenarios/evaluation-types";

interface AssumptionsPanelProps {
  assumptions: ScenarioConfig;
  onAssumptionsChange: (assumptions: ScenarioConfig) => void;
  onGenerateScenarios: () => void;
}

export const AssumptionsPanel = ({
  assumptions,
  onAssumptionsChange,
  onGenerateScenarios,
}: AssumptionsPanelProps) => {
  const handleAssumptionChange = (field: string, value: any) => {
    onAssumptionsChange({
      ...assumptions,
      [field]: value,
    });
  };

  return (
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
        onClick={onGenerateScenarios}
      >
        Generate Scenarios
      </Button>
    </div>
  );
};