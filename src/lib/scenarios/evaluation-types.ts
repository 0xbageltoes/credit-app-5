import { ScenarioType } from "./types";

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
}

export interface CashflowMetrics {
  waf: number;
  modifiedDuration: number;
  yield: number;
}

export interface ScenarioResult {
  name: string;
  cashflows: {
    period: number;
    scheduledPrincipal: number;
    scheduledInterest: number;
    prepayments: number;
    losses: number;
    recoveries: number;
  }[];
  metrics: CashflowMetrics;
}