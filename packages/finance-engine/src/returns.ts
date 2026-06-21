import type { DatedCashFlow, PerformanceInput, TwrPeriod } from "./types";

const daysBetween = (from: Date, to: Date) =>
  (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

export function xirr(flows: DatedCashFlow[], guess = 0.1): number | null {
  if (flows.length < 2 || !flows.some((flow) => flow.amount < 0) || !flows.some((flow) => flow.amount > 0)) {
    return null;
  }
  const sorted = [...flows].sort((a, b) => a.date.localeCompare(b.date));
  const origin = new Date(sorted[0]!.date);
  const valueAt = (rate: number) => sorted.reduce((sum, flow) => {
    const years = daysBetween(origin, new Date(flow.date)) / 365.2425;
    return sum + flow.amount / Math.pow(1 + rate, years);
  }, 0);
  const derivativeAt = (rate: number) => sorted.reduce((sum, flow) => {
    const years = daysBetween(origin, new Date(flow.date)) / 365.2425;
    return sum - (years * flow.amount) / Math.pow(1 + rate, years + 1);
  }, 0);

  let rate = guess;
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const value = valueAt(rate);
    const derivative = derivativeAt(rate);
    if (!Number.isFinite(value) || !Number.isFinite(derivative) || Math.abs(derivative) < 1e-12) break;
    const next = rate - value / derivative;
    if (next <= -0.999999 || !Number.isFinite(next)) break;
    if (Math.abs(next - rate) < 1e-9) return next;
    rate = next;
  }

  let low = -0.9999;
  let high = 10;
  let lowValue = valueAt(low);
  let highValue = valueAt(high);
  if (lowValue * highValue > 0) return null;
  for (let iteration = 0; iteration < 200; iteration += 1) {
    const middle = (low + high) / 2;
    const middleValue = valueAt(middle);
    if (Math.abs(middleValue) < 1e-8) return middle;
    if (lowValue * middleValue <= 0) {
      high = middle;
      highValue = middleValue;
    } else {
      low = middle;
      lowValue = middleValue;
    }
  }
  return (low + high) / 2;
}

export function twr(periods: TwrPeriod[]): number | null {
  if (!periods.length || periods.some((period) => period.startValue <= 0)) return null;
  return periods.reduce((factor, period) =>
    factor * ((period.endValue - period.externalFlow) / period.startValue), 1) - 1;
}

export function performance(input: PerformanceInput) {
  const marketGain = input.closingValue + input.withdrawals - input.contributions - input.openingValue;
  const grossGain = marketGain + input.fees + input.taxes;
  const netGain = marketGain;
  return {
    marketGain,
    grossGain,
    netGain,
    totalIncome: input.income,
    grossReturn: input.openingValue === 0 ? null : grossGain / input.openingValue,
    netReturn: input.openingValue === 0 ? null : netGain / input.openingValue,
  };
}
