import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ScenarioConfig } from "@/lib/scenarios/evaluation-types";

interface DefaultAssumptionsProps {
  form: UseFormReturn<ScenarioConfig>;
  isLoading?: boolean;
}

export const DefaultAssumptions = ({ form, isLoading }: DefaultAssumptionsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="defaultRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Default Rate (%)</FormLabel>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              disabled={isLoading}
            />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="severity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loss Severity (%)</FormLabel>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              disabled={isLoading}
            />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="recoveryLag"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recovery Lag (months)</FormLabel>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
              disabled={isLoading}
            />
          </FormItem>
        )}
      />
    </>
  );
};