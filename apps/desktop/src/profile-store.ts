import Database from "@tauri-apps/plugin-sql";
import { DATABASE_URL } from "@ostiro/database";
import { PUBLIC_BUILD } from "./build-mode";
import { demoProfile, initials, type LocalProfile, type ProfileDraft } from "./profile-types";

const STORAGE_KEY = "ostiro.local-profiles.v1";

function isTauri() {
  return Boolean(window.__TAURI_INTERNALS__);
}

function loadWebProfiles(): LocalProfile[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as LocalProfile[];
    const localProfiles = parsed.filter((profile) => !profile.isDemo && profile.id !== demoProfile.id);
    return PUBLIC_BUILD ? localProfiles : [demoProfile, ...localProfiles];
  } catch {
    return PUBLIC_BUILD ? [] : [demoProfile];
  }
}

function saveWebProfiles(profiles: LocalProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles.filter((profile) => !profile.isDemo)));
}

async function database() {
  return Database.load(DATABASE_URL);
}

export async function hashProfileSecret(secret: string, salt: string) {
  const bytes = new TextEncoder().encode(`${salt}:${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function listLocalProfiles(): Promise<LocalProfile[]> {
  if (!isTauri()) return loadWebProfiles();
  const db = await database();
  const rows = await db.select<Array<{
    id: string; display_name: string; created_at: string; last_opened_at: string | null;
    secret_hash: string | null; secret_salt: string | null; is_demo: number;
    preferences_json: string | null; last_backup_at: string | null; backup_encrypted: number | null;
  }>>(`
    SELECT p.id, p.display_name, p.created_at, p.last_opened_at, p.secret_hash, p.secret_salt, p.is_demo,
           pp.preferences_json, bs.last_backup_at, bs.encrypted AS backup_encrypted
    FROM profiles p
    LEFT JOIN profile_preferences pp ON pp.profile_id = p.id
    LEFT JOIN backup_settings bs ON bs.profile_id = p.id
    WHERE p.deleted_at IS NULL
    ORDER BY p.is_demo DESC, COALESCE(p.last_opened_at, p.created_at) DESC
  `);
  const profiles = rows.map((row): LocalProfile => {
    const stored = row.preferences_json ? JSON.parse(row.preferences_json) as LocalProfile["answers"] : demoProfile.answers;
    return {
      id: row.id,
      name: row.display_name,
      initials: initials(row.display_name),
      createdAt: row.created_at,
      lastOpenedAt: row.last_opened_at ?? row.created_at,
      lastBackupAt: row.last_backup_at,
      backupStatus: row.last_backup_at ? (row.backup_encrypted ? "protected" : "local") : "not_configured",
      isDemo: Boolean(row.is_demo),
      isProtected: Boolean(row.secret_hash),
      ...(row.secret_hash ? { secretHash: row.secret_hash } : {}),
      ...(row.secret_salt ? { secretSalt: row.secret_salt } : {}),
      answers: stored,
    };
  });
  if (PUBLIC_BUILD) return profiles.filter((profile) => !profile.isDemo && profile.id !== demoProfile.id);
  return profiles.some((profile) => profile.id === demoProfile.id) ? profiles : [demoProfile, ...profiles];
}

export async function createLocalProfile(draft: ProfileDraft): Promise<LocalProfile> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const salt = draft.protectionEnabled ? crypto.randomUUID() : "";
  const secretHash = draft.protectionEnabled && draft.secret ? await hashProfileSecret(draft.secret, salt) : "";
  const { name, secret: _secret, ...answers } = draft;
  const profile: LocalProfile = {
    id,
    name: name.trim(),
    initials: initials(name),
    createdAt: now,
    lastOpenedAt: now,
    lastBackupAt: null,
    backupStatus: draft.backupTarget === "none" ? "not_configured" : draft.encryptedBackup ? "protected" : "local",
    isDemo: draft.startMethod === "demo",
    isProtected: Boolean(secretHash),
    ...(secretHash ? { secretHash, secretSalt: salt } : {}),
    answers,
  };

  if (!isTauri()) {
    const profiles = loadWebProfiles();
    saveWebProfiles([...profiles.filter((item) => item.id !== profile.id), profile]);
    return profile;
  }

  const db = await database();
  await db.execute(
    `INSERT INTO profiles (id, display_name, base_currency, locale, created_at, updated_at, last_opened_at, secret_hash, secret_salt, is_demo)
     VALUES ($1,$2,$3,'fr-FR',$4,$4,$4,$5,$6,$7)`,
    [id, profile.name, answers.currency, now, secretHash || null, salt || null, profile.isDemo ? 1 : 0],
  );
  await db.execute(
    `INSERT INTO profile_preferences (profile_id, theme, experience_level, primary_goal, tracked_assets_json, preferences_json, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [id, answers.theme, answers.experience, answers.primaryGoal, JSON.stringify(answers.trackedAssets), JSON.stringify(answers), now],
  );
  const answerEntries: Array<[string, unknown]> = Object.entries(answers);
  for (const [question, value] of answerEntries) {
    await db.execute(
      "INSERT INTO onboarding_answers (id, profile_id, question_key, answer_json, created_at, updated_at) VALUES ($1,$2,$3,$4,$5,$5)",
      [crypto.randomUUID(), id, question, JSON.stringify(value), now],
    );
  }
  await db.execute(
    `INSERT INTO backup_settings (profile_id, target_type, target_path, encrypted, automatic, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$6)`,
    [id, answers.backupTarget, answers.backupPath || null, answers.encryptedBackup ? 1 : 0, answers.backupTarget === "none" ? 0 : 1, now],
  );
  return profile;
}

export async function verifyProfileSecret(profile: LocalProfile, secret: string) {
  if (!profile.isProtected || !profile.secretHash || !profile.secretSalt) return true;
  return (await hashProfileSecret(secret, profile.secretSalt)) === profile.secretHash;
}

export async function markProfileOpened(profile: LocalProfile) {
  const now = new Date().toISOString();
  if (!isTauri()) {
    const profiles = loadWebProfiles().map((item) => item.id === profile.id ? { ...item, lastOpenedAt: now } : item);
    saveWebProfiles(profiles);
    return;
  }
  const db = await database();
  await db.execute("UPDATE profiles SET last_opened_at = $1, updated_at = $1 WHERE id = $2", [now, profile.id]);
}

export async function duplicateProfile(profile: LocalProfile) {
  return createLocalProfile({ ...profile.answers, name: `${profile.name} (copie)`, secret: "", protectionEnabled: false });
}

export async function deleteProfile(profile: LocalProfile) {
  if (profile.isDemo) return;
  if (!isTauri()) {
    saveWebProfiles(loadWebProfiles().filter((item) => item.id !== profile.id));
    return;
  }
  const db = await database();
  await db.execute("UPDATE profiles SET deleted_at = $1 WHERE id = $2", [new Date().toISOString(), profile.id]);
}

export async function updateLocalProfile(profile: LocalProfile, changes: Partial<LocalProfile["answers"]> & { name?: string }) {
  const name = changes.name !== undefined ? changes.name.trim() : profile.name;
  const { name: _, ...answersChanges } = changes;
  const updated: LocalProfile = { 
    ...profile, 
    name,
    initials: initials(name),
    answers: { ...profile.answers, ...answersChanges } 
  };
  if (!isTauri()) {
    saveWebProfiles(loadWebProfiles().map((item) => item.id === profile.id ? updated : item));
    return updated;
  }
  const db = await database();
  const now = new Date().toISOString();
  await db.execute("UPDATE profiles SET display_name = $1, base_currency = $2, updated_at = $3 WHERE id = $4", [updated.name, updated.answers.currency, now, profile.id]);
  await db.execute(
    `INSERT INTO profile_preferences (profile_id, theme, experience_level, primary_goal, tracked_assets_json, preferences_json, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT(profile_id) DO UPDATE SET theme=$2, experience_level=$3, primary_goal=$4, tracked_assets_json=$5, preferences_json=$6, updated_at=$7`,
    [profile.id, updated.answers.theme, updated.answers.experience, updated.answers.primaryGoal, JSON.stringify(updated.answers.trackedAssets), JSON.stringify(updated.answers), now],
  );
  return updated;
}
