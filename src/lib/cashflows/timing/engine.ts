import { TimingVector, TimingConfig } from './types';

export class TimingEngine {
  private config: TimingConfig;

  constructor(config: TimingConfig) {
    this.config = config;
  }

  public calculatePrepaymentAmount(
    period: number,
    balance: number,
    rate: number
  ): number {
    const timing = this.interpolateTiming(
      period,
      this.config.prepaymentTiming
    );
    return balance * rate * timing;
  }

  public calculateDefaultAmount(
    period: number,
    balance: number,
    rate: number
  ): number {
    const timing = this.interpolateTiming(
      period,
      this.config.defaultTiming
    );
    return balance * rate * timing;
  }

  public calculateRecoveryAmount(
    period: number,
    defaultedAmount: number,
    recoveryRate: number
  ): number {
    if (period < this.config.recoveryLag) {
      return 0;
    }

    const timing = this.interpolateTiming(
      period - this.config.recoveryLag,
      this.config.recoveryTiming
    );
    return defaultedAmount * recoveryRate * timing;
  }

  private interpolateTiming(
    period: number,
    vector: TimingVector
  ): number {
    const i = vector.periods.findIndex(p => p > period);
    if (i === -1) return vector.values[vector.values.length - 1];
    if (i === 0) return vector.values[0];

    const p1 = vector.periods[i - 1];
    const p2 = vector.periods[i];
    const v1 = vector.values[i - 1];
    const v2 = vector.values[i];

    return v1 + (v2 - v1) * (period - p1) / (p2 - p1);
  }
}