import { describe, expect, it } from "vitest";
import { previewCsv } from "../src";

describe("generic CSV importer", () => {
  it("parses French numbers, maps columns and flags duplicates", () => {
    const csv = [
      "Date;Libellé;Montant;Devise",
      "01/03/2025;Achat ETF;1 234,56;eur",
      "01/03/2025;Achat ETF;1 234,56;eur",
    ].join("\n");
    const result = previewCsv(csv, { date: "Date", label: "Libellé", amount: "Montant", currency: "Devise" });
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]?.amount).toBe(1234.56);
    expect(result.rows[0]?.occurredAt).toBe("2025-03-01");
    expect(result.duplicateFingerprints).toHaveLength(1);
  });

  it("does not import invalid amounts", () => {
    const result = previewCsv("date,label,amount\n2025-01-01,Test,nope", {
      date: "date",
      label: "label",
      amount: "amount",
    });
    expect(result.rows).toHaveLength(0);
    expect(result.issues.some((issue) => issue.field === "amount")).toBe(true);
  });
});
