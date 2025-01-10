import { addMonths } from 'date-fns';
import { 
  LoanCharacteristics, 
  ScenarioAssumptions, 
  CashflowPeriod,
  CashflowResult,
  InterestConfig
} from './types';
import { 
  calculateAmortization, 
  calculatePrepayment, 
  calculateDefault,
  calculateDateAdjustments,
  calculateYearFraction 
} from './utils';

export class CashflowEngine {
  private loan: LoanCharacteristics;
  private assumptions: ScenarioAssumptions;
  private interestConfig: InterestConfig;
  
  constructor(
    loan: LoanCharacteristics, 
    assumptions: ScenarioAssumptions,
    interestConfig: InterestConfig
  ) {
    this.loan = loan;
    this.assumptions = assumptions;
    this.interestConfig = interestConfig;
  }

  public generateCashflows(): CashflowResult {
    const periods: CashflowPeriod[] = [];
    let currentBalance = this.loan.currentBalance;
    let accumulatedShortfall = this.interestConfig.accruedInterest;
    let currentDate = this.loan.nextPaymentDate;
    
    while (currentBalance > 0 && currentDate <= this.loan.maturityDate) {
      const periodStartDate = addMonths(currentDate, -1);
      const periodEndDate = currentDate;
      const paymentDate = calculateDateAdjustments(
        currentDate,
        this.loan.dateConfig.businessDayConvention
      );

      // Calculate year fraction for interest
      const yearFraction = calculateYearFraction(
        periodStartDate,
        periodEndDate,
        this.loan.dateConfig.dayCount
      );

      // Calculate interest rate for period
      const periodRate = this.calculatePeriodRate(periodStartDate);

      // Calculate scheduled interest
      const scheduledInterest = currentBalance * periodRate * yearFraction;

      // Calculate scheduled principal
      const scheduled = calculateAmortization(
        currentBalance,
        periodRate,
        this.getRemainingPayments(currentDate)
      );

      // Calculate prepayments
      const prepayment = calculatePrepayment(
        currentBalance,
        this.assumptions.prepayRate,
        this.assumptions.prepayUnits
      );

      // Calculate defaults and losses
      const defaultAmount = calculateDefault(
        currentBalance,
        this.assumptions.defaultRate,
        this.assumptions.defaultUnits
      );

      const loss = defaultAmount * (this.assumptions.severity / 100);

      // Calculate interest collections and shortfalls
      const defaultedInterest = defaultAmount * periodRate * yearFraction * 
                              (1 - this.assumptions.severity / 100);

      let interestCollected = Math.min(
        scheduledInterest,
        scheduledInterest - defaultedInterest
      );

      let interestShortfall = scheduledInterest - interestCollected;
      let shortfallRecovered = 0;

      // Handle shortfall recovery
      if (accumulatedShortfall > 0 && interestCollected > 0) {
        if (this.interestConfig.shortfallRecoveryPriority === 'ShortfallFirst') {
          shortfallRecovered = Math.min(accumulatedShortfall, interestCollected);
          interestCollected -= shortfallRecovered;
        } else {
          const excessInterest = Math.max(0, interestCollected - scheduledInterest);
          shortfallRecovered = Math.min(accumulatedShortfall, excessInterest);
        }
        accumulatedShortfall = accumulatedShortfall - shortfallRecovered + interestShortfall;
      }

      // Update balance
      const endingBalance = currentBalance - scheduled.principal - prepayment - defaultAmount;
      
      // Create period
      const period: CashflowPeriod = {
        period: periods.length + 1,
        startDate: periodStartDate,
        endDate: periodEndDate,
        paymentDate,
        daysInPeriod: yearFraction * 360,
        yearFraction,
        beginningBalance: currentBalance,
        scheduledPrincipal: scheduled.principal,
        prepayments: prepayment,
        losses: loss,
        grossInterest: scheduledInterest,
        netInterest: interestCollected,
        interestShortfall,
        accumulatedShortfall,
        shortfallRecovered,
        defaultedInterest,
        endingBalance
      };

      periods.push(period);

      // Setup next period
      currentBalance = endingBalance;
      currentDate = addMonths(currentDate, 1);
    }

    return {
      periods,
      metrics: this.calculateMetrics(periods)
    };
  }

  private calculatePeriodRate(date: Date): number {
    if (this.loan.isFixedRate) {
      return this.loan.grossCoupon;
    }
    
    // TODO: Implement floating rate calculation based on forward curve
    return this.loan.grossCoupon;
  }

  private getRemainingPayments(currentDate: Date): number {
    // Calculate months between current date and maturity
    const months = (this.loan.maturityDate.getFullYear() - currentDate.getFullYear()) * 12 +
                  (this.loan.maturityDate.getMonth() - currentDate.getMonth());
    
    switch (this.loan.paymentFrequency) {
      case 'Monthly':
        return months;
      case 'Quarterly':
        return Math.ceil(months / 3);
      case 'SemiAnnual':
        return Math.ceil(months / 6);
      case 'Annual':
        return Math.ceil(months / 12);
      default:
        return months;
    }
  }

  private calculateMetrics(periods: CashflowPeriod[]): CashflowResult['metrics'] {
    return {
      wal: this.calculateWAL(periods),
      duration: this.calculateDuration(periods),
      modifiedDuration: this.calculateModifiedDuration(periods)
    };
  }

  private calculateWAL(periods: CashflowPeriod[]): number {
    let weightedSum = 0;
    let totalPrincipal = 0;
    
    periods.forEach(period => {
      const principal = period.scheduledPrincipal + period.prepayments;
      const timeInYears = period.yearFraction * period.period;
      
      weightedSum += principal * timeInYears;
      totalPrincipal += principal;
    });

    return totalPrincipal > 0 ? weightedSum / totalPrincipal : 0;
  }

  private calculateDuration(periods: CashflowPeriod[]): number {
    // TODO: Implement Macaulay duration calculation
    return 0;
  }

  private calculateModifiedDuration(periods: CashflowPeriod[]): number {
    // TODO: Implement Modified duration calculation
    return 0;
  }
}