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
    <ScrollArea className="h-[500px] rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Beginning Balance</TableHead>
            <TableHead>Scheduled Principal</TableHead>
            <TableHead>Scheduled Interest</TableHead>
            <TableHead>Prepayments</TableHead>
            <TableHead>Defaulted Principal</TableHead>
            <TableHead>Recoveries</TableHead>
            <TableHead>Realized Loss</TableHead>
            <TableHead>WAC</TableHead>
            <TableHead>Loan Count</TableHead>
            <TableHead>Delinquent Balance</TableHead>
            <TableHead>Delinquent %</TableHead>
            <TableHead>Servicer Expenses</TableHead>
            <TableHead>Other Expenses</TableHead>
            <TableHead>Other Tranche CF</TableHead>
            <TableHead>Net Cashflow</TableHead>
            <TableHead>Ending Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashflows.map((cf, index) => (
            <TableRow key={cf.period}>
              <TableCell>{cf.period}</TableCell>
              <TableCell>
                {format(new Date(startDate.getTime() + index * 30 * 24 * 60 * 60 * 1000), 'MMM yyyy')}
              </TableCell>
              <TableCell>{formatCurrency(cf.beginningBalance)}</TableCell>
              <TableCell>{formatCurrency(cf.scheduledPrincipal)}</TableCell>
              <TableCell>{formatCurrency(cf.scheduledInterest)}</TableCell>
              <TableCell>{formatCurrency(cf.prepayments)}</TableCell>
              <TableCell>{formatCurrency(cf.defaultedPrincipal)}</TableCell>
              <TableCell>{formatCurrency(cf.recoveries)}</TableCell>
              <TableCell>{formatCurrency(cf.realizedLoss)}</TableCell>
              <TableCell>{formatPercent(cf.weightedAverageCoupon)}</TableCell>
              <TableCell>{cf.loanCount}</TableCell>
              <TableCell>{formatCurrency(cf.delinquentBalance)}</TableCell>
              <TableCell>{formatPercent(cf.delinquentPercent)}</TableCell>
              <TableCell>{formatCurrency(cf.servicerExpenses)}</TableCell>
              <TableCell>{formatCurrency(cf.otherExpenses)}</TableCell>
              <TableCell>{formatCurrency(cf.cashflowToOtherTranches)}</TableCell>
              <TableCell>{formatCurrency(cf.netCashflow)}</TableCell>
              <TableCell>{formatCurrency(cf.endingBalance)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};