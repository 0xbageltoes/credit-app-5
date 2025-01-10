import { WaterfallConfig, Account, Trigger, Payment, AccountType } from './types';

export class WaterfallEngine {
  private config: WaterfallConfig;
  private accounts: Map<string, Account>;
  private triggers: Map<string, Trigger>;
  private periodCashflows: Map<string, number>;

  constructor(config: WaterfallConfig) {
    this.config = config;
    this.accounts = new Map(config.accounts.map(acc => [acc.name, {...acc}]));
    this.triggers = new Map(config.triggers.map(trig => [trig.name, {...trig}]));
    this.periodCashflows = new Map();
  }

  public processPeriod(
    principalCollections: number,
    interestCollections: number,
    prepaymentCollections: number,
    recoveryCollections: number
  ): Map<string, number> {
    // Reset period cashflows
    this.periodCashflows.clear();
    
    // Distribute collections to accounts
    this.distributeCollections({
      principal: principalCollections,
      interest: interestCollections,
      prepayment: prepaymentCollections,
      recovery: recoveryCollections
    });

    // Update trigger states
    this.updateTriggers();

    // Process payments in priority order
    const sortedPayments = [...this.config.payments].sort((a, b) => a.priority - b.priority);
    
    for (const payment of sortedPayments) {
      if (this.shouldProcessPayment(payment)) {
        this.processPayment(payment);
      }
    }

    return this.periodCashflows;
  }

  private distributeCollections(collections: {[type: string]: number}): void {
    // Distribute principal
    const principalAccount = this.findAccountByType('Principal');
    if (principalAccount) {
      principalAccount.balance += collections.principal + collections.prepayment + collections.recovery;
    }

    // Distribute interest
    const interestAccount = this.findAccountByType('Interest');
    if (interestAccount) {
      interestAccount.balance += collections.interest;
    }
  }

  private findAccountByType(type: AccountType): Account | undefined {
    return Array.from(this.accounts.values()).find(acc => acc.type === type);
  }

  private updateTriggers(): void {
    for (const trigger of this.triggers.values()) {
      trigger.isActive = this.evaluateTrigger(trigger);
    }
  }

  private evaluateTrigger(trigger: Trigger): boolean {
    // Calculate actual value based on trigger type
    let actualValue = 0;
    
    switch (trigger.type) {
      case 'OC':
        actualValue = this.calculateOCRatio();
        break;
      case 'IC':
        actualValue = this.calculateICRatio();
        break;
      case 'Delinquency':
        actualValue = this.calculateDelinquencyRatio();
        break;
      case 'Cumulative Loss':
        actualValue = this.calculateCumulativeLossRatio();
        break;
    }

    // Evaluate against threshold
    switch (trigger.operator) {
      case '>':
        return actualValue > trigger.threshold;
      case '<':
        return actualValue < trigger.threshold;
      case '>=':
        return actualValue >= trigger.threshold;
      case '<=':
        return actualValue <= trigger.threshold;
      default:
        return false;
    }
  }

  private shouldProcessPayment(payment: Payment): boolean {
    if (!payment.triggerConditions?.length) {
      return true;
    }

    return payment.triggerConditions.every(triggerName => {
      const trigger = this.triggers.get(triggerName);
      return trigger?.isActive;
    });
  }

  private processPayment(payment: Payment): void {
    switch (payment.type) {
      case 'Sequential':
        this.processSequentialPayment(payment);
        break;
      case 'Pro Rata':
        this.processProRataPayment(payment);
        break;
      case 'Modified Pro Rata':
        this.processModifiedProRataPayment(payment);
        break;
    }
  }

  private processSequentialPayment(payment: Payment): void {
    let remainingFunds = this.getTotalAvailableFunds();

    for (const recipient of payment.recipients) {
      const maxAmount = payment.caps?.[recipient] ?? Infinity;
      const minAmount = payment.floors?.[recipient] ?? 0;

      let paymentAmount = Math.min(remainingFunds, maxAmount);
      paymentAmount = Math.max(paymentAmount, minAmount);

      if (paymentAmount > 0) {
        this.makePayment(recipient, paymentAmount);
        remainingFunds -= paymentAmount;
      }

      if (remainingFunds <= 0) break;
    }
  }

  private processProRataPayment(payment: Payment): void {
    const totalFunds = this.getTotalAvailableFunds();
    const recipientCount = payment.recipients.length;
    const baseAmount = totalFunds / recipientCount;

    for (const recipient of payment.recipients) {
      const maxAmount = payment.caps?.[recipient] ?? Infinity;
      const minAmount = payment.floors?.[recipient] ?? 0;

      let paymentAmount = Math.min(baseAmount, maxAmount);
      paymentAmount = Math.max(paymentAmount, minAmount);

      if (paymentAmount > 0) {
        this.makePayment(recipient, paymentAmount);
      }
    }
  }

  private processModifiedProRataPayment(payment: Payment): void {
    // TODO: Implement modified pro-rata logic with target ratios
    // and reallocation rules
    this.processProRataPayment(payment); // Fallback to regular pro-rata for now
  }

  private makePayment(recipient: string, amount: number): void {
    const currentAmount = this.periodCashflows.get(recipient) ?? 0;
    this.periodCashflows.set(recipient, currentAmount + amount);

    // Reduce account balances
    const principalAccount = this.findAccountByType('Principal');
    const interestAccount = this.findAccountByType('Interest');

    if (principalAccount && principalAccount.balance > 0) {
      const principalPortion = Math.min(amount, principalAccount.balance);
      principalAccount.balance -= principalPortion;
      amount -= principalPortion;
    }

    if (amount > 0 && interestAccount && interestAccount.balance > 0) {
      const interestPortion = Math.min(amount, interestAccount.balance);
      interestAccount.balance -= interestPortion;
    }
  }

  private getTotalAvailableFunds(): number {
    return Array.from(this.accounts.values())
      .reduce((sum, account) => sum + account.balance, 0);
  }

  private calculateOCRatio(): number {
    // TODO: Implement OC ratio calculation
    return 100; // Default to passing value
  }

  private calculateICRatio(): number {
    // TODO: Implement IC ratio calculation
    return 100; // Default to passing value
  }

  private calculateDelinquencyRatio(): number {
    // TODO: Implement delinquency ratio calculation
    return 0; // Default to passing value
  }

  private calculateCumulativeLossRatio(): number {
    // TODO: Implement cumulative loss ratio calculation
    return 0; // Default to passing value
  }
}