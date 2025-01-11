export type ScenarioType = "CPR" | "CDR" | "Loss Severity" | "Delinquency" | "Interest Rate" | "Draw Rate";

export interface ScenarioConfig {
  type: ScenarioType;
  initialValue: number;
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
}

export interface CashflowData {
  period: number;
  scheduledPrincipal: number;
  scheduledInterest: number;
  prepayments: number;
  losses: number;
  recoveries: number;
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