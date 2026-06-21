import type { WeightedValue } from "./types";

export function allocation(values: WeightedValue[]) {
  const total = values.reduce((sum, item) => sum + item.value, 0);
  return values.map((item) => ({
    ...item,
    weight: total === 0 ? 0 : item.value / total,
  }));
}

export const currencyExposure = allocation;
