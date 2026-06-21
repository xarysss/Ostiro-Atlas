export type ConnectionStatus = "pending" | "active" | "degraded" | "expired" | "revoked" | "error";

export interface BankInstitution {
  id: string;
  name: string;
  country: string;
  logoUrl?: string;
}

export interface BankConnection {
  id: string;
  providerId: string;
  institutionId: string;
  status: ConnectionStatus;
  readOnly: true;
  lastSyncAt: string | null;
  errorCode?: string;
  safeErrorMessage?: string;
}

export interface BankAccountRecord {
  externalId: string;
  name: string;
  type: string;
  currency: string;
  balance: string;
  observedAt: string;
}

export interface BankTransactionRecord {
  externalId: string;
  accountExternalId: string;
  occurredAt: string;
  label: string;
  amount: string;
  currency: string;
}

export interface ConsentRequest {
  redirectUrl: string;
  state: string;
}

export interface BankProvider {
  readonly id: string;
  readonly displayName: string;
  readonly readOnly: true;
  listInstitutions(country: string): Promise<BankInstitution[]>;
  startConsent(institutionId: string, returnUrl: string): Promise<ConsentRequest>;
  completeAuthorization(callbackUrl: string, expectedState: string): Promise<BankConnection>;
  syncAccounts(connectionId: string): Promise<BankAccountRecord[]>;
  syncTransactions(connectionId: string, since?: string): Promise<BankTransactionRecord[]>;
  getConnectionStatus(connectionId: string): Promise<BankConnection>;
  revokeAccess(connectionId: string): Promise<void>;
}

export class ConnectionsUnavailableError extends Error {
  constructor() {
    super("Les connexions automatiques ne sont pas disponibles dans la V1 locale. Utilisez l'import CSV.");
    this.name = "ConnectionsUnavailableError";
  }
}

export class LocalCsvOnlyProvider implements BankProvider {
  readonly id = "local-csv";
  readonly displayName = "Import CSV local";
  readonly readOnly = true as const;
  async listInstitutions(): Promise<BankInstitution[]> { return []; }
  async startConsent(): Promise<ConsentRequest> { throw new ConnectionsUnavailableError(); }
  async completeAuthorization(): Promise<BankConnection> { throw new ConnectionsUnavailableError(); }
  async syncAccounts(): Promise<BankAccountRecord[]> { throw new ConnectionsUnavailableError(); }
  async syncTransactions(): Promise<BankTransactionRecord[]> { throw new ConnectionsUnavailableError(); }
  async getConnectionStatus(): Promise<BankConnection> { throw new ConnectionsUnavailableError(); }
  async revokeAccess(): Promise<void> { throw new ConnectionsUnavailableError(); }
}
