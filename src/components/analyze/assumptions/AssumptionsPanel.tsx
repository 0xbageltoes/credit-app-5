import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="defaults" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="defaults">Defaults</TabsTrigger>
            <TabsTrigger value="prepayment">Prepayment</TabsTrigger>
            <TabsTrigger value="seasonality">Seasonality</TabsTrigger>
          </TabsList>
          
          <TabsContent value="defaults">
            <Card>
              <CardHeader>
                <CardTitle>Default Assumptions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <DefaultAssumptions form={form} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prepayment">
            <Card>
              <CardHeader>
                <CardTitle>Prepayment Assumptions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <PrepaymentAssumptions form={form} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seasonality">
            <Card>
              <CardHeader>
                <CardTitle>Seasonality Adjustments</CardTitle>
              </CardHeader>
              <CardContent>
                <SeasonalityAssumptions form={form} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button type="submit" className="w-full">
          Update Assumptions
        </Button>
      </form>
    </Form>
  );
};