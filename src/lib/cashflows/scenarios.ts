import { ScenarioAssumptions } from './types';
import { 
  DEFAULT_SEVERITY, 
  DEFAULT_RECOVERY_LAG, 
  DEFAULT_PREPAY_RATE, 
  DEFAULT_DEFAULT_RATE 
} from './constants';

export interface Scenario {
  name: string;
  description?: string;
  assumptions: ScenarioAssumptions;
}

export const defaultScenario: ScenarioAssumptions = {
  prepayUnits: 'CPR',
  prepayRate: DEFAULT_PREPAY_RATE,
  defaultUnits: 'CDR',
  defaultRate: DEFAULT_DEFAULT_RATE,
  severity: DEFAULT_SEVERITY,
  recoveryLag: DEFAULT_RECOVERY_LAG,
  interestShortfall: false,
};

export class ScenarioManager {
  private scenarios: Map<string, Scenario> = new Map();

  addScenario(scenario: Scenario): void {
    this.scenarios.set(scenario.name, scenario);
  }

  removeScenario(name: string): void {
    this.scenarios.delete(name);
  }

  getScenario(name: string): Scenario | undefined {
    return this.scenarios.get(name);
  }

  listScenarios(): Scenario[] {
    return Array.from(this.scenarios.values());
  }

  createVector(
    baseScenario: ScenarioAssumptions,
    changes: Partial<ScenarioAssumptions>[],
    intervals: number[]
  ): ScenarioAssumptions[] {
    if (changes.length !== intervals.length) {
      throw new Error('Number of changes must match number of intervals');
    }

    const scenarios: ScenarioAssumptions[] = [];
    let currentAssumptions = { ...baseScenario };

    intervals.forEach((interval, index) => {
      for (let i = 0; i < interval; i++) {
        scenarios.push({ ...currentAssumptions });
      }
      currentAssumptions = { ...currentAssumptions, ...changes[index] };
    });

    return scenarios;
  }

  createScenario(
    overrides: Partial<ScenarioAssumptions> = {}
  ): ScenarioAssumptions {
    return {
      ...defaultScenario,
      ...overrides,
    };
  }
}