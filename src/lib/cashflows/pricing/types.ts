export type PricingMethod = 'Price' | 'Yield' | 'Spread' | 'DiscountMargin';
export type YieldBasis = 'BondEquivalent' | 'Annual' | 'SemiAnnual' | 'Monthly';

export interface PricingConfig {
  method: PricingMethod;
  value: number;
  yieldBasis: YieldBasis; 
  accrued: number;
  baseRateCurve?: number[];
  discountCurve?: number[];
}

export interface PricingResult {
  price: number;  // per 100
  yield: number;  // %
  spread: number; // bps
  discountMargin: number; // bps
  accrued: number;
  modifiedDuration: number;
  modifiedConvexity: number;
  effectiveDuration: number;
  effectiveConvexity: number;
  spreadDuration: number;
}