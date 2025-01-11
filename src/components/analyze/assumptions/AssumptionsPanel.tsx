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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
        <Card className="p-0.5">
          <CardContent className="space-y-1 pt-0">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <div className="col-span-2">
                <h4 className="text-[10px] font-medium mb-0.5">Default Assumptions</h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <DefaultAssumptions form={form} />
                </div>
              </div>
              
              <div className="col-span-2">
                <h4 className="text-[10px] font-medium mb-0.5">Prepayment Assumptions</h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <PrepaymentAssumptions form={form} />
                </div>
              </div>
              
              <div className="col-span-2">
                <h4 className="text-[10px] font-medium mb-0.5">Seasonality Adjustments</h4>
                <SeasonalityAssumptions form={form} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full text-[10px] h-6 mt-1">
          Update Assumptions
        </Button>
      </form>
    </Form>
  );
};