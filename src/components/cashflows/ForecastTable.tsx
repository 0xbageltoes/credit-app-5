import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CashflowData } from "@/lib/scenarios/evaluation-types";
import { format } from "date-fns";

interface ForecastTableProps {
  cashflows: CashflowData[];
  startDate: Date;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

export const ForecastTable = ({ cashflows, startDate }: ForecastTableProps) => {
  return (
    <div className="relative overflow-auto border rounded-md">
      <div className="overflow-x-auto" style={{ maxHeight: '600px' }}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white border-b">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Period</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Date</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Beginning Balance</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Scheduled Principal</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Scheduled Interest</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Prepayments</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Defaulted Principal</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Recoveries</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Realized Loss</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">WAC</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Loan Count</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Delinquent Balance</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Delinquent %</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Servicer Expenses</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Other Expenses</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Other Tranche CF</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Net Cashflow</TableHead>
              <TableHead className="h-6 px-2 text-xs whitespace-nowrap">Ending Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cashflows.map((cf) => (
              <TableRow key={cf.period} className="hover:bg-muted/30">
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{cf.period}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">
                  {format(new Date(startDate.getTime() + (cf.period - 1) * 30 * 24 * 60 * 60 * 1000), 'MMM yyyy')}
                </TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.beginningBalance)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.scheduledPrincipal)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.scheduledInterest)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.prepayments)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.defaultedPrincipal)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.recoveries)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.realizedLoss)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatPercent(cf.weightedAverageCoupon)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{cf.loanCount}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.delinquentBalance)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatPercent(cf.delinquentPercent)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.servicerExpenses)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.otherExpenses)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.cashflowToOtherTranches)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.netCashflow)}</TableCell>
                <TableCell className="h-6 px-2 py-1 text-xs whitespace-nowrap">{formatCurrency(cf.endingBalance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};