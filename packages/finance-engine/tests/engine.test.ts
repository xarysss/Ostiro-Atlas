import { describe, expect, it } from "vitest";
import { allocation, calculatePosition, estimateFrenchPfu, twr, xirr } from "../src";
import type { FinancialTransaction } from "../src";

const source = { id: "csv-1", kind: "csv_import" as const, label: "courtier.csv" };

const transactions: FinancialTransaction[] = [
  { id: "1", occurredAt: "2024-01-01", type: "buy", currency: "EUR", quantity: "10", unitPrice: "100", fees: "5", source, reliability: "verified" },
  { id: "2", occurredAt: "2024-02-01", type: "buy", currency: "EUR", quantity: "10", unitPrice: "120", fees: "5", source, reliability: "verified" },
  { id: "3", occurredAt: "2024-03-01", type: "sell", currency: "EUR", quantity: "5", unitPrice: "150", fees: "2", source, reliability: "verified" },
  { id: "4", occurredAt: "2024-04-01", type: "dividend", currency: "EUR", amount: "30", source, reliability: "verified" },
];

describe("position with weighted average cost", () => {
  it("computes remaining cost, realized and unrealized gains", () => {
    const result = calculatePosition(transactions, {
      baseCurrency: "EUR",
      currentPrice: "140",
      asOf: "2024-05-01",
      historyComplete: true,
    });
    expect(result.quantity.value).toBe("15");
    expect(result.averageCost.value).toBe("110.5");
    expect(result.costBasis.value).toBe("1657.5");
    expect(result.realizedGain.value).toBe("195.5");
    expect(result.unrealizedGain.value).toBe("442.5");
    expect(result.dividends.value).toBe("30");
    expect(result.fees.value).toBe("12");
    expect(result.averageCost.reliability.status).toBe("verified");
  });

  it("refuses to present PRU and gains as certain with incomplete history", () => {
    const result = calculatePosition(transactions, {
      baseCurrency: "EUR",
      currentPrice: "140",
      asOf: "2024-05-01",
      historyComplete: false,
    });
    expect(result.averageCost.value).toBeNull();
    expect(result.realizedGain.value).toBeNull();
    expect(result.averageCost.reliability.status).toBe("partial");
    expect(result.averageCost.reliability.missingData).toContain("Transactions antérieures ou solde initial");
  });
});

describe("returns", () => {
  it("calculates annual XIRR", () => {
    const result = xirr([
      { date: "2024-01-01", amount: -1000 },
      { date: "2025-01-01", amount: 1100 },
    ]);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(0.1, 3);
  });

  it("returns null when XIRR has no sign change", () => {
    expect(xirr([{ date: "2024-01-01", amount: 100 }, { date: "2025-01-01", amount: 200 }])).toBeNull();
  });

  it("chains time-weighted periods independently from contributions", () => {
    expect(twr([
      { startValue: 1000, endValue: 1150, externalFlow: 100 },
      { startValue: 1150, endValue: 1265, externalFlow: 0 },
    ])).toBeCloseTo(0.155, 6);
  });
});

describe("allocation and tax estimate", () => {
  it("normalizes allocation weights", () => {
    expect(allocation([{ key: "EUR", value: 75 }, { key: "USD", value: 25 }])).toEqual([
      { key: "EUR", value: 75, weight: 0.75 },
      { key: "USD", value: 25, weight: 0.25 },
    ]);
  });

  it("labels the PFU calculation as an estimate", () => {
    const estimate = estimateFrenchPfu({
      realizedCapitalGains: 1000,
      taxableDividends: 200,
      deductibleLosses: 100,
      foreignWithholding: 30,
    });
    expect(estimate.estimatedTax).toBeCloseTo(300);
    expect(estimate.status).toBe("estimated");
  });
});
