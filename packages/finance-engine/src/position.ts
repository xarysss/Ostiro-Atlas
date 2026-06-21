import Decimal from "decimal.js";
import type { ReliabilityStatus } from "@ostiro/shared";
import { lowestReliability } from "@ostiro/shared";
import { traced } from "./trace";
import type { FinancialTransaction, PositionResult } from "./types";

interface PositionOptions {
  baseCurrency: string;
  currentPrice: string;
  currentFxRateToBase?: string;
  asOf: string;
  historyComplete: boolean;
}

const zero = new Decimal(0);

export function calculatePosition(
  transactions: FinancialTransaction[],
  options: PositionOptions,
): PositionResult {
  const sorted = [...transactions].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  let quantity = zero;
  let costBasis = zero;
  let realizedGain = zero;
  let dividends = zero;
  let fees = zero;
  let invalidSale = false;

  for (const transaction of sorted) {
    const fx = new Decimal(transaction.fxRateToBase ?? 1);
    const transactionFees = new Decimal(transaction.fees ?? 0).mul(fx);
    fees = fees.add(transactionFees);

    if (transaction.type === "buy") {
      const bought = new Decimal(transaction.quantity ?? 0);
      const price = new Decimal(transaction.unitPrice ?? 0);
      quantity = quantity.add(bought);
      costBasis = costBasis.add(bought.mul(price).mul(fx)).add(transactionFees);
    }

    if (transaction.type === "sell") {
      const sold = new Decimal(transaction.quantity ?? 0);
      if (sold.gt(quantity) || quantity.eq(0)) {
        invalidSale = true;
        continue;
      }
      const averageCost = costBasis.div(quantity);
      const removedCost = averageCost.mul(sold);
      const proceeds = sold
        .mul(new Decimal(transaction.unitPrice ?? 0))
        .mul(fx)
        .sub(transactionFees);
      realizedGain = realizedGain.add(proceeds.sub(removedCost));
      quantity = quantity.sub(sold);
      costBasis = costBasis.sub(removedCost);
    }

    if (transaction.type === "dividend") {
      dividends = dividends.add(new Decimal(transaction.amount ?? 0).mul(fx));
    }

    if (transaction.type === "fee" && transaction.amount) {
      fees = fees.add(new Decimal(transaction.amount).abs().mul(fx));
    }
  }

  const historyComplete = options.historyComplete && !invalidSale;
  const sourceStatuses = sorted.map((item) => item.reliability);
  const baseStatus: ReliabilityStatus = historyComplete
    ? lowestReliability(sourceStatuses.length ? sourceStatuses : ["unknown"])
    : "partial";
  const sources = sorted.map((item) => item.source);
  const averageCost = quantity.gt(0) ? costBasis.div(quantity) : zero;
  const marketValue = quantity
    .mul(options.currentPrice)
    .mul(options.currentFxRateToBase ?? 1);
  const unrealizedGain = marketValue.sub(costBasis);
  const missing = historyComplete ? [] : ["Transactions antérieures ou solde initial"];
  const reasons = historyComplete
    ? ["Calcul reconstruit depuis l'historique disponible"]
    : ["Le calcul ne peut pas être certifié avec cet historique"];
  const common = {
    asOf: options.asOf,
    status: baseStatus,
    sources,
    reasons,
    missingData: missing,
  };

  return {
    quantity: traced({
      ...common,
      value: quantity.toString(),
      formula: "Σ quantités achetées - Σ quantités vendues",
      inputs: { transactionCount: sorted.length, historyComplete },
    }),
    averageCost: traced({
      ...common,
      value: historyComplete ? averageCost.toDecimalPlaces(8).toString() : null,
      formula: "coût restant / quantité restante (méthode du coût moyen pondéré)",
      inputs: { costBasis: costBasis.toString(), quantity: quantity.toString() },
    }),
    costBasis: traced({
      ...common,
      value: historyComplete ? costBasis.toDecimalPlaces(2).toString() : null,
      formula: "achats convertis + frais d'achat - coût moyen des titres vendus",
      inputs: { baseCurrency: options.baseCurrency, historyComplete },
    }),
    marketValue: traced({
      ...common,
      value: marketValue.toDecimalPlaces(2).toString(),
      formula: "quantité × prix actuel × taux de change actuel",
      inputs: {
        quantity: quantity.toString(),
        currentPrice: options.currentPrice,
        currentFxRateToBase: options.currentFxRateToBase ?? "1",
      },
    }),
    unrealizedGain: traced({
      ...common,
      value: historyComplete ? unrealizedGain.toDecimalPlaces(2).toString() : null,
      formula: "valeur de marché - coût restant",
      inputs: { marketValue: marketValue.toString(), costBasis: costBasis.toString() },
    }),
    realizedGain: traced({
      ...common,
      value: historyComplete ? realizedGain.toDecimalPlaces(2).toString() : null,
      formula: "Σ (produit net de vente - coût moyen des titres vendus)",
      inputs: { saleCount: sorted.filter((item) => item.type === "sell").length },
    }),
    dividends: traced({
      ...common,
      value: dividends.toDecimalPlaces(2).toString(),
      formula: "Σ dividendes encaissés × taux de change historique",
      inputs: { dividendCount: sorted.filter((item) => item.type === "dividend").length },
    }),
    fees: traced({
      ...common,
      value: fees.toDecimalPlaces(2).toString(),
      formula: "Σ frais explicites × taux de change historique",
      inputs: { transactionCount: sorted.length },
    }),
  };
}
