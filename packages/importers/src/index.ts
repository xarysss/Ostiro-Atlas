import Papa from "papaparse";

export interface CsvMapping {
  date: string;
  label: string;
  amount: string;
  currency?: string;
  type?: string;
}

export interface ImportedRow {
  rowNumber: number;
  occurredAt: string;
  label: string;
  amount: number;
  currency: string;
  type: string;
  fingerprint: string;
  raw: Record<string, string>;
}

export interface ImportIssue {
  rowNumber: number;
  field: string;
  message: string;
}

export interface ImportPreview {
  rows: ImportedRow[];
  issues: ImportIssue[];
  duplicateFingerprints: string[];
  headers: string[];
}

const normalize = (value: string) => value.trim().toLocaleLowerCase("fr").replace(/\s+/g, " ");

export function transactionFingerprint(row: Pick<ImportedRow, "occurredAt" | "label" | "amount" | "currency">) {
  return [row.occurredAt.slice(0, 10), normalize(row.label), row.amount.toFixed(2), row.currency.toUpperCase()].join("|");
}

function parseFrenchNumber(value: string): number {
  const normalized = value.trim().replace(/\s/g, "").replace(/\.(?=\d{3}(?:\D|$))/g, "").replace(",", ".");
  return Number(normalized);
}

export function previewCsv(content: string, mapping: CsvMapping, defaultCurrency = "EUR"): ImportPreview {
  const parsed = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  });
  const issues: ImportIssue[] = parsed.errors.map((error) => ({
    rowNumber: (error.row ?? 0) + 2,
    field: "csv",
    message: error.message,
  }));
  const rows: ImportedRow[] = [];

  parsed.data.forEach((raw, index) => {
    const rowNumber = index + 2;
    const amount = parseFrenchNumber(raw[mapping.amount] ?? "");
    const rawDate = raw[mapping.date]?.trim() ?? "";
    const label = raw[mapping.label]?.trim() ?? "";
    const date = /^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)
      ? `${rawDate.slice(6, 10)}-${rawDate.slice(3, 5)}-${rawDate.slice(0, 2)}`
      : rawDate;
    if (!/^\d{4}-\d{2}-\d{2}/.test(date)) issues.push({ rowNumber, field: mapping.date, message: "Date invalide" });
    if (!label) issues.push({ rowNumber, field: mapping.label, message: "Libellé manquant" });
    if (!Number.isFinite(amount)) issues.push({ rowNumber, field: mapping.amount, message: "Montant invalide" });
    if (!date || !label || !Number.isFinite(amount)) return;
    const imported: ImportedRow = {
      rowNumber,
      occurredAt: date,
      label,
      amount,
      currency: (mapping.currency ? raw[mapping.currency] : defaultCurrency)?.trim().toUpperCase() || defaultCurrency,
      type: (mapping.type ? raw[mapping.type] : "transaction")?.trim().toLowerCase() || "transaction",
      fingerprint: "",
      raw,
    };
    imported.fingerprint = transactionFingerprint(imported);
    rows.push(imported);
  });

  const counts = new Map<string, number>();
  rows.forEach((row) => counts.set(row.fingerprint, (counts.get(row.fingerprint) ?? 0) + 1));
  return {
    rows,
    issues,
    duplicateFingerprints: [...counts.entries()].filter(([, count]) => count > 1).map(([key]) => key),
    headers: parsed.meta.fields ?? [],
  };
}
