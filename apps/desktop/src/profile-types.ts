export type ExperienceLevel = "beginner" | "saver" | "casual" | "regular" | "advanced";
export type ThemePreference = "dark" | "light" | "system";
export type StartMethod = "manual" | "csv" | "demo";
export type BackupTarget = "none" | "local" | "external" | "synced_folder";

export interface OnboardingAnswers {
  ageRange: string;
  country: string;
  region: string;
  currency: string;
  theme: ThemePreference;
  experience: ExperienceLevel;
  problems: string[];
  primaryGoal: string;
  wealthRange: string;
  trackedAssets: string[];
  startMethod: StartMethod;
  backupTarget: BackupTarget;
  backupPath: string;
  encryptedBackup: boolean;
  protectionEnabled: boolean;
}

export interface LocalProfile {
  id: string;
  name: string;
  initials: string;
  createdAt: string;
  lastOpenedAt: string;
  lastBackupAt: string | null;
  backupStatus: "protected" | "local" | "not_configured";
  isDemo: boolean;
  isProtected: boolean;
  secretHash?: string;
  secretSalt?: string;
  answers: OnboardingAnswers;
}

export interface ProfileDraft extends OnboardingAnswers {
  name: string;
  secret: string;
}

export const defaultAnswers: OnboardingAnswers = {
  ageRange: "",
  country: "France",
  region: "",
  currency: "EUR",
  theme: "dark",
  experience: "casual",
  problems: [],
  primaryGoal: "track_investments",
  wealthRange: "prefer_not",
  trackedAssets: ["bank_accounts", "savings", "pea", "etf", "budget"],
  startMethod: "manual",
  backupTarget: "local",
  backupPath: "Ostiro/Backups",
  encryptedBackup: false,
  protectionEnabled: false,
};

export const demoProfile: LocalProfile = {
  id: "demo-profile",
  name: "Jeanne — Démo",
  initials: "JD",
  createdAt: "2026-01-01T10:00:00.000Z",
  lastOpenedAt: new Date().toISOString(),
  lastBackupAt: "2026-06-20T17:42:00.000Z",
  backupStatus: "protected",
  isDemo: true,
  isProtected: false,
  answers: {
    ...defaultAnswers,
    experience: "advanced",
    problems: ["excel", "clear_wealth", "fees"],
    primaryGoal: "financial_independence",
    wealthRange: "200k_500k",
    trackedAssets: ["bank_accounts", "savings", "pea", "cto", "stocks", "etf", "crypto", "real_estate", "loans", "budget", "dividends", "fees", "goals"],
    startMethod: "demo",
    backupTarget: "local",
    backupPath: "Documents/Ostiro",
    encryptedBackup: true,
  },
};

export const experienceLabels: Record<ExperienceLevel, string> = {
  beginner: "Débutant complet",
  saver: "J'ai déjà une épargne",
  casual: "J'investis déjà un peu",
  regular: "Investisseur régulier",
  advanced: "Investisseur avancé",
};

export const goalLabels: Record<string, string> = {
  balance_wealth: "Équilibrer mon patrimoine",
  track_investments: "Suivre mes investissements",
  retirement: "Préparer ma retraite",
  big_purchase: "Préparer un gros achat",
  safety_fund: "Construire une épargne de sécurité",
  transmission: "Préparer une transmission",
  financial_independence: "Atteindre l'indépendance financière",
  dividends: "Suivre mes dividendes",
  real_estate: "Suivre mon immobilier",
  crypto: "Suivre mes cryptos",
  other: "Autre",
};

export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "OA";
}
