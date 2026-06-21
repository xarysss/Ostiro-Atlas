import type { CurrencyCode, DataSource, ReliabilityStatus, TracedValue } from "@ostiro/shared";

export type TransactionType = "buy" | "sell" | "dividend" | "fee" | "cash_in" | "cash_out";

export interface FinancialTransaction {
  id: string;
  occurredAt: string;
  type: TransactionType;
  currency: CurrencyCode;
  quantity?: string;
  unitPrice?: string;
  amount?: string;
  fees?: string;
  fxRateToBase?: string;
  source: DataSource;
  reliability: ReliabilityStatus;
}

export interface PositionResult {
  quantity: TracedValue<string>;
  averageCost: TracedValue<string>;
  costBasis: TracedValue<string>;
  marketValue: TracedValue<string>;
  unrealizedGain: TracedValue<string>;
  realizedGain: TracedValue<string>;
  dividends: TracedValue<string>;
  fees: TracedValue<string>;
}

export interface DatedCashFlow {
  date: string;
  amount: number;
}

export interface TwrPeriod {
  startValue: number;
  endValue: number;
  externalFlow: number;
}

export interface WeightedValue {
  key: string;
  value: number;
}

export interface PerformanceInput {
  openingValue: number;
  closingValue: number;
  contributions: number;
  withdrawals: number;
  income: number;
  fees: number;
  taxes: number;
}
