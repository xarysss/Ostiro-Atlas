ALTER TABLE profiles ADD COLUMN last_opened_at TEXT;
ALTER TABLE profiles ADD COLUMN secret_hash TEXT;
ALTER TABLE profiles ADD COLUMN secret_salt TEXT;
ALTER TABLE profiles ADD COLUMN is_demo INTEGER NOT NULL DEFAULT 0 CHECK (is_demo IN (0,1));
ALTER TABLE profiles ADD COLUMN deleted_at TEXT;

UPDATE profiles SET is_demo = 1 WHERE id = 'demo-profile';

CREATE TABLE IF NOT EXISTS profile_preferences (
  profile_id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark',
  experience_level TEXT NOT NULL DEFAULT 'casual',
  primary_goal TEXT,
  tracked_assets_json TEXT NOT NULL DEFAULT '[]',
  preferences_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS onboarding_answers (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_key TEXT NOT NULL,
  answer_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(profile_id, question_key)
);

CREATE TABLE IF NOT EXISTS local_accounts (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  currency TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  portfolio_type TEXT NOT NULL,
  currency TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  label TEXT NOT NULL,
  target_amount TEXT,
  target_date TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS backup_settings (
  profile_id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL DEFAULT 'none',
  target_path TEXT,
  encrypted INTEGER NOT NULL DEFAULT 0 CHECK (encrypted IN (0,1)),
  automatic INTEGER NOT NULL DEFAULT 0 CHECK (automatic IN (0,1)),
  last_backup_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS demo_profiles (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  scenario TEXT NOT NULL,
  seed_version INTEGER NOT NULL DEFAULT 1,
  profile_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_onboarding_profile ON onboarding_answers(profile_id);
CREATE INDEX IF NOT EXISTS idx_local_accounts_profile ON local_accounts(profile_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_profile ON portfolios(profile_id);
CREATE INDEX IF NOT EXISTS idx_goals_profile ON goals(profile_id);
