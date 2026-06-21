export const DATABASE_URL = "sqlite:ostiro-atlas.db";
export const DATABASE_SCHEMA_VERSION = 1;

export interface BackupManifest {
  format: "ostiro-backup";
  version: 1;
  schemaVersion: number;
  createdAt: string;
  appVersion: string;
  encrypted: boolean;
  checksum: string;
}
