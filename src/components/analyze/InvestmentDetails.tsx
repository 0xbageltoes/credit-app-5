import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataRow } from "./DataRow";

interface InvestmentDetailsProps {
  investmentId: string;
}

export const InvestmentDetails = ({ investmentId }: InvestmentDetailsProps) => {
  const { toast } = useToast();

  const { data: investmentDetails, isLoading, error } = useQuery({
    queryKey: ["investment", investmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("instruments_primary")
        .select("*")
        .eq("investment_id", investmentId)
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
    enabled: !!investmentId,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-32">Loading investment details...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading investment details: {(error as Error).message}
      </div>
    );
  }

  if (!investmentDetails) {
    return null;
  }

  return (
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
              <DataRow label="Current Balance" value={investmentDetails.amount} />
              <DataRow label="Interest Rate" value={investmentDetails.interest_rate} />
              <DataRow label="Stated Rate" value={investmentDetails.stated_rate} />
              <DataRow label="Penalty Rate" value={investmentDetails.penalty_rate} />
              <DataRow label="Rate Type" value={investmentDetails.rate_type} />
              <DataRow label="Rate Floor" value={investmentDetails.rate_floor} />
              <DataRow label="Term" value={investmentDetails.term} />
              <DataRow label="Remaining Term" value={investmentDetails.remaining_term} />
              <DataRow label="Payment Day" value={investmentDetails.payment_day} />
            </div>

            {/* Collateral Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                Collateral
              </h3>
              <DataRow label="Collateral" value={investmentDetails.collateral} />
              <DataRow label="Collateral Type" value={investmentDetails.collateral_type} />
              <DataRow label="Lien Status" value={investmentDetails.lien_status} />
              <DataRow label="Lien Jurisdiction" value={investmentDetails.lien_jurisdiction} />
            </div>

            {/* Servicing Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                Servicing
              </h3>
              <DataRow label="Servicer" value={investmentDetails.servicer} />
              <DataRow label="Subservicer" value={investmentDetails.subservicer} />
              <DataRow label="Originator" value={investmentDetails.originator} />
              <DataRow label="Originator Parent" value={investmentDetails.originator_parent} />
              <DataRow label="Channel" value={investmentDetails.channel} />
            </div>

            {/* Status & Dates Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                Status & Dates
              </h3>
              <DataRow label="Status" value={investmentDetails.status} />
              <DataRow label="Start Date" value={investmentDetails.start_date} />
              <DataRow label="Maturity Date" value={investmentDetails.maturity_date} />
              <DataRow label="Next Payment" value={investmentDetails.next_payment_date} />
              <DataRow label="Origination Date" value={investmentDetails.origination_date} />
              <DataRow label="Purchase Date" value={investmentDetails.purchase_date} />
            </div>

            {/* Risk & Modifications Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                Risk & Modifications
              </h3>
              <DataRow label="Risk Score" value={investmentDetails.risk_score} />
              <DataRow label="Total Modifications" value={investmentDetails.total_modifications} />
              <DataRow label="Modification %" value={investmentDetails.modification_percent} />
            </div>

            {/* Legal Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase text-gray-600 mb-4">
                Legal
              </h3>
              <DataRow label="Agreement Type" value={investmentDetails.agreement_type} />
              <DataRow label="Governing Law" value={investmentDetails.governing_law} />
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
  );
};