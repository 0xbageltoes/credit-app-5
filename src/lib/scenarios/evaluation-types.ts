export type ScenarioType = "CPR" | "CDR" | "Loss Severity" | "Delinquency" | "Interest Rate" | "Draw Rate";

export interface ScenarioConfig {
  type: ScenarioType;
  initialValue: number;
  cpr?: number;
  cprStartMonth?: number;
  ramps: {
    startValue: number;
    endValue: number;
    rampPeriods: number;
    holdPeriods: number;
  }[];
  seasonalAdjustments: {
    [key: number]: number;
  };
  defaultRate?: number;
  severity?: number;
  recoveryLag?: number;
  servicerExpenseRate?: number;
  otherExpenseRate?: number;
  delinquencyRate?: number;
}

export interface CashflowData {
  period: number;
  beginningBalance: number;
  scheduledPrincipal: number;
  scheduledInterest: number;
  prepayments: number;
  defaultedPrincipal: number;
  recoveries: number;
  realizedLoss: number;
  losses: number; // Added this field
  weightedAverageCoupon: number;
  loanCount: number;
  delinquentBalance: number;
  delinquentPercent: number;
  servicerExpenses: number;
  otherExpenses: number;
  cashflowToOtherTranches: number;
  netCashflow: number;
  endingBalance: number;
}

export interface CashflowMetrics {
  waf: number;
  modifiedDuration: number;
  yield: number;
}

export interface ScenarioResult {
  [key: string]: any; // Add index signature for JSON compatibility
  name: string;
  cashflows: CashflowData[];
  metrics: CashflowMetrics;
}