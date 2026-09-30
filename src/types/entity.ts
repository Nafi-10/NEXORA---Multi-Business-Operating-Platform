export type BusinessType = 'manufacturing' | 'retail' | 'services' | 'holding';

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  currency: string;
  balance: number; // In minor units (cents) or standard currency
}

export interface BusinessEntity {
  id: string;
  code: string;
  name: string;
  type: BusinessType;
  currency: string;
  currencySymbol: string;
  country: string;
  taxId: string;
  fiscalYearStart: string; // e.g. "01-01"
  status: 'active' | 'archived' | 'sandbox';
  description: string;
  bankAccounts: BankAccount[];
  color: string;
  headquarters: string;
  createdAt: string;
}

export interface EntitySummaryKPI {
  entityId: string;
  revenueYTD: number;
  expensesYTD: number;
  netProfit: number;
  cashBalance: number;
  openInvoicesCount: number;
  openInvoicesValue: number;
  pendingApprovalsCount: number;
  stockValuation: number;
  employeeCount: number;
}
