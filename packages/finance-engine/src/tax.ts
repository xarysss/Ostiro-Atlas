export interface FrenchPfuEstimateInput {
  realizedCapitalGains: number;
  taxableDividends: number;
  deductibleLosses: number;
  foreignWithholding: number;
  pfuRate?: number;
}

export function estimateFrenchPfu(input: FrenchPfuEstimateInput) {
  const rate = input.pfuRate ?? 0.3;
  const taxableBase = Math.max(
    0,
    input.realizedCapitalGains + input.taxableDividends - input.deductibleLosses,
  );
  const grossEstimate = taxableBase * rate;
  return {
    taxableBase,
    estimatedTax: Math.max(0, grossEstimate - input.foreignWithholding),
    rate,
    status: "estimated" as const,
    warning: "Estimation pédagogique à vérifier avec les documents fiscaux officiels.",
  };
}
