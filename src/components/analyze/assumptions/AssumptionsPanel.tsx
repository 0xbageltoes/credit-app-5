import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScenarioConfig } from "@/lib/scenarios/evaluation-types";

interface AssumptionsPanelProps {
  assumptions: ScenarioConfig;
  onAssumptionsChange: (assumptions: ScenarioConfig) => void;
  onGenerateScenarios: () => void;
  investmentDetails: any;
}

export const AssumptionsPanel = ({
  assumptions,
  onAssumptionsChange,
  onGenerateScenarios,
  investmentDetails,
}: AssumptionsPanelProps) => {
  const handleAssumptionChange = (field: string, value: any) => {
    onAssumptionsChange({
      ...assumptions,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-2">Loan Parameters</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Current Balance:</span>
              <span>{investmentDetails?.amount || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest Rate:</span>
              <span>{investmentDetails?.interest_rate || 'N/A'}%</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Term:</span>
              <span>{investmentDetails?.remaining_term || 'N/A'} months</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-2">Prepayment Assumptions</h3>
          <div className="space-y-2">
            <div>
              <Label className="text-xs">Type</Label>
              <select
                value={assumptions.type}
                onChange={(e) => handleAssumptionChange("type", e.target.value)}
                className="w-full text-xs rounded-md border border-input bg-background px-2 py-1"
              >
                <option value="CPR">CPR</option>
                <option value="SMM">SMM</option>
                <option value="PSA">PSA</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Initial Value (%)</Label>
              <Input
                type="number"
                value={assumptions.initialValue}
                onChange={(e) => handleAssumptionChange("initialValue", parseFloat(e.target.value))}
                className="h-7 text-xs"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-2">Ramp Configuration</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Start Value (%)</Label>
                <Input
                  type="number"
                  value={assumptions.ramps?.[0]?.startValue}
                  onChange={(e) => {
                    const ramps = [...(assumptions.ramps || [])];
                    if (!ramps[0]) ramps[0] = {} as any;
                    ramps[0].startValue = parseFloat(e.target.value);
                    handleAssumptionChange("ramps", ramps);
                  }}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">End Value (%)</Label>
                <Input
                  type="number"
                  value={assumptions.ramps?.[0]?.endValue}
                  onChange={(e) => {
                    const ramps = [...(assumptions.ramps || [])];
                    if (!ramps[0]) ramps[0] = {} as any;
                    ramps[0].endValue = parseFloat(e.target.value);
                    handleAssumptionChange("ramps", ramps);
                  }}
                  className="h-7 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Ramp Periods</Label>
                <Input
                  type="number"
                  value={assumptions.ramps?.[0]?.rampPeriods}
                  onChange={(e) => {
                    const ramps = [...(assumptions.ramps || [])];
                    if (!ramps[0]) ramps[0] = {} as any;
                    ramps[0].rampPeriods = parseFloat(e.target.value);
                    handleAssumptionChange("ramps", ramps);
                  }}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Hold Periods</Label>
                <Input
                  type="number"
                  value={assumptions.ramps?.[0]?.holdPeriods}
                  onChange={(e) => {
                    const ramps = [...(assumptions.ramps || [])];
                    if (!ramps[0]) ramps[0] = {} as any;
                    ramps[0].holdPeriods = parseFloat(e.target.value);
                    handleAssumptionChange("ramps", ramps);
                  }}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-2">Seasonality</h3>
          <div className="grid grid-cols-4 gap-2">
            {[3, 4, 5, 6, 7, 8, 9].map((month) => (
              <div key={month}>
                <Label className="text-xs">Month {month}</Label>
                <Input
                  type="number"
                  value={assumptions.seasonalAdjustments?.[month] || 1}
                  onChange={(e) => {
                    const seasonalAdjustments = { ...(assumptions.seasonalAdjustments || {}) };
                    seasonalAdjustments[month] = parseFloat(e.target.value);
                    handleAssumptionChange("seasonalAdjustments", seasonalAdjustments);
                  }}
                  className="h-7 text-xs"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-2">Default Assumptions</h3>
          <div className="space-y-2">
            <div>
              <Label className="text-xs">CDR (%)</Label>
              <Input
                type="number"
                value={assumptions.defaultRate || 0}
                onChange={(e) => handleAssumptionChange("defaultRate", parseFloat(e.target.value))}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Severity (%)</Label>
              <Input
                type="number"
                value={assumptions.severity || 0}
                onChange={(e) => handleAssumptionChange("severity", parseFloat(e.target.value))}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Lag (months)</Label>
              <Input
                type="number"
                value={assumptions.recoveryLag || 0}
                onChange={(e) => handleAssumptionChange("recoveryLag", parseFloat(e.target.value))}
                className="h-7 text-xs"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold mb-2">Actions</h3>
            <p className="text-xs text-gray-600 mb-4">
              Generate scenarios using the configured assumptions and loan parameters
            </p>
          </div>
          <Button 
            onClick={onGenerateScenarios}
            className="w-full"
          >
            Generate Scenarios
          </Button>
        </Card>
      </div>
    </div>
  );
};