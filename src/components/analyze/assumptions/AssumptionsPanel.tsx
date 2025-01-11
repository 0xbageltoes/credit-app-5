import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { ScenarioConfig } from "@/lib/scenarios/evaluation-types";
import { DefaultAssumptions } from "./DefaultAssumptions";
import { PrepaymentAssumptions } from "./PrepaymentAssumptions";
import { SeasonalityAssumptions } from "./SeasonalityAssumptions";

const formSchema = z.object({
  type: z.string(),
  initialValue: z.number(),
  cpr: z.number().min(0).max(100).optional(),
  cprStartMonth: z.number().min(1).optional(),
  defaultRate: z.number().min(0).max(100).optional(),
  severity: z.number().min(0).max(100).optional(),
  recoveryLag: z.number().min(0).optional(),
  seasonalAdjustments: z.record(z.string(), z.number()),
  ramps: z.array(z.object({
    startValue: z.number(),
    endValue: z.number(),
    rampPeriods: z.number(),
    holdPeriods: z.number()
  }))
});

interface AssumptionsPanelProps {
  assumptions: ScenarioConfig;
  onAssumptionsChange: (values: ScenarioConfig) => void;
  onGenerateScenarios: () => void;
  investmentDetails: any;
}

export const AssumptionsPanel = ({
  assumptions,
  onAssumptionsChange,
  onGenerateScenarios,
  investmentDetails,
}: AssumptionsPanelProps) => {
  const form = useForm<ScenarioConfig>({
    resolver: zodResolver(formSchema),
    defaultValues: assumptions
  });

  const onSubmit = (values: ScenarioConfig) => {
    onAssumptionsChange(values);
    onGenerateScenarios();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card className="p-1">
          <CardContent className="space-y-2 pt-0">
            <div className="grid gap-2">
              <div className="space-y-1">
                <h4 className="text-xs font-medium">Default Assumptions</h4>
                <DefaultAssumptions form={form} />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xs font-medium">Prepayment Assumptions</h4>
                <PrepaymentAssumptions form={form} />
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xs font-medium">Seasonality Adjustments</h4>
                <SeasonalityAssumptions form={form} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full text-xs h-8">
          Update Assumptions
        </Button>
      </form>
    </Form>
  );
};