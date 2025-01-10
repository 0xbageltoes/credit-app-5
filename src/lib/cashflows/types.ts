export interface LoanCharacteristics {
  currentBalance: number;
  originalBalance: number;
  grossCoupon: number;
  remainingTerm: number;
  originalTerm: number;
  paymentFrequency: 'Monthly' | 'Quarterly' | 'SemiAnnual' | 'Annual';
}

export interface ScenarioAssumptions {
  prepayUnits: 'CPR' | 'SMM' | 'PSA';
  prepayRate: number;
  defaultUnits: 'CDR' | 'MDR';
  defaultRate: number;
  severity: number;
  recoveryLag: number;
  interestShortfall: boolean;
}

export interface CashflowPeriod {
  period: number;
  date: Date;
  beginningBalance: number;
  scheduledPrincipal: number; 
  prepayments: number;
  losses: number;
  grossInterest: number;
  netInterest: number;
  endingBalance: number;
}

export interface CashflowResult {
  periods: CashflowPeriod[];
  metrics: {
    wal: number;
    duration: number;
    modifiedDuration: number;
  };
}