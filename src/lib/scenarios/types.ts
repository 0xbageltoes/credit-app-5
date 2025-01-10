export type ScenarioType = 'CPR' | 'CDR' | 'Loss Severity' | 'Delinquency' | 'Interest Rate' | 'Draw Rate';

export interface ScenarioPoint {
  period: number;
  value: number;
}

export interface ScenarioRamp {
  startValue: number;
  endValue: number;
  rampPeriods: number;
  holdPeriods?: number;
}

export interface ScenarioVector {
  type: ScenarioType;
  points: ScenarioPoint[];
}

export interface ScenarioConfig {
  type: ScenarioType;
  initialValue?: number;
  ramps?: ScenarioRamp[];
  vectors?: ScenarioPoint[];
  conditionalLogic?: string;
  seasonalAdjustments?: {[month: number]: number};
  shock?: {
    timing: number;
    magnitude: number;
    duration?: number;
  };
}