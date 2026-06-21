PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  base_currency TEXT NOT NULL DEFAULT 'EUR' CHECK (length(base_currency) = 3),
  locale TEXT NOT NULL DEFAULT 'fr-FR',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS data_sources (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('manual','csv_import','calculation','market_data','opening_balance','demo')),
  label TEXT NOT NULL,
  observed_at TEXT,
  imported_at TEXT,
  file_hash TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  institution TEXT,
  currency TEXT NOT NULL CHECK (length(currency) = 3),
  opening_date TEXT,
  history_complete INTEGER NOT NULL DEFAULT 0 CHECK (history_complete IN (0,1)),
  reliability_status TEXT NOT NULL DEFAULT 'unknown',
  reliability_score INTEGER NOT NULL DEFAULT 0 CHECK (reliability_score BETWEEN 0 AND 100),
  archived_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  symbol TEXT,
  isin TEXT,
  native_currency TEXT NOT NULL CHECK (length(native_currency) = 3),
  country TEXT,
  sector TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  UNIQUE(isin)
);

CREATE TABLE IF NOT EXISTS imports (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  source_id TEXT NOT NULL REFERENCES data_sources(id),
  file_name TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  row_count INTEGER NOT NULL DEFAULT 0,
  accepted_count INTEGER NOT NULL DEFAULT 0,
  rejected_count INTEGER NOT NULL DEFAULT 0,
  duplicate_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  mapping_json TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  UNIQUE(profile_id, file_hash)
);

CREATE TABLE IF NOT EXISTS import_templates (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  mapping_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(profile_id, fingerprint)
);

CREATE TABLE IF NOT EXISTS raw_import_rows (
  id TEXT PRIMARY KEY,
  import_id TEXT NOT NULL REFERENCES imports(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  raw_json TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(import_id, row_number)
);

CREATE TRIGGER IF NOT EXISTS raw_import_rows_immutable_update
BEFORE UPDATE ON raw_import_rows BEGIN
  SELECT RAISE(ABORT, 'raw import rows are immutable');
END;

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  asset_id TEXT REFERENCES assets(id) ON DELETE RESTRICT,
  source_id TEXT NOT NULL REFERENCES data_sources(id),
  raw_row_id TEXT REFERENCES raw_import_rows(id) ON DELETE RESTRICT,
  transaction_type TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  label TEXT NOT NULL,
  quantity TEXT,
  unit_price TEXT,
  amount TEXT NOT NULL,
  transaction_currency TEXT NOT NULL CHECK (length(transaction_currency) = 3),
  account_currency TEXT NOT NULL CHECK (length(account_currency) = 3),
  fx_rate_to_account TEXT,
  fx_fee TEXT,
  explicit_fee TEXT,
  fingerprint TEXT NOT NULL,
  reliability_status TEXT NOT NULL,
  reliability_score INTEGER NOT NULL CHECK (reliability_score BETWEEN 0 AND 100),
  is_estimated INTEGER NOT NULL DEFAULT 0 CHECK (is_estimated IN (0,1)),
  created_at TEXT NOT NULL,
  UNIQUE(account_id, fingerprint)
);

CREATE INDEX IF NOT EXISTS idx_transactions_account_date ON transactions(account_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_transactions_asset_date ON transactions(asset_id, occurred_at);

CREATE TABLE IF NOT EXISTS market_prices (
  id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES data_sources(id),
  observed_at TEXT NOT NULL,
  price TEXT NOT NULL,
  currency TEXT NOT NULL CHECK (length(currency) = 3),
  reliability_status TEXT NOT NULL,
  UNIQUE(asset_id, source_id, observed_at)
);

CREATE TABLE IF NOT EXISTS fx_rates (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES data_sources(id),
  observed_at TEXT NOT NULL,
  base_currency TEXT NOT NULL,
  quote_currency TEXT NOT NULL,
  rate TEXT NOT NULL,
  reliability_status TEXT NOT NULL,
  UNIQUE(source_id, observed_at, base_currency, quote_currency)
);

CREATE TABLE IF NOT EXISTS dividends (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  asset_id TEXT NOT NULL REFERENCES assets(id),
  source_id TEXT NOT NULL REFERENCES data_sources(id),
  status TEXT NOT NULL CHECK (status IN ('historical','announced','estimated','paid')),
  ex_date TEXT,
  payment_date TEXT,
  gross_amount TEXT NOT NULL,
  withholding_tax TEXT NOT NULL DEFAULT '0',
  net_amount TEXT,
  currency TEXT NOT NULL,
  reliability_status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS fees (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  transaction_id TEXT REFERENCES transactions(id) ON DELETE SET NULL,
  asset_id TEXT REFERENCES assets(id) ON DELETE SET NULL,
  source_id TEXT NOT NULL REFERENCES data_sources(id),
  fee_type TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  is_estimated INTEGER NOT NULL DEFAULT 0,
  reliability_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS calculation_snapshots (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metric TEXT NOT NULL,
  value_json TEXT,
  as_of TEXT NOT NULL,
  engine_version TEXT NOT NULL,
  formula TEXT NOT NULL,
  inputs_json TEXT NOT NULL,
  source_ids_json TEXT NOT NULL,
  reliability_status TEXT NOT NULL,
  reliability_score INTEGER NOT NULL,
  reasons_json TEXT NOT NULL DEFAULT '[]',
  missing_data_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_snapshots_entity_metric ON calculation_snapshots(entity_type, entity_id, metric, as_of);

CREATE TABLE IF NOT EXISTS corrections (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  field_name TEXT NOT NULL,
  old_value_json TEXT,
  new_value_json TEXT NOT NULL,
  reason TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'local_user',
  calculation_impact_json TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_value_json TEXT,
  new_value_json TEXT,
  reason TEXT NOT NULL,
  calculation_impact_json TEXT NOT NULL DEFAULT '[]',
  author TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id, created_at);

CREATE TABLE IF NOT EXISTS sync_connections (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  institution TEXT NOT NULL,
  status TEXT NOT NULL,
  read_only INTEGER NOT NULL DEFAULT 1,
  last_success_at TEXT,
  last_attempt_at TEXT,
  revoked_at TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_events (
  id TEXT PRIMARY KEY,
  connection_id TEXT NOT NULL REFERENCES sync_connections(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  error_code TEXT,
  safe_message TEXT,
  missing_data_json TEXT NOT NULL DEFAULT '[]',
  started_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(profile_id, key)
);
