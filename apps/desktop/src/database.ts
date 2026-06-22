import Database from "@tauri-apps/plugin-sql";
import { DATABASE_URL } from "@ostiro/database";
import { PUBLIC_BUILD } from "./build-mode";

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}

let database: Database | null = null;

export async function initializeLocalDatabase() {
  if (!window.__TAURI_INTERNALS__) return null;
  database ??= await Database.load(DATABASE_URL);
  if (PUBLIC_BUILD) {
    await database.execute("DELETE FROM data_sources WHERE profile_id = 'demo-profile'");
    await database.execute("DELETE FROM profiles WHERE id = 'demo-profile'");
    return database;
  }
  const now = new Date().toISOString();
  await database.execute(
    "INSERT OR IGNORE INTO profiles (id, display_name, base_currency, locale, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $5)",
    ["demo-profile", "Jeanne — Démo", "EUR", "fr-FR", now],
  );
  await database.execute(
    "INSERT OR IGNORE INTO data_sources (id, profile_id, kind, label, observed_at, imported_at, created_at) VALUES ($1, $2, $3, $4, $5, $5, $5)",
    ["demo-source", "demo-profile", "demo", "Compte de démonstration Ostiro", now],
  );
  return database;
}
