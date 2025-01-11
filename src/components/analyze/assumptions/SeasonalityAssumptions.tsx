import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ScenarioConfig } from "@/lib/scenarios/evaluation-types";

interface SeasonalityAssumptionsProps {
  form: UseFormReturn<ScenarioConfig>;
}

export const SeasonalityAssumptions = ({ form }: SeasonalityAssumptionsProps) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-1">
      {months.map((month) => (
        <FormField
          key={month}
          control={form.control}
          name="seasonalAdjustments"
          render={({ field }) => (
            <FormItem className="space-y-0.5">
              <FormLabel className="text-[10px]">Month {month}</FormLabel>
              <Input
                type="number"
                className="h-6 text-[11px]"
                value={field.value?.[month] || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  const newAdjustments = { ...field.value };
                  if (!isNaN(value)) {
                    newAdjustments[month] = value;
                  } else {
                    delete newAdjustments[month];
                  }
                  field.onChange(newAdjustments);
                }}
              />
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};