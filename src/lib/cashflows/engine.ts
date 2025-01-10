import { LoanCharacteristics, ScenarioAssumptions, CashflowPeriod, CashflowResult } from './types';
import { calculateAmortization, calculatePrepayment, calculateDefault } from './utils';

export class CashflowEngine {
  private loan: LoanCharacteristics;
  private assumptions: ScenarioAssumptions;
  
  constructor(loan: LoanCharacteristics, assumptions: ScenarioAssumptions) {
    this.loan = loan;
    this.assumptions = assumptions;
  }

  public generateCashflows(): CashflowResult {
    const periods: CashflowPeriod[] = [];
    let currentBalance = this.loan.currentBalance;
    
    for (let period = 1; period <= this.loan.remainingTerm; period++) {
      // Calculate scheduled amortization
      const scheduled = calculateAmortization(
        currentBalance,
        this.loan.grossCoupon,
        this.loan.remainingTerm - period + 1
      );

      // Calculate prepayments
      const prepayment = calculatePrepayment(
        currentBalance,
        this.assumptions.prepayRate,
        this.assumptions.prepayUnits
      );

      // Calculate defaults/losses
      const defaultAmount = calculateDefault(
        currentBalance,
        this.assumptions.defaultRate,
        this.assumptions.defaultUnits
      );

      const loss = defaultAmount * (this.assumptions.severity / 100);

      // Calculate interest
      const grossInterest = currentBalance * (this.loan.grossCoupon / 12);

      // Update balance
      const endingBalance = currentBalance - scheduled.principal - prepayment - defaultAmount;
      
      periods.push({
        period,
        date: new Date(), // TODO: Add proper date calculation
        beginningBalance: currentBalance,
        scheduledPrincipal: scheduled.principal,
        prepayments: prepayment,
        losses: loss,
        grossInterest,
        netInterest: grossInterest, // TODO: Add interest shortfall calculation
        endingBalance
      });

      currentBalance = endingBalance;
      if (currentBalance <= 0) break;
    }

    return {
      periods,
      metrics: this.calculateMetrics(periods)
    };
  }

  private calculateMetrics(periods: CashflowPeriod[]): CashflowResult['metrics'] {
    // TODO: Implement WAL and duration calculations
    return {
      wal: 0,
      duration: 0,
      modifiedDuration: 0
    };
  }
}