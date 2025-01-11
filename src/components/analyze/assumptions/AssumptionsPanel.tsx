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
  cpr: z.number().min(0).max(100),
  cprStartMonth: z.number().min(1),
  seasonalAdjustments: z.record(z.string(), z.number()),
  defaultRate: z.number().min(0).max(100).optional(),
  severity: z.number().min(0).max(100).optional(),
  recoveryLag: z.number().min(0).optional(),
});

interface AssumptionsPanelProps {
  onSubmit: (values: ScenarioConfig) => void;
  isLoading?: boolean;
  defaultValues?: Partial<ScenarioConfig>;
}

export const AssumptionsPanel = ({
  onSubmit,
  isLoading,
  defaultValues,
}: AssumptionsPanelProps) => {
  const form = useForm<ScenarioConfig>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpr: defaultValues?.cpr ?? 0,
      cprStartMonth: defaultValues?.cprStartMonth ?? 1,
      seasonalAdjustments: defaultValues?.seasonalAdjustments ?? {},
      defaultRate: defaultValues?.defaultRate ?? 0,
      severity: defaultValues?.severity ?? 0,
      recoveryLag: defaultValues?.recoveryLag ?? 0,
    },
  });

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
                <DefaultAssumptions form={form} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prepayment">
            <Card>
              <CardHeader>
                <CardTitle>Prepayment Assumptions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <PrepaymentAssumptions form={form} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seasonality">
            <Card>
              <CardHeader>
                <CardTitle>Seasonality Adjustments</CardTitle>
              </CardHeader>
              <CardContent>
                <SeasonalityAssumptions form={form} isLoading={isLoading} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Updating..." : "Update Assumptions"}
        </Button>
      </form>
    </Form>
  );
};