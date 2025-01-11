export const calculateWAF = (vector: number[]): number => {
  if (!vector.length) return 0;
  let sum = 0;
  let weightedSum = 0;
  vector.forEach((value, index) => {
    sum += value;
    weightedSum += value * (index + 1);
  });
  return sum > 0 ? weightedSum / sum / 12 : 0; // Convert to years
};

export const calculateModifiedDuration = (vector: number[]): number => {
  // Simplified duration calculation
  return vector.length > 0 ? vector.length / 24 : 0; // Rough estimate in years
};

export const generateScenarioResults = (
  vector: number[], 
  investmentAmount: number, 
  interestRate: number
): CashflowData => ({
  period: 0,
  scheduledPrincipal: (vector[0] || 0) * investmentAmount / 100,
  scheduledInterest: interestRate * investmentAmount / 1200,
  prepayments: 0,
  losses: 0,
  recoveries: 0
});