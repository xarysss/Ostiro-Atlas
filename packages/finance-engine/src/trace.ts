import type { DataSource, Reliability, ReliabilityStatus, TracedValue } from "@ostiro/shared";

const scores: Record<ReliabilityStatus, number> = {
  verified: 100,
  reliable: 90,
  stale: 65,
  estimated: 55,
  partial: 35,
  unknown: 0,
};

export function reliability(
  status: ReliabilityStatus,
  reasons: string[] = [],
  missingData: string[] = [],
): Reliability {
  return { status, score: scores[status], reasons, missingData };
}

export function traced<T>(params: {
  value: T | null;
  asOf: string;
  status: ReliabilityStatus;
  sources: DataSource[];
  formula: string;
  inputs: Record<string, string | number | boolean | null>;
  reasons?: string[];
  missingData?: string[];
}): TracedValue<T> {
  return {
    value: params.value,
    asOf: params.asOf,
    reliability: reliability(params.status, params.reasons, params.missingData),
    sources: params.sources,
    trace: {
      formula: params.formula,
      version: "finance-engine@0.1.0",
      inputs: params.inputs,
    },
  };
}
