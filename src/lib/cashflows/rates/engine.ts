import { RateCurve, ForwardRates } from './types';

export class RateEngine {
  private curves: Map<string, RateCurve> = new Map();
  private forwardRates: Map<string, ForwardRates> = new Map();

  public addCurve(curve: RateCurve): void {
    this.curves.set(curve.name, curve);
  }

  public addForwardRates(rates: ForwardRates): void {
    this.forwardRates.set(`${rates.index}_${rates.tenor}`, rates);
  }

  public getForwardRate(
    index: string,
    tenor: string,
    date: Date
  ): number {
    const key = `${index}_${tenor}`;
    const rates = this.forwardRates.get(key);
    
    if (!rates) {
      throw new Error(`No forward rates found for ${key}`);
    }

    // Find bracketing dates
    const i = rates.dates.findIndex(d => d > date);
    if (i === -1) {
      return rates.rates[rates.rates.length - 1];
    }
    if (i === 0) {
      return rates.rates[0];
    }

    // Interpolate
    const t1 = rates.dates[i - 1].getTime();
    const t2 = rates.dates[i].getTime();
    const t = date.getTime();
    
    const r1 = rates.rates[i - 1];
    const r2 = rates.rates[i];
    
    return r1 + (r2 - r1) * (t - t1) / (t2 - t1);
  }

  public getDiscountFactor(
    curve: string,
    date: Date
  ): number {
    const rateCurve = this.curves.get(curve);
    if (!rateCurve) {
      throw new Error(`Curve ${curve} not found`);
    }

    // Find bracketing dates
    const i = rateCurve.dates.findIndex(d => d > date);
    if (i === -1) {
      return Math.exp(-rateCurve.rates[rateCurve.rates.length - 1] * date.getTime() / 31536000000); // Approximate using last rate
    }
    if (i === 0) {
      return Math.exp(-rateCurve.rates[0] * date.getTime() / 31536000000); // Approximate using first rate
    }

    // Interpolate rates and convert to discount factor
    const t1 = rateCurve.dates[i - 1].getTime();
    const t2 = rateCurve.dates[i].getTime();
    const t = date.getTime();
    
    const r1 = rateCurve.rates[i - 1];
    const r2 = rateCurve.rates[i];
    
    const interpolatedRate = r1 + (r2 - r1) * (t - t1) / (t2 - t1);
    return Math.exp(-interpolatedRate * t / 31536000000); // Convert to years and calculate continuous discount factor
  }
}