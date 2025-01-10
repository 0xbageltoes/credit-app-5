import { ScenarioConfig, ScenarioType } from './types';

export class ScenarioEngine {
  private config: ScenarioConfig;
  private vector: number[] = [];
  private maxPeriods: number;

  constructor(config: ScenarioConfig, maxPeriods: number) {
    this.config = config;
    this.maxPeriods = maxPeriods;
  }

  public generateVector(): number[] {
    this.initializeBaseVector();

    if (this.config.ramps?.length) {
      this.applyRamps();
    }

    if (this.config.vectors?.length) {
      this.applyVectorPoints();
    }

    if (this.config.seasonalAdjustments) {
      this.applySeasonalAdjustments();
    }

    if (this.config.shock) {
      this.applyShock();
    }

    if (this.config.conditionalLogic) {
      this.applyConditionalLogic();
    }

    return this.vector.map(v => this.adjustForScenarioType(v));
  }

  private initializeBaseVector(): void {
    const initialValue = this.config.initialValue ?? 0;
    this.vector = Array(this.maxPeriods).fill(initialValue);
  }

  private applyRamps(): void {
    for (const ramp of this.config.ramps!) {
      let currentPeriod = 0;
      const increment = (ramp.endValue - ramp.startValue) / ramp.rampPeriods;
      
      for (let i = 0; i < ramp.rampPeriods; i++) {
        if (currentPeriod >= this.maxPeriods) break;
        this.vector[currentPeriod] = ramp.startValue + (increment * i);
        currentPeriod++;
      }

      if (ramp.holdPeriods) {
        const holdValue = ramp.endValue;
        for (let i = 0; i < ramp.holdPeriods; i++) {
          if (currentPeriod >= this.maxPeriods) break;
          this.vector[currentPeriod] = holdValue;
          currentPeriod++;
        }
      }
    }
  }

  private applyVectorPoints(): void {
    for (const point of this.config.vectors!) {
      if (point.period < this.maxPeriods) {
        this.vector[point.period] = point.value;
      }
    }
  }

  private applySeasonalAdjustments(): void {
    for (let i = 0; i < this.maxPeriods; i++) {
      const month = (i % 12) + 1;
      const adjustment = this.config.seasonalAdjustments![month] ?? 1;
      this.vector[i] *= adjustment;
    }
  }

  private applyShock(): void {
    const shock = this.config.shock!;
    const startPeriod = shock.timing;
    const endPeriod = shock.duration ? startPeriod + shock.duration : this.maxPeriods;

    for (let i = startPeriod; i < Math.min(endPeriod, this.maxPeriods); i++) {
      this.vector[i] += shock.magnitude;
    }
  }

  private applyConditionalLogic(): void {
    const logic = this.parseConditionalLogic(this.config.conditionalLogic!);
    for (let i = 0; i < this.maxPeriods; i++) {
      this.vector[i] = logic(i, this.vector[i]);
    }
  }

  private parseConditionalLogic(logic: string): (period: number, value: number) => number {
    try {
      const fnBody = logic
        .replace(/period/g, 'p')
        .replace(/value/g, 'v')
        .replace(/if/g, 'if(')
        .replace(/then/g, '){')
        .replace(/and/g, '&&')
        .replace(/or/g, '||')
        + '}return v;';

      return new Function('p', 'v', fnBody) as (p: number, v: number) => number;
    } catch (error) {
      console.error('Failed to parse conditional logic:', error);
      return (_, v) => v;
    }
  }

  private adjustForScenarioType(value: number): number {
    switch (this.config.type) {
      case 'CPR':
      case 'CDR':
      case 'Draw Rate':
        return Math.max(0, Math.min(100, value));
      case 'Loss Severity':
        return Math.max(0, Math.min(100, value));
      case 'Delinquency':
        return Math.max(0, value);
      case 'Interest Rate':
        return Math.max(-10, Math.min(50, value));
      default:
        return value;
    }
  }
}