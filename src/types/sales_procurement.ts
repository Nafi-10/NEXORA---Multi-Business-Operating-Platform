export interface Customer {
  id: string;
  entityId: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  creditLimit: number;
  creditDays: number;
  currentBalance: number;
  status: 'active' | 'hold' | 'inactive';
}

export interface Vendor {
  id: string;
  entityId: string;
  name: string;
  code: string;
  contactPerson: string;
  email: string;
  paymentTerms: string;
  rating: number; // 1 to 5
  totalBilled: number;
  status: 'active' | 'suspended';
}

export interface PurchaseOrderItem {
  id: string;
  itemId: string;
  itemName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  entityId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  date: string;
  expectedDelivery: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  status: 'draft' | 'pending_cfo_approval' | 'pending_admin_approval' | 'approved' | 'grn_received' | 'billed' | 'rejected';
  requiresCFOApproval: boolean;
  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  threeWayMatchStatus?: 'MATCHED' | 'DISCREPANCY' | 'PENDING_GRN' | 'PENDING_BILL';
}

export interface SalesOrder {
  id: string;
  entityId: string;
  soNumber: string;
  customerId: string;
  customerName: string;
  date: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  grandTotal: number;
  status: 'draft' | 'confirmed' | 'fulfilled' | 'invoiced' | 'cancelled';
  createdBy: string;
}
