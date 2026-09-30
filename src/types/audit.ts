export interface AuditLogEntry {
  id: string;
  index: number;
  prevHash: string;
  hash: string;
  timestamp: string; // ISO UTC
  actorId: string;
  actorName: string;
  actorRole: string;
  entityId: string;
  entityCode: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'BREAK_GLASS' | 'ACCESS_GRANT' | 'INTERCOMPANY_POST';
  module: 'AUTH' | 'FINANCE' | 'INVENTORY' | 'SALES' | 'PROCUREMENT' | 'HR' | 'INTERCOMPANY' | 'SYSTEM';
  description: string;
  beforeState?: Record<string, any> | null;
  afterState?: Record<string, any> | null;
}

export interface HashVerificationResult {
  valid: boolean;
  totalBlocks: number;
  compromisedIndex?: number;
  reason?: string;
  verifiedAt: string;
}
