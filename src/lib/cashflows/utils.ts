export function calculateAmortization(
  balance: number, 
  rate: number,
  remainingTerm: number
): { principal: number; interest: number } {
  const monthlyRate = rate / 12;
  const payment = (balance * monthlyRate * Math.pow(1 + monthlyRate, remainingTerm)) / 
                 (Math.pow(1 + monthlyRate, remainingTerm) - 1);
  
  const interest = balance * monthlyRate;
  const principal = payment - interest;

  return { principal, interest };
}

export function calculatePrepayment(
  balance: number,
  rate: number,
  units: 'CPR' | 'SMM' | 'PSA'
): number {
  switch (units) {
    case 'CPR':
      const smm = 1 - Math.pow(1 - rate/100, 1/12);
      return balance * smm;
    case 'SMM':
      return balance * (rate/100);
    case 'PSA':
      // TODO: Implement PSA calculation
      return 0;
    default:
      return 0;
  }
}

export function calculateDefault(
  balance: number,
  rate: number,
  units: 'CDR' | 'MDR'
): number {
  switch (units) {
    case 'CDR':
      const mdr = 1 - Math.pow(1 - rate/100, 1/12);
      return balance * mdr;
    case 'MDR':
      return balance * (rate/100);
    default:
      return 0;
  }
}