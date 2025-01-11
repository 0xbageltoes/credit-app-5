import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ScenarioConfig } from "@/lib/scenarios/evaluation-types";

interface DefaultAssumptionsProps {
  form: UseFormReturn<ScenarioConfig>;
}

export const DefaultAssumptions = ({ form }: DefaultAssumptionsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="defaultRate"
        render={({ field }) => (
          <FormItem className="space-y-0.5">
            <FormLabel className="text-[10px]">Default Rate (%)</FormLabel>
            <Input
              type="number"
              {...field}
              className="h-6 text-[11px]"
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="severity"
        render={({ field }) => (
          <FormItem className="space-y-0.5">
            <FormLabel className="text-[10px]">Loss Severity (%)</FormLabel>
            <Input
              type="number"
              {...field}
              className="h-6 text-[11px]"
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="recoveryLag"
        render={({ field }) => (
          <FormItem className="space-y-0.5">
            <FormLabel className="text-[10px]">Recovery Lag (months)</FormLabel>
            <Input
              type="number"
              {...field}
              className="h-6 text-[11px]"
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          </FormItem>
        )}
      />
    </>
  );
};