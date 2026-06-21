import type { ReliabilityStatus } from "@ostiro/shared";

export interface DemoAccount {
  id: string;
  name: string;
  kind: string;
  institution: string;
  value: number;
  delta: number;
  reliability: ReliabilityStatus;
  updated: string;
  color: string;
}

export interface DemoPosition {
  symbol: string;
  name: string;
  account: string;
  quantity: number;
  averageCost: number | null;
  price: number;
  value: number;
  gain: number | null;
  currency: string;
  reliability: ReliabilityStatus;
  updated: string;
}

export const wealthSeries = [
  332, 337, 335, 344, 349, 347, 356, 362, 367, 371, 379, 376, 385, 391, 397, 401, 408, 405, 416, 421.85,
];

export const accounts: DemoAccount[] = [
  { id: "pea", name: "PEA Horizon", kind: "Actions & ETF", institution: "Courtier démo", value: 128420, delta: 12.4, reliability: "verified", updated: "20 juin 2026, 18:42", color: "#8f85ff" },
  { id: "cto", name: "CTO Monde", kind: "Actions internationales", institution: "Courtier démo", value: 86540, delta: 8.7, reliability: "reliable", updated: "20 juin 2026, 18:42", color: "#6aa9ff" },
  { id: "cash", name: "Trésorerie", kind: "Compte courant + Livret A", institution: "Banque démo", value: 28760, delta: 0.2, reliability: "verified", updated: "20 juin 2026, 17:10", color: "#c5a8ff" },
  { id: "realestate", name: "Appartement Lyon", kind: "Immobilier", institution: "Saisie manuelle", value: 245000, delta: 2.1, reliability: "estimated", updated: "1 juin 2026", color: "#f4c66b" },
  { id: "crypto", name: "Portefeuille crypto", kind: "Bitcoin + Ethereum", institution: "Import CSV", value: 18130, delta: 19.8, reliability: "partial", updated: "18 juin 2026", color: "#ff8e72" },
  { id: "loan", name: "Crédit immobilier", kind: "Passif", institution: "Saisie manuelle", value: -85000, delta: -3.4, reliability: "reliable", updated: "5 juin 2026", color: "#ef6d7a" },
];

export const positions: DemoPosition[] = [
  { symbol: "CW8", name: "Amundi MSCI World", account: "PEA Horizon", quantity: 142, averageCost: 401.22, price: 487.35, value: 69203.7, gain: 12230.46, currency: "EUR", reliability: "verified", updated: "20 juin 2026, 18:42" },
  { symbol: "TTE", name: "TotalEnergies", account: "PEA Horizon", quantity: 360, averageCost: 54.18, price: 63.42, value: 22831.2, gain: 3326.4, currency: "EUR", reliability: "verified", updated: "20 juin 2026, 18:42" },
  { symbol: "MC", name: "LVMH", account: "PEA Horizon", quantity: 48, averageCost: 598.75, price: 641.35, value: 30784.8, gain: 2044.8, currency: "EUR", reliability: "reliable", updated: "20 juin 2026, 18:42" },
  { symbol: "MSFT", name: "Microsoft", account: "CTO Monde", quantity: 74, averageCost: 329.2, price: 476.5, value: 30271.48, gain: 9345.18, currency: "USD", reliability: "reliable", updated: "20 juin 2026, 18:42" },
  { symbol: "BTC", name: "Bitcoin", account: "Portefeuille crypto", quantity: 0.115, averageCost: null, price: 92400, value: 10626, gain: null, currency: "EUR", reliability: "partial", updated: "18 juin 2026" },
];

export const allocations = [
  { label: "Actions & ETF", value: 214960, percent: 51, color: "#8f85ff" },
  { label: "Immobilier net", value: 160000, percent: 37.9, color: "#d7b36a" },
  { label: "Liquidités", value: 28760, percent: 6.8, color: "#9b91c9" },
  { label: "Crypto", value: 18130, percent: 4.3, color: "#df7d72" },
];

export const dataIssues = [
  { severity: "high", title: "Historique crypto incomplet", detail: "3 achats antérieurs au premier import sont manquants. Le PRU et la plus-value restent masqués.", action: "Importer un ancien CSV", target: "Portefeuille crypto" },
  { severity: "medium", title: "Estimation immobilière à confirmer", detail: "La valeur de 245 000 € date de 19 jours et provient d'une saisie manuelle.", action: "Mettre à jour la valeur", target: "Appartement Lyon" },
  { severity: "medium", title: "Taux USD/EUR indirect", detail: "Deux transactions utilisent le taux de change quotidien, faute de taux d'exécution.", action: "Saisir les taux réels", target: "CTO Monde" },
  { severity: "low", title: "Doublon écarté", detail: "Un dividende TotalEnergies identique a été détecté et laissé en attente.", action: "Vérifier", target: "Import juin 2026" },
];

export const dividends = [
  { asset: "TotalEnergies", date: "01/07/2026", gross: 284.4, tax: 0, net: 284.4, status: "Annoncé", reliability: "reliable" as const },
  { asset: "Microsoft", date: "11/09/2026", gross: 55.5, tax: 8.33, net: 47.17, status: "Estimé", reliability: "estimated" as const },
  { asset: "Amundi MSCI World", date: "N/A", gross: 0, tax: 0, net: 0, status: "Capitalisant", reliability: "verified" as const },
];
