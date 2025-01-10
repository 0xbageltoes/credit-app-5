import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const Analyze = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all investments for the dropdown
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
      
      return data;
    },
  });

  // Fetch selected investment details
  const { data: investmentDetails, isLoading: isLoadingDetails, error: detailsError } = useQuery({
    queryKey: ["investment", selectedInvestment],
    queryFn: async () => {
      if (!selectedInvestment) return null;
      
      const { data, error } = await supabase
        .from("instruments_primary")
        .select("*")
        .eq("investment_id", selectedInvestment)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching investment details:", error);
        toast({
          title: "Error fetching investment details",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
    enabled: !!selectedInvestment,
  });

  const renderDataRow = (label: string, value: any) => (
    <div className="flex py-2 border-b">
      <span className="w-1/3 text-sm text-gray-600">{label}</span>
      <span className="w-2/3 text-sm">{value ?? "N/A"}</span>
    </div>
  );

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
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Select onValueChange={(value) => setSelectedInvestment(value)}>
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
              <SelectItem 
                key={investment.investment_id} 
                value={investment.investment_id}
              >
                {investment.investment_id} - {investment.type || 'N/A'} ({investment.borrower || 'Unknown'})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedInvestment && (isLoadingDetails ? (
        <div className="flex items-center justify-center h-32">Loading investment details...</div>
      ) : detailsError ? (
        <div className="text-red-500">
          Error loading investment details: {(detailsError as Error).message}
        </div>
      ) : investmentDetails && (
        <>
          <h1 className="text-2xl font-semibold mb-6">
            {investmentDetails.investment_id}
          </h1>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="evaluate">Evaluate</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="triggers">Triggers/Cov</TabsTrigger>
              <TabsTrigger value="cashflows">Hist Cash Flows</TabsTrigger>
              <TabsTrigger value="collateral">Collateral Perf</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Loan Details Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                    LOAN DETAILS
                  </h3>
                  {renderDataRow("Current Balance", investmentDetails.amount)}
                  {renderDataRow("Interest Rate", investmentDetails.interest_rate)}
                  {renderDataRow("Stated Rate", investmentDetails.stated_rate)}
                  {renderDataRow("Penalty Rate", investmentDetails.penalty_rate)}
                  {renderDataRow("Rate Type", investmentDetails.rate_type)}
                  {renderDataRow("Rate Floor", investmentDetails.rate_floor)}
                  {renderDataRow("Term", investmentDetails.term)}
                  {renderDataRow("Remaining Term", investmentDetails.remaining_term)}
                  {renderDataRow("Payment Day", investmentDetails.payment_day)}
                </div>

                {/* Collateral Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                    Collateral
                  </h3>
                  {renderDataRow("Collateral", investmentDetails.collateral)}
                  {renderDataRow("Collateral Type", investmentDetails.collateral_type)}
                  {renderDataRow("Lien Status", investmentDetails.lien_status)}
                  {renderDataRow("Lien Jurisdiction", investmentDetails.lien_jurisdiction)}
                </div>

                {/* Servicing Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                    Servicing
                  </h3>
                  {renderDataRow("Servicer", investmentDetails.servicer)}
                  {renderDataRow("Subservicer", investmentDetails.subservicer)}
                  {renderDataRow("Originator", investmentDetails.originator)}
                  {renderDataRow("Originator Parent", investmentDetails.originator_parent)}
                  {renderDataRow("Channel", investmentDetails.channel)}
                </div>

                {/* Status & Dates Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                    Status & Dates
                  </h3>
                  {renderDataRow("Status", investmentDetails.status)}
                  {renderDataRow("Start Date", investmentDetails.start_date)}
                  {renderDataRow("Maturity Date", investmentDetails.maturity_date)}
                  {renderDataRow("Next Payment", investmentDetails.next_payment_date)}
                  {renderDataRow("Origination Date", investmentDetails.origination_date)}
                  {renderDataRow("Purchase Date", investmentDetails.purchase_date)}
                </div>

                {/* Risk & Modifications Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                    Risk & Modifications
                  </h3>
                  {renderDataRow("Risk Score", investmentDetails.risk_score)}
                  {renderDataRow("Total Modifications", investmentDetails.total_modifications)}
                  {renderDataRow("Modification %", investmentDetails.modification_percent)}
                </div>

                {/* Legal Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                    Legal
                  </h3>
                  {renderDataRow("Agreement Type", investmentDetails.agreement_type)}
                  {renderDataRow("Governing Law", investmentDetails.governing_law)}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evaluate">
              <div className="text-center text-gray-500 py-8">
                Evaluate tab content will be implemented in the next phase
              </div>
            </TabsContent>

            <TabsContent value="market">
              <div className="text-center text-gray-500 py-8">
                Market tab content will be implemented in the next phase
              </div>
            </TabsContent>

            <TabsContent value="triggers">
              <div className="text-center text-gray-500 py-8">
                Triggers/Cov tab content will be implemented in the next phase
              </div>
            </TabsContent>

            <TabsContent value="cashflows">
              <div className="text-center text-gray-500 py-8">
                Historical Cash Flows tab content will be implemented in the next phase
              </div>
            </TabsContent>

            <TabsContent value="collateral">
              <div className="text-center text-gray-500 py-8">
                Collateral Performance tab content will be implemented in the next phase
              </div>
            </TabsContent>
          </Tabs>
        </>
      ))}
    </div>
  );
};

export default Analyze;