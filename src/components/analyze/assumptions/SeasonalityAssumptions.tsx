import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ScenarioConfig } from "@/lib/scenarios/evaluation-types";

interface SeasonalityAssumptionsProps {
  form: UseFormReturn<ScenarioConfig>;
  isLoading?: boolean;
}

export const SeasonalityAssumptions = ({ form, isLoading }: SeasonalityAssumptionsProps) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-3 gap-4">
      {months.map((month) => (
        <FormField
          key={month}
          control={form.control}
          name={`seasonalAdjustments.${month}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month {month}</FormLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                disabled={isLoading}
              />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};