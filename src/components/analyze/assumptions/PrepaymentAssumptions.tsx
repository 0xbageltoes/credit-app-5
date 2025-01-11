import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ScenarioConfig } from "@/lib/scenarios/evaluation-types";

interface PrepaymentAssumptionsProps {
  form: UseFormReturn<ScenarioConfig>;
}

export const PrepaymentAssumptions = ({ form }: PrepaymentAssumptionsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="cpr"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPR (%)</FormLabel>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseFloat(e.target.value))}
            />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cprStartMonth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPR Start Month</FormLabel>
            <Input
              type="number"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
          </FormItem>
        )}
      />
    </>
  );
};