import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface InvestmentSelectorProps {
  onSelect: (value: string) => void;
}

export const InvestmentSelector = ({ onSelect }: InvestmentSelectorProps) => {
  const { toast } = useToast();

  const { data: investments, isLoading: isLoadingInvestments, error: investmentsError } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instruments_primary")
        .select("investment_id, type, borrower")
        .order("investment_id");
      
      if (error) {
        console.error("Error fetching investments:", error);
        toast({
          title: "Error fetching investments",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log("No investments found");
        return [];
      }
      
      return data.filter(inv => inv.investment_id && inv.investment_id.trim() !== '');
    },
  });

  // Show loading state
  if (isLoadingInvestments) {
    return <div className="flex items-center justify-center h-full">Loading investments...</div>;
  }

  // Show error state
  if (investmentsError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500">
        <p>Error loading investments</p>
        <p className="text-sm">{(investmentsError as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-[300px]">
          <SelectValue 
            placeholder={
              isLoadingInvestments 
                ? "Loading..." 
                : investments && investments.length > 0 
                  ? "Select Investment"
                  : "No investments available"
            } 
          />
        </SelectTrigger>
        <SelectContent>
          {investments?.map((investment) => (
            investment.investment_id && (
              <SelectItem 
                key={investment.investment_id} 
                value={investment.investment_id}
              >
                {investment.investment_id} - {investment.type || 'N/A'} ({investment.borrower || 'Unknown'})
              </SelectItem>
            )
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};