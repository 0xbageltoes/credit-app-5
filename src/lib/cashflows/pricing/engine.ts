import { CashflowPeriod, DayCountMethod } from '../types';
import { PricingConfig, PricingResult } from './types';
import { calculateYearFraction } from '../utils';

export class PricingEngine {
  private cashflows: CashflowPeriod[];
  private config: PricingConfig;
  private dayCount: DayCountMethod;

  constructor(
    cashflows: CashflowPeriod[],
    config: PricingConfig,
    dayCount: DayCountMethod
  ) {
    this.cashflows = cashflows;
    this.config = config;
    this.dayCount = dayCount;
  }

  public calculate(): PricingResult {
    switch (this.config.method) {
      case 'Price':
        return this.calculateFromPrice();
      case 'Yield':
        return this.calculateFromYield();
      case 'Spread':
        return this.calculateFromSpread();
      case 'DiscountMargin':
        return this.calculateFromDiscountMargin();
      default:
        throw new Error('Unsupported pricing method');
    }
  }

  private calculateFromPrice(): PricingResult {
    const price = this.config.value;
    const yield_ = this.findYield(price);
    
    return {
      price,
      yield: yield_,
      spread: this.calculateSpread(price),
      discountMargin: this.calculateDiscountMargin(price),
      accrued: this.config.accrued,
      modifiedDuration: this.calculateModifiedDuration(yield_),
      modifiedConvexity: this.calculateModifiedConvexity(yield_),
      effectiveDuration: this.calculateEffectiveDuration(yield_),
      effectiveConvexity: this.calculateEffectiveConvexity(yield_),
      spreadDuration: this.calculateSpreadDuration(yield_)
    };
  }

  private calculateFromYield(): PricingResult {
    const yield_ = this.config.value;
    const price = this.calculatePriceFromYield(yield_);
    
    return {
      price: price * 100,
      yield: yield_,
      spread: this.calculateSpread(price),
      discountMargin: this.calculateDiscountMargin(price),
      accrued: this.config.accrued,
      modifiedDuration: this.calculateModifiedDuration(yield_),
      modifiedConvexity: this.calculateModifiedConvexity(yield_),
      effectiveDuration: this.calculateEffectiveDuration(yield_),
      effectiveConvexity: this.calculateEffectiveConvexity(yield_),
      spreadDuration: this.calculateSpreadDuration(yield_)
    };
  }

  private calculateFromSpread(): PricingResult {
    // TODO: Implement spread-based pricing
    return this.calculateFromYield();
  }

  private calculateFromDiscountMargin(): PricingResult {
    // TODO: Implement discount margin-based pricing
    return this.calculateFromYield();
  }

  private findYield(targetPrice: number): number {
    let yield_ = 5; // Initial guess
    let price = this.calculatePriceFromYield(yield_);
    let iterations = 0;
    const maxIterations = 100;
    const tolerance = 0.0001;

    while (Math.abs(price - targetPrice) > tolerance && iterations < maxIterations) {
      const derivative = this.calculatePriceDerivative(yield_);
      yield_ = yield_ - (price - targetPrice) / derivative;
      price = this.calculatePriceFromYield(yield_);
      iterations++;
    }

    if (iterations === maxIterations) {
      console.warn('Yield calculation did not converge');
    }

    return yield_;
  }

  private calculatePriceDerivative(yield_: number): number {
    const h = 0.0001;
    return (
      this.calculatePriceFromYield(yield_ + h) - 
      this.calculatePriceFromYield(yield_ - h)
    ) / (2 * h);
  }

  private calculateDiscountFactor(rate: number, time: number): number {
    const periodsPerYear = this.getPeriodsPerYear();
    const r = rate / 100 / periodsPerYear;
    return Math.pow(1 + r, -time * periodsPerYear);
  }

  private getPeriodsPerYear(): number {
    switch (this.config.yieldBasis) {
      case 'Annual':
        return 1;
      case 'SemiAnnual':
        return 2;
      case 'Monthly':
        return 12;
      case 'BondEquivalent':
        return 2;
      default:
        return 2;
    }
  }

  private calculateModifiedDuration(yield_: number): number {
    const h = 0.0001;
    const priceUp = this.calculatePriceFromYield(yield_ + h);
    const priceDown = this.calculatePriceFromYield(yield_ - h);
    const price = this.calculatePriceFromYield(yield_);
    
    return -(priceUp - priceDown) / (2 * h * price);
  }

  private calculateModifiedConvexity(yield_: number): number {
    const h = 0.0001;
    const priceUp = this.calculatePriceFromYield(yield_ + h);
    const price = this.calculatePriceFromYield(yield_);
    const priceDown = this.calculatePriceFromYield(yield_ - h);
    
    return (priceUp + priceDown - 2 * price) / (Math.pow(h, 2) * price);
  }

  private calculateEffectiveDuration(yield_: number): number {
    const h = 0.0001;
    const basePrice = this.calculatePriceFromYield(yield_);
    const priceUp = this.calculatePriceWithRateShift(h);
    const priceDown = this.calculatePriceWithRateShift(-h);
    
    return -(priceUp - priceDown) / (2 * h * basePrice);
  }

  private calculateEffectiveConvexity(yield_: number): number {
    const h = 0.0001;
    const basePrice = this.calculatePriceFromYield(yield_);
    const priceUp = this.calculatePriceWithRateShift(h);
    const priceDown = this.calculatePriceWithRateShift(-h);
    
    return (priceUp + priceDown - 2 * basePrice) / (Math.pow(h, 2) * basePrice);
  }

  private calculateSpreadDuration(yield_: number): number {
    const h = 0.0001;
    const baseSpread = this.calculateSpread(this.calculatePriceFromYield(yield_));
    const priceUpSpread = this.calculatePriceFromSpread(baseSpread + h);
    const priceDownSpread = this.calculatePriceFromSpread(baseSpread - h);
    const price = this.calculatePriceFromYield(yield_);
    
    return -(priceUpSpread - priceDownSpread) / (2 * h * price);
  }

  private calculatePriceFromYield(yield_: number): number {
    let price = 0;
    const settleDate = new Date(); // TODO: Get from config

    this.cashflows.forEach(cf => {
      const timeToPayment = calculateYearFraction(
        settleDate,
        cf.paymentDate,
        this.dayCount
      );

      const discountFactor = this.calculateDiscountFactor(yield_, timeToPayment);
      const payment = cf.scheduledPrincipal + cf.netInterest;
      price += payment * discountFactor;
    });

    return price;
  }

  private calculatePriceWithRateShift(shift: number): number {
    // TODO: Implement rate shift logic for effective duration/convexity
    return this.calculatePriceFromYield(this.config.value + shift);
  }

  private calculatePriceFromSpread(spread: number): number {
    // TODO: Implement spread-based pricing
    return this.calculatePriceFromYield(this.config.value + spread / 100);
  }

  private calculateSpread(price: number): number {
    // TODO: Implement spread calculation
    return 0;
  }

  private calculateDiscountMargin(price: number): number {
    // TODO: Implement discount margin calculation
    return 0;
  }
}