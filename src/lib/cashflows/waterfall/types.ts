export type AccountType = 'Principal' | 'Interest' | 'Reserve' | 'Fees';
export type TriggerType = 'OC' | 'IC' | 'Delinquency' | 'Cumulative Loss';
export type PaymentType = 'Sequential' | 'Pro Rata' | 'Modified Pro Rata';

export interface Account {
  name: string;
  type: AccountType;
  balance: number;
  minimumBalance?: number;
  maximumBalance?: number;
}

export interface Trigger {
  name: string;
  type: TriggerType;
  threshold: number;
  operator: '>' | '<' | '>=' | '<=';
  value: number;
  isActive: boolean;
}

export interface Payment {
  priority: number;
  type: PaymentType;
  recipients: string[];
  triggerConditions?: string[];
  seniorityOverride?: boolean;
  caps?: {[recipient: string]: number};
  floors?: {[recipient: string]: number};
}

export interface WaterfallConfig {
  accounts: Account[];
  triggers: Trigger[];
  payments: Payment[];
  reserveAccountRules?: {
    replenishmentPriority?: number;
    releaseConditions?: string[];
  };
}