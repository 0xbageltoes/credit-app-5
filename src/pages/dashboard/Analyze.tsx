import { useState } from "react";
import { InvestmentSelector } from "@/components/analyze/InvestmentSelector";
import { InvestmentDetails } from "@/components/analyze/InvestmentDetails";

const Analyze = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-6">
      <InvestmentSelector onSelect={(value) => setSelectedInvestment(value)} />
      {selectedInvestment && <InvestmentDetails investmentId={selectedInvestment} />}
    </div>
  );
};

export default Analyze;