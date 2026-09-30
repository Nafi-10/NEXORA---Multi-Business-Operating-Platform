export type IntercompanyType = 'TRADE' | 'LOAN' | 'MANAGEMENT_FEE' | 'STOCK_TRANSFER';

export interface IntercompanyTransaction {
  id: string;
  transactionNumber: string;
  sourceEntityId: string;
  sourceEntityName: string;
  sourceDocType: 'INVOICE' | 'PAYMENT' | 'JOURNAL';
  sourceDocId: string;
  targetEntityId: string;
  targetEntityName: string;
  targetDocType: 'BILL' | 'RECEIPT' | 'JOURNAL';
  targetDocId: string;
  type: IntercompanyType;
  amount: number;
  currency: string;
  exchangeRate: number; // to base group currency USD
  status: 'PENDING_CONFIRMATION' | 'POSTED_MIRRORED' | 'DISPUTED' | 'ELIMINATED';
  disputeReason?: string;
  createdAt: string;
  postedAt?: string;
}

export interface IntercompanyPairBalance {
  entityAId: string;
  entityAName: string;
  entityBId: string;
  entityBName: string;
  balanceOwedByBToA: number; // positive means B owes A
  isReconciled: boolean;
  unreconciledDifference: number;
}

export interface EliminationEntry {
  id: string;
  period: string;
  intercompanyTransactionId: string;
  description: string;
  amount: number;
  eliminationDebitAccount: string;
  eliminationCreditAccount: string;
  isEliminated: boolean;
}
