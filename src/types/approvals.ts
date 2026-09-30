import { PlatformRole } from './auth';

export interface ApprovalRule {
  id: string;
  name: string;
  documentType: 'PURCHASE_ORDER' | 'PAYMENT' | 'JOURNAL_ENTRY' | 'ACCESS_REQUEST' | 'EXPENSE';
  thresholdAmount: number; // e.g. > $10,000
  requiredRole: PlatformRole;
  requiresSegregationOfDuties: boolean; // creator cannot approve!
  escalationHours: number;
}

export interface ApprovalItem {
  id: string;
  entityId: string;
  entityName: string;
  documentType: 'PURCHASE_ORDER' | 'PAYMENT' | 'JOURNAL_ENTRY' | 'ACCESS_REQUEST';
  documentId: string;
  referenceNumber: string;
  title: string;
  amount?: number;
  currency?: string;
  requestedBy: string;
  requestedByName: string;
  submittedAt: string;
  slaDeadline: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';
  requiredRole: PlatformRole;
  approverComments?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}
