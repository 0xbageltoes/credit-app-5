import { ScenarioAssumptions } from './types';
import { 
  DEFAULT_SEVERITY, 
  DEFAULT_RECOVERY_LAG, 
  DEFAULT_PREPAY_RATE, 
  DEFAULT_DEFAULT_RATE 
} from './constants';

export const defaultScenario: ScenarioAssumptions = {
  prepayUnits: 'CPR',
  prepayRate: DEFAULT_PREPAY_RATE,
  defaultUnits: 'CDR',
  defaultRate: DEFAULT_DEFAULT_RATE,
  severity: DEFAULT_SEVERITY,
  recoveryLag: DEFAULT_RECOVERY_LAG,
  interestShortfall: false,
};

export function createScenario(
  overrides: Partial<ScenarioAssumptions> = {}
): ScenarioAssumptions {
  return {
    ...defaultScenario,
    ...overrides,
  };
}