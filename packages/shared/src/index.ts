export type CurrencyCode = string;

export type ReliabilityStatus =
  | "verified"
  | "reliable"
  | "partial"
  | "estimated"
  | "unknown"
  | "stale";

export type SourceKind =
  | "manual"
  | "csv_import"
  | "calculation"
  | "market_data"
  | "opening_balance"
  | "demo";

export interface DataSource {
  id: string;
  kind: SourceKind;
  label: string;
  importedAt?: string;
  observedAt?: string;
  fileHash?: string;
}

export interface Reliability {
  status: ReliabilityStatus;
  score: number;
  reasons: string[];
  missingData: string[];
}

export interface CalculationTrace {
  formula: string;
  version: string;
  inputs: Record<string, string | number | boolean | null>;
}

export interface TracedValue<T> {
  value: T | null;
  asOf: string;
  reliability: Reliability;
  sources: DataSource[];
  trace: CalculationTrace;
}

export interface Money {
  amount: string;
  currency: CurrencyCode;
}

export interface AuditEntry {
  id: string;
  entityType: string;
  entityId: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  changedAt: string;
  author: "local_user" | "system";
  reason: string;
  calculationImpact: string[];
}

export const reliabilityLabels: Record<ReliabilityStatus, string> = {
  verified: "Vérifiée",
  reliable: "Fiable",
  partial: "Historique incomplet",
  estimated: "Estimée",
  unknown: "Inconnue",
  stale: "Obsolète",
};

export function lowestReliability(statuses: ReliabilityStatus[]): ReliabilityStatus {
  const order: ReliabilityStatus[] = [
    "unknown",
    "partial",
    "estimated",
    "stale",
    "reliable",
    "verified",
  ];
  return statuses.reduce((lowest, status) =>
    order.indexOf(status) < order.indexOf(lowest) ? status : lowest,
  "verified");
}
