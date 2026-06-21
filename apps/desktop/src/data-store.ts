import Database from "@tauri-apps/plugin-sql";
import { DATABASE_URL } from "@ostiro/database";
import type { LocalProfile } from "./profile-types";
import { accounts as demoAccounts, positions as demoPositions, dividends as demoDividends, dataIssues as demoIssues } from "./demo-data";
import type { ReliabilityStatus } from "@ostiro/shared";

export interface Account {
  id: string;
  name: string;
  kind: string; // e.g. "Comptes bancaires", "Livrets", "PEA", "CTO", "Assurance-vie", "PER", "Crypto", "Immobilier", "Dettes", "Métaux précieux", "Autres"
  institution: string;
  value: number;
  delta: number;
  reliability: ReliabilityStatus;
  updated: string;
  color: string;
  currency: string;
  details?: {
    interestRate?: number;
    cashBalance?: number;
    propertyType?: string;
    city?: string;
    monthlyPayment?: number;
    loanRate?: number;
    loanEndDate?: string;
    quantity?: number;
    buyPrice?: number;
  };
}

export interface Position {
  symbol: string;
  name: string;
  account: string; // account name
  accountId: string; // account ID
  quantity: number;
  averageCost: number | null;
  price: number;
  value: number;
  gain: number | null;
  currency: string;
  reliability: ReliabilityStatus;
  updated: string;
}

export interface Transaction {
  id: string;
  date: string;
  label: string;
  account: string;
  accountId: string;
  amount: number;
  type: string; // "Achat", "Vente", "Dividende", "Frais", "Dépôt", "Retrait", "Mensualité"
  currency: string;
  reliability: ReliabilityStatus;
}

export interface Dividend {
  id: string;
  asset: string;
  date: string;
  gross: number;
  tax: number;
  net: number;
  status: "Annoncé" | "Estimé" | "Capitalisant" | "Payé";
  reliability: ReliabilityStatus;
}

export interface Fee {
  id: string;
  label: string;
  amount: number;
  certainty: "verified" | "reliable" | "estimated";
  occurredAt: string;
}

export interface DataIssue {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  action: string;
  target: string;
}

export interface CsvMappingTemplate {
  name: string;
  fingerprint: string;
  mapping: {
    date: string;
    label: string;
    amount: string;
    currency?: string;
  };
}

export interface PortfolioData {
  accounts: Account[];
  positions: Position[];
  transactions: Transaction[];
  dividends: Dividend[];
  fees: Fee[];
  dataIssues: DataIssue[];
  csvTemplates: CsvMappingTemplate[];
}

const STORAGE_KEY_PREFIX = "ostiro.portfolio-data.";

function isTauri() {
  return Boolean(window.__TAURI_INTERNALS__);
}

async function database() {
  return Database.load(DATABASE_URL);
}

export const emptyPortfolio: PortfolioData = {
  accounts: [],
  positions: [],
  transactions: [],
  dividends: [],
  fees: [],
  dataIssues: [],
  csvTemplates: [],
};

// Demo data mapped to correct structure
export const demoPortfolioData: PortfolioData = {
  accounts: demoAccounts.map(a => ({
    id: a.id,
    name: a.name,
    kind: a.kind,
    institution: a.institution,
    value: a.value,
    delta: a.delta,
    reliability: a.reliability,
    updated: a.updated,
    color: a.color,
    currency: "EUR"
  })),
  positions: demoPositions.map(p => ({
    symbol: p.symbol,
    name: p.name,
    account: p.account,
    accountId: p.account === "PEA Horizon" ? "pea" : "cto",
    quantity: p.quantity,
    averageCost: p.averageCost,
    price: p.price,
    value: p.value,
    gain: p.gain,
    currency: p.currency,
    reliability: p.reliability,
    updated: p.updated
  })),
  transactions: [
    { id: "tx1", date: "2026-06-18", label: "Dividende TotalEnergies", account: "PEA Horizon", accountId: "pea", amount: 284.40, type: "Dividende", currency: "EUR", reliability: "verified" },
    { id: "tx2", date: "2026-06-16", label: "Achat Amundi MSCI World", account: "PEA Horizon", accountId: "pea", amount: -1949.40, type: "Achat", currency: "EUR", reliability: "verified" },
    { id: "tx3", date: "2026-06-12", label: "Frais de courtage", account: "CTO Monde", accountId: "cto", amount: -4.90, type: "Frais", currency: "EUR", reliability: "reliable" },
    { id: "tx4", date: "2026-06-05", label: "Mensualité crédit", account: "Crédit immobilier", accountId: "loan", amount: -862.20, type: "Mensualité", currency: "EUR", reliability: "reliable" },
  ],
  dividends: demoDividends.map((d, index) => ({
    id: `div-${index}`,
    asset: d.asset,
    date: d.date,
    gross: d.gross,
    tax: d.tax,
    net: d.net,
    status: d.status as Dividend["status"],
    reliability: d.reliability
  })),
  fees: [
    { id: "fee1", label: "Courtage", amount: 214, certainty: "verified", occurredAt: "2026-06-12" },
    { id: "fee2", label: "TER des ETF", amount: 326, certainty: "estimated", occurredAt: "2026-06-20" },
    { id: "fee3", label: "Change", amount: 96, certainty: "reliable", occurredAt: "2026-06-10" },
    { id: "fee4", label: "Frais bancaires", amount: 48, certainty: "verified", occurredAt: "2026-06-01" },
  ],
  dataIssues: demoIssues.map((i, idx) => ({
    id: `issue-${idx}`,
    severity: i.severity as DataIssue["severity"],
    title: i.title,
    detail: i.detail,
    action: i.action,
    target: i.target
  })),
  csvTemplates: [],
};

export async function getPortfolioData(profile: LocalProfile): Promise<PortfolioData> {
  if (profile.isDemo) {
    return demoPortfolioData;
  }

  if (!isTauri()) {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PREFIX + profile.id);
      return data ? JSON.parse(data) : emptyPortfolio;
    } catch {
      return emptyPortfolio;
    }
  }

  try {
    const db = await database();
    const rows = await db.select<Array<{ value_json: string }>>(
      "SELECT value_json FROM settings WHERE profile_id = $1 AND key = 'portfolio_data'",
      [profile.id]
    );
    const firstRow = rows[0];
    if (firstRow) {
      return JSON.parse(firstRow.value_json) as PortfolioData;
    }
    return emptyPortfolio;
  } catch (error) {
    console.error("Error loading portfolio data from SQLite", error);
    return emptyPortfolio;
  }
}

export async function savePortfolioData(profile: LocalProfile, data: PortfolioData): Promise<void> {
  if (profile.isDemo) return; // Do not modify demo data permanently

  if (!isTauri()) {
    localStorage.setItem(STORAGE_KEY_PREFIX + profile.id, JSON.stringify(data));
    return;
  }

  try {
    const db = await database();
    const now = new Date().toISOString();
    const jsonStr = JSON.stringify(data);
    await db.execute(
      `INSERT INTO settings (profile_id, key, value_json, updated_at)
       VALUES ($1, 'portfolio_data', $2, $3)
       ON CONFLICT(profile_id, key) DO UPDATE SET value_json = $2, updated_at = $3`,
      [profile.id, jsonStr, now]
    );
  } catch (error) {
    console.error("Error saving portfolio data to SQLite", error);
  }
}
