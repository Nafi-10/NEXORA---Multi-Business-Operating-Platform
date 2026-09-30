export type AccountCategory = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface ChartAccount {
  id: string;
  entityId: string;
  code: string;
  name: string;
  category: AccountCategory;
  parentId?: string;
  balance: number; // in cents or currency unit
  isActive: boolean;
  currency: string;
}

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  entityId: string;
  entryNumber: string;
  date: string;
  memo: string;
  reference?: string;
  status: 'draft' | 'posted' | 'voided';
  postedAt?: string;
  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  isIntercompany?: boolean;
  linkedTransactionId?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number; // e.g. 0.15 for 15%
  total: number;
}

export interface ARInvoice {
  id: string;
  entityId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'paid' | 'overdue' | 'void';
  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  isIntercompany?: boolean;
  targetEntityId?: string;
}

export interface APBill {
  id: string;
  entityId: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  billDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  status: 'pending_approval' | 'approved' | 'paid' | 'overdue';
  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  isIntercompany?: boolean;
  sourceEntityId?: string;
}

export interface FiscalPeriodStatus {
  entityId: string;
  year: number;
  period: string; // e.g. "2026-Q1"
  isLocked: boolean;
  lockedAt?: string;
  lockedBy?: string;
}
