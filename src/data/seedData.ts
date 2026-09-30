import { BusinessEntity } from '../types/entity';
import { UserPersona, AccessRequest } from '../types/auth';
import { AuditLogEntry } from '../types/audit';
import { ChartAccount, JournalEntry, ARInvoice, APBill } from '../types/finance';
import { InventoryItem, Warehouse } from '../types/inventory';
import { Customer, Vendor, PurchaseOrder, SalesOrder } from '../types/sales_procurement';
import { Employee, LeaveRequest, PayrollRun } from '../types/hr';
import { IntercompanyTransaction, IntercompanyPairBalance } from '../types/intercompany';
import { ApprovalItem } from '../types/approvals';
import { IndustryTemplate } from '../types/templates';

// 3 DEMO BUSINESSES
export const INITIAL_ENTITIES: BusinessEntity[] = [
  {
    id: 'ent_mfg_01',
    code: 'MFG-A',
    name: 'Apex Heavy Industries Ltd',
    type: 'manufacturing',
    currency: 'USD',
    currencySymbol: '$',
    country: 'United States',
    taxId: 'US-9482104-M',
    fiscalYearStart: '01-01',
    status: 'active',
    description: 'Precision industrial equipment, CNC assemblies, and heavy mechanical manufacturing.',
    headquarters: 'Detroit, Michigan',
    color: '#0284c7', // Sky-600
    createdAt: '2024-01-15T00:00:00Z',
    bankAccounts: [
      { id: 'bank_mfg_1', bankName: 'JPMorgan Chase Corp', accountNumber: '883920194821', currency: 'USD', balance: 3420000 },
      { id: 'bank_mfg_2', bankName: 'Comerica Treasury', accountNumber: '472910394812', currency: 'USD', balance: 840000 }
    ]
  },
  {
    id: 'ent_ret_02',
    code: 'RET-B',
    name: 'Nova Commerce & Retail Corp',
    type: 'retail',
    currency: 'EUR',
    currencySymbol: '€',
    country: 'Germany',
    taxId: 'DE-2938102-R',
    fiscalYearStart: '01-01',
    status: 'active',
    description: 'Omnichannel consumer electronics, European retail chain, and regional logistics network.',
    headquarters: 'Frankfurt, Germany',
    color: '#059669', // Emerald-600
    createdAt: '2024-03-01T00:00:00Z',
    bankAccounts: [
      { id: 'bank_ret_1', bankName: 'Deutsche Bank Commercial', accountNumber: 'DE89370400440532013000', currency: 'EUR', balance: 1890000 },
      { id: 'bank_ret_2', bankName: 'BNP Paribas EU Ops', accountNumber: 'FR76300060000112345678', currency: 'EUR', balance: 410000 }
    ]
  },
  {
    id: 'ent_srv_03',
    code: 'SRV-C',
    name: 'Zenith Global Advisory Group',
    type: 'services',
    currency: 'GBP',
    currencySymbol: '£',
    country: 'United Kingdom',
    taxId: 'GB-9928103-S',
    fiscalYearStart: '01-01',
    status: 'active',
    description: 'Strategic consulting, mergers & acquisitions corporate advisory, and enterprise IT strategy.',
    headquarters: 'London, UK',
    color: '#7c3aed', // Violet-600
    createdAt: '2024-06-15T00:00:00Z',
    bankAccounts: [
      { id: 'bank_srv_1', bankName: 'Barclays Corporate UK', accountNumber: '200000-88492011', currency: 'GBP', balance: 950000 }
    ]
  }
];

// 5 DEMO USERS (Ahmed, Sara, Ali, Fatima, Khalid)
export const INITIAL_USERS: UserPersona[] = [
  {
    id: 'usr_ahmed',
    name: 'Ahmed Al-Mansoor',
    email: 'ahmed.mansoor@nexora.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: 'Platform Owner & Group Chief Architect',
    baseRole: 'platform_owner',
    isPlatformOwner: true,
    mfaEnabled: true,
    accessPassport: [
      { entityId: 'ent_mfg_01', role: 'business_admin', status: 'approved', grantedAt: '2024-01-01T00:00:00Z' },
      { entityId: 'ent_ret_02', role: 'business_admin', status: 'approved', grantedAt: '2024-01-01T00:00:00Z' },
      { entityId: 'ent_srv_03', role: 'business_admin', status: 'approved', grantedAt: '2024-01-01T00:00:00Z' }
    ]
  },
  {
    id: 'usr_sara',
    name: 'Sara Lindqvist',
    email: 'sara.l@apexmanufacturing.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    title: 'Finance Manager',
    baseRole: 'finance_manager',
    isPlatformOwner: false,
    mfaEnabled: true,
    accessPassport: [
      { entityId: 'ent_mfg_01', role: 'finance_manager', status: 'approved', grantedAt: '2024-02-01T00:00:00Z' },
      { entityId: 'ent_ret_02', role: 'finance_manager', status: 'locked', justification: 'Requires Europe CFO approval' },
      { entityId: 'ent_srv_03', role: 'finance_manager', status: 'locked' }
    ]
  },
  {
    id: 'usr_ali',
    name: 'Ali Reza Khan',
    email: 'ali.khan@novaretail.eu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'Senior Sales Executive',
    baseRole: 'sales_executive',
    isPlatformOwner: false,
    mfaEnabled: false,
    accessPassport: [
      { entityId: 'ent_mfg_01', role: 'sales_executive', status: 'locked' },
      { 
        entityId: 'ent_ret_02', 
        role: 'sales_executive', 
        status: 'approved', 
        grantedAt: '2024-03-15T00:00:00Z',
        scope: { hideCostPrice: true, hideSalary: true }
      },
      { entityId: 'ent_srv_03', role: 'sales_executive', status: 'locked' }
    ]
  },
  {
    id: 'usr_fatima',
    name: 'Fatima El-Amrani',
    email: 'fatima.e@zenithadvisory.co.uk',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    title: 'Head of People & HR Operations',
    baseRole: 'hr_manager',
    isPlatformOwner: false,
    mfaEnabled: true,
    accessPassport: [
      { entityId: 'ent_mfg_01', role: 'hr_manager', status: 'locked' },
      { entityId: 'ent_ret_02', role: 'hr_manager', status: 'locked' },
      { entityId: 'ent_srv_03', role: 'hr_manager', status: 'approved', grantedAt: '2024-06-20T00:00:00Z' }
    ]
  },
  {
    id: 'usr_khalid',
    name: 'Khalid Benjelloun',
    email: 'khalid.auditor@nexoragroup.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    title: 'Senior Group Compliance Auditor',
    baseRole: 'group_auditor',
    isPlatformOwner: false,
    mfaEnabled: true,
    accessPassport: [
      { 
        entityId: 'ent_mfg_01', 
        role: 'group_auditor', 
        status: 'approved', 
        grantedAt: '2026-09-15T00:00:00Z',
        expiresAt: '2026-10-15T00:00:00Z', // 30-day time-boxed access!
        justification: 'Quarterly group audit & statutory compliance verification'
      },
      { 
        entityId: 'ent_ret_02', 
        role: 'group_auditor', 
        status: 'approved', 
        grantedAt: '2026-09-15T00:00:00Z',
        expiresAt: '2026-10-15T00:00:00Z',
        justification: 'Quarterly group audit & statutory compliance verification'
      },
      { 
        entityId: 'ent_srv_03', 
        role: 'group_auditor', 
        status: 'approved', 
        grantedAt: '2026-09-15T00:00:00Z',
        expiresAt: '2026-10-15T00:00:00Z',
        justification: 'Quarterly group audit & statutory compliance verification'
      }
    ]
  }
];

// CHART OF ACCOUNTS FOR ENTITIES
export const INITIAL_ACCOUNTS: ChartAccount[] = [
  // Apex Heavy Industries (MFG-A)
  { id: 'acc_mfg_1010', entityId: 'ent_mfg_01', code: '1010', name: 'Operating Cash & Bank', category: 'ASSET', balance: 3420000, isActive: true, currency: 'USD' },
  { id: 'acc_mfg_1100', entityId: 'ent_mfg_01', code: '1100', name: 'Accounts Receivable (Trade)', category: 'ASSET', balance: 1250000, isActive: true, currency: 'USD' },
  { id: 'acc_mfg_1200', entityId: 'ent_mfg_01', code: '1200', name: 'Raw Materials Inventory', category: 'ASSET', balance: 890000, isActive: true, currency: 'USD' },
  { id: 'acc_mfg_1210', entityId: 'ent_mfg_01', code: '1210', name: 'Work in Progress (WIP)', category: 'ASSET', balance: 540000, isActive: true, currency: 'USD' },
  { id: 'acc_mfg_1220', entityId: 'ent_mfg_01', code: '1220', name: 'Finished Goods Inventory', category: 'ASSET', balance: 1120000, isActive: true, currency: 'USD' },
  { id: 'acc_mfg_2010', entityId: 'ent_mfg_01', code: '2010', name: 'Accounts Payable (Trade)', category: 'LIABILITY', balance: 740000, isActive: true, currency: 'USD' },
  { id: 'acc_mfg_2150', entityId: 'ent_mfg_01', code: '2150', name: 'Intercompany Clearing Account (Nova EUR)', category: 'LIABILITY', balance: 145000, isActive: true, currency: 'USD' },
  { id: 'acc_mfg_3010', entityId: 'ent_mfg_01', code: '3010', name: 'Share Capital & Paid-in Equity', category: 'EQUITY', balance: 4000000, isActive: true, currency: 'USD' },
  { id: 'acc_mfg_4010', entityId: 'ent_mfg_01', code: '4010', name: 'Manufacturing Equipment Sales', category: 'REVENUE', balance: 4890000, isActive: true, currency: 'USD' },
  { id: 'acc_mfg_5010', entityId: 'ent_mfg_01', code: '5010', name: 'Cost of Goods Sold (Materials)', category: 'EXPENSE', balance: 2150000, isActive: true, currency: 'USD' },
  { id: 'acc_mfg_6010', entityId: 'ent_mfg_01', code: '6010', name: 'Factory Plant & Overhead Utilities', category: 'EXPENSE', balance: 420000, isActive: true, currency: 'USD' },

  // Nova Retail (RET-B)
  { id: 'acc_ret_1010', entityId: 'ent_ret_02', code: '1010', name: 'Commercial Treasury Bank', category: 'ASSET', balance: 1890000, isActive: true, currency: 'EUR' },
  { id: 'acc_ret_1100', entityId: 'ent_ret_02', code: '1100', name: 'Retail POS & B2B Receivables', category: 'ASSET', balance: 680000, isActive: true, currency: 'EUR' },
  { id: 'acc_ret_1200', entityId: 'ent_ret_02', code: '1200', name: 'Consumer Merchandise Stock', category: 'ASSET', balance: 1450000, isActive: true, currency: 'EUR' },
  { id: 'acc_ret_1350', entityId: 'ent_ret_02', code: '1350', name: 'Intercompany Receivable (Apex USD)', category: 'ASSET', balance: 132000, isActive: true, currency: 'EUR' },
  { id: 'acc_ret_2010', entityId: 'ent_ret_02', code: '2010', name: 'Supplier Accounts Payable', category: 'LIABILITY', balance: 820000, isActive: true, currency: 'EUR' },
  { id: 'acc_ret_3010', entityId: 'ent_ret_02', code: '3010', name: 'Contributed Capital', category: 'EQUITY', balance: 2500000, isActive: true, currency: 'EUR' },
  { id: 'acc_ret_4010', entityId: 'ent_ret_02', code: '4010', name: 'Retail Store Sales', category: 'REVENUE', balance: 3950000, isActive: true, currency: 'EUR' },
  { id: 'acc_ret_5010', entityId: 'ent_ret_02', code: '5010', name: 'COGS Wholesale Merchandise', category: 'EXPENSE', balance: 2310000, isActive: true, currency: 'EUR' },

  // Zenith Services (SRV-C)
  { id: 'acc_srv_1010', entityId: 'ent_srv_03', code: '1010', name: 'Barclays Operating Account', category: 'ASSET', balance: 950000, isActive: true, currency: 'GBP' },
  { id: 'acc_srv_1100', entityId: 'ent_srv_03', code: '1100', name: 'Client Retainer Receivables', category: 'ASSET', balance: 410000, isActive: true, currency: 'GBP' },
  { id: 'acc_srv_2010', entityId: 'ent_srv_03', code: '2010', name: 'Consultant Payables & Vendors', category: 'LIABILITY', balance: 190000, isActive: true, currency: 'GBP' },
  { id: 'acc_srv_3010', entityId: 'ent_srv_03', code: '3010', name: 'Partnership Equity', category: 'EQUITY', balance: 1200000, isActive: true, currency: 'GBP' },
  { id: 'acc_srv_4010', entityId: 'ent_srv_03', code: '4010', name: 'Corporate Advisory Retainers', category: 'REVENUE', balance: 1650000, isActive: true, currency: 'GBP' },
  { id: 'acc_srv_6010', entityId: 'ent_srv_03', code: '6010', name: 'Professional Payroll & Per Diems', category: 'EXPENSE', balance: 890000, isActive: true, currency: 'GBP' }
];

// INITIAL JOURNAL ENTRIES
export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'je_mfg_001',
    entityId: 'ent_mfg_01',
    entryNumber: 'JE-2026-0089',
    date: '2026-09-18',
    memo: 'Bi-weekly factory payroll disbursement and tax withholding',
    reference: 'PAYROLL-CYCLE-18',
    status: 'posted',
    postedAt: '2026-09-18T14:30:00Z',
    createdBy: 'usr_sara',
    createdByName: 'Sara Lindqvist',
    approvedBy: 'usr_ahmed',
    totalDebit: 185000,
    totalCredit: 185000,
    lines: [
      { id: 'line_1', accountId: 'acc_mfg_6010', accountCode: '6010', accountName: 'Factory Plant & Overhead Utilities', description: 'Factory labor expense', debit: 185000, credit: 0 },
      { id: 'line_2', accountId: 'acc_mfg_1010', accountCode: '1010', accountName: 'Operating Cash & Bank', description: 'Payroll bank transfer', debit: 0, credit: 185000 }
    ]
  },
  {
    id: 'je_ret_001',
    entityId: 'ent_ret_02',
    entryNumber: 'JE-2026-0142',
    date: '2026-09-20',
    memo: 'Intercompany inventory purchase receipt from Apex Heavy Industries (MFG-A)',
    reference: 'IC-TX-9901',
    status: 'posted',
    postedAt: '2026-09-20T10:15:00Z',
    createdBy: 'usr_ahmed',
    createdByName: 'Ahmed Al-Mansoor',
    approvedBy: 'usr_ahmed',
    isIntercompany: true,
    linkedTransactionId: 'ic_tx_01',
    totalDebit: 132000,
    totalCredit: 132000,
    lines: [
      { id: 'line_r1', accountId: 'acc_ret_1200', accountCode: '1200', accountName: 'Consumer Merchandise Stock', description: 'Stock received from Apex Mfg', debit: 132000, credit: 0 },
      { id: 'line_r2', accountId: 'acc_ret_1350', accountCode: '1350', accountName: 'Intercompany Receivable (Apex USD)', description: 'Intercompany counter balance', debit: 0, credit: 132000 }
    ]
  }
];

// INVENTORY ITEMS
export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'item_mfg_01',
    entityId: 'ent_mfg_01',
    sku: 'MFG-CNC-500',
    name: 'Titanium 5-Axis CNC Milling Spindle',
    category: 'Precision Hardware',
    uom: 'pcs',
    valuationMethod: 'FIFO',
    costPrice: 8400, // Masked for Ali
    sellingPrice: 14200,
    reorderPoint: 15,
    reorderQuantity: 30,
    totalStock: 42,
    stockByWarehouse: { wh_mfg_main: 32, wh_mfg_plant2: 10 }
  },
  {
    id: 'item_mfg_02',
    entityId: 'ent_mfg_01',
    sku: 'MFG-ACT-120',
    name: 'Heavy Duty Hydraulic Actuator 120KN',
    category: 'Hydraulics',
    uom: 'pcs',
    valuationMethod: 'WEIGHTED_AVERAGE',
    costPrice: 2200,
    sellingPrice: 3850,
    reorderPoint: 25,
    reorderQuantity: 50,
    totalStock: 68,
    stockByWarehouse: { wh_mfg_main: 50, wh_mfg_plant2: 18 }
  },
  {
    id: 'item_ret_01',
    entityId: 'ent_ret_02',
    sku: 'RET-LOG-X9',
    name: 'Nexora Edge IoT Gateway Router',
    category: 'Networking',
    uom: 'pcs',
    valuationMethod: 'FIFO',
    costPrice: 140,
    sellingPrice: 289,
    reorderPoint: 100,
    reorderQuantity: 250,
    totalStock: 320,
    stockByWarehouse: { wh_ret_frankfurt: 220, wh_ret_munich: 100 }
  },
  {
    id: 'item_ret_02',
    entityId: 'ent_ret_02',
    sku: 'RET-DISP-4K',
    name: 'Industrial Touch Display Panel 24"',
    category: 'Displays',
    uom: 'pcs',
    valuationMethod: 'FIFO',
    costPrice: 310,
    sellingPrice: 599,
    reorderPoint: 40,
    reorderQuantity: 100,
    totalStock: 34, // Below reorder point!
    stockByWarehouse: { wh_ret_frankfurt: 24, wh_ret_munich: 10 }
  }
];

export const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: 'wh_mfg_main', entityId: 'ent_mfg_01', code: 'WH-DETROIT-01', name: 'Detroit Central Plant Logistics', location: 'Detroit, MI', capacityUsedPercentage: 74 },
  { id: 'wh_mfg_plant2', entityId: 'ent_mfg_01', code: 'WH-AUBURN-02', name: 'Auburn Hills Assembly Hub', location: 'Auburn Hills, MI', capacityUsedPercentage: 58 },
  { id: 'wh_ret_frankfurt', entityId: 'ent_ret_02', code: 'WH-FRA-01', name: 'Frankfurt Central Distribution', location: 'Frankfurt Airport Cargo City', capacityUsedPercentage: 82 },
  { id: 'wh_ret_munich', entityId: 'ent_ret_02', code: 'WH-MUC-02', name: 'Munich South Fulfillment Hub', location: 'Munich, Germany', capacityUsedPercentage: 45 }
];

// SALES & PROCUREMENT
export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust_mfg_1', entityId: 'ent_mfg_01', code: 'CUST-CAT-01', name: 'Caterpillar Global Mobility', contactPerson: 'Mark Evans', email: 'm.evans@cat-mobility.com', creditLimit: 500000, creditDays: 60, currentBalance: 240000, status: 'active' },
  { id: 'cust_mfg_2', entityId: 'ent_mfg_01', code: 'CUST-BOSCH-02', name: 'Robert Bosch Powertrain Systems', contactPerson: 'Klaus Fischer', email: 'k.fischer@bosch.de', creditLimit: 750000, creditDays: 45, currentBalance: 410000, status: 'active' },
  { id: 'cust_ret_1', entityId: 'ent_ret_02', code: 'CUST-MEDIAM-01', name: 'MediaSaturn Retail Alliance', contactPerson: 'Sabine Weber', email: 's.weber@mediasaturn.eu', creditLimit: 300000, creditDays: 30, currentBalance: 145000, status: 'active' }
];

export const INITIAL_VENDORS: Vendor[] = [
  { id: 'vend_mfg_1', entityId: 'ent_mfg_01', code: 'VEND-THYSSEN', name: 'ThyssenKrupp Steel & Alloys', contactPerson: 'Heinrich Braun', email: 'supplies@thyssenkrupp.com', paymentTerms: 'Net 30', rating: 4.8, totalBilled: 1250000, status: 'active' },
  { id: 'vend_ret_1', entityId: 'ent_ret_02', code: 'VEND-FOXCONN', name: 'Foxconn European Assembly', contactPerson: 'Lin Chen', email: 'procurement@foxconn-eu.com', paymentTerms: 'Net 45', rating: 4.6, totalBilled: 890000, status: 'active' }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po_mfg_001',
    entityId: 'ent_mfg_01',
    poNumber: 'PO-2026-0811',
    vendorId: 'vend_mfg_1',
    vendorName: 'ThyssenKrupp Steel & Alloys',
    date: '2026-09-22',
    expectedDelivery: '2026-10-10',
    requiresCFOApproval: true,
    grandTotal: 48500, // > $10,000 threshold
    subtotal: 45000,
    taxTotal: 3500,
    status: 'pending_cfo_approval',
    createdBy: 'usr_sara',
    createdByName: 'Sara Lindqvist',
    threeWayMatchStatus: 'PENDING_GRN',
    items: [
      { id: 'poi_1', itemId: 'item_mfg_01', itemName: 'Titanium 5-Axis CNC Milling Spindle', sku: 'MFG-CNC-500', quantity: 5, unitPrice: 9000, total: 45000 }
    ]
  },
  {
    id: 'po_ret_001',
    entityId: 'ent_ret_02',
    poNumber: 'PO-2026-0344',
    vendorId: 'vend_ret_1',
    vendorName: 'Foxconn European Assembly',
    date: '2026-09-15',
    expectedDelivery: '2026-09-28',
    requiresCFOApproval: false,
    grandTotal: 8400,
    subtotal: 7800,
    taxTotal: 600,
    status: 'approved',
    createdBy: 'usr_ahmed',
    createdByName: 'Ahmed Al-Mansoor',
    approvedBy: 'usr_ahmed',
    approvedAt: '2026-09-16T11:00:00Z',
    threeWayMatchStatus: 'MATCHED',
    items: [
      { id: 'poi_2', itemId: 'item_ret_01', itemName: 'Nexora Edge IoT Gateway Router', sku: 'RET-LOG-X9', quantity: 60, unitPrice: 130, total: 7800 }
    ]
  }
];

export const INITIAL_INVOICES: ARInvoice[] = [
  {
    id: 'inv_mfg_101',
    entityId: 'ent_mfg_01',
    invoiceNumber: 'INV-MFG-2026-041',
    customerId: 'cust_mfg_1',
    customerName: 'Caterpillar Global Mobility',
    issueDate: '2026-09-10',
    dueDate: '2026-10-25',
    subtotal: 142000,
    taxTotal: 14200,
    grandTotal: 156200,
    amountPaid: 0,
    status: 'approved',
    createdBy: 'usr_sara',
    createdByName: 'Sara Lindqvist',
    approvedBy: 'usr_ahmed',
    items: [
      { id: 'invi_1', description: 'CNC Milling Spindles - Production Batch 4', quantity: 10, unitPrice: 14200, taxRate: 0.1, total: 142000 }
    ]
  },
  {
    id: 'inv_ret_201',
    entityId: 'ent_ret_02',
    invoiceNumber: 'INV-RET-2026-089',
    customerId: 'cust_ret_1',
    customerName: 'MediaSaturn Retail Alliance',
    issueDate: '2026-09-12',
    dueDate: '2026-10-12',
    subtotal: 43350,
    taxTotal: 8236.5,
    grandTotal: 51586.5,
    amountPaid: 51586.5,
    status: 'paid',
    createdBy: 'usr_ali',
    createdByName: 'Ali Reza Khan',
    approvedBy: 'usr_ahmed',
    items: [
      { id: 'invi_2', description: 'Edge IoT Gateway Retail Units', quantity: 150, unitPrice: 289, taxRate: 0.19, total: 43350 }
    ]
  }
];

// HR & EMPLOYEES
export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp_01',
    entityId: 'ent_mfg_01',
    employeeCode: 'EMP-MFG-001',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'm.vance@apexmanufacturing.com',
    department: 'Engineering & Production',
    designation: 'Lead CNC Machinist',
    joinDate: '2022-04-10',
    baseSalary: 92000, // Masked for Ali
    currency: 'USD',
    bankAccountMasked: '•••• •••• 9281',
    status: 'active',
    leaveBalanceDays: 14
  },
  {
    id: 'emp_02',
    entityId: 'ent_mfg_01',
    employeeCode: 'EMP-MFG-002',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'e.rostova@apexmanufacturing.com',
    department: 'Quality Assurance',
    designation: 'Senior QA Inspector',
    joinDate: '2023-01-15',
    baseSalary: 84000,
    currency: 'USD',
    bankAccountMasked: '•••• •••• 1044',
    status: 'active',
    leaveBalanceDays: 18
  },
  {
    id: 'emp_03',
    entityId: 'ent_ret_02',
    employeeCode: 'EMP-RET-001',
    firstName: 'Sophie',
    lastName: 'Mueller',
    email: 's.mueller@novaretail.eu',
    department: 'Retail Distribution',
    designation: 'Regional Logistics Supervisor',
    joinDate: '2023-08-01',
    baseSalary: 68000,
    currency: 'EUR',
    bankAccountMasked: '•••• •••• 4405',
    status: 'active',
    leaveBalanceDays: 22
  },
  {
    id: 'emp_04',
    entityId: 'ent_srv_03',
    employeeCode: 'EMP-SRV-001',
    firstName: 'David',
    lastName: 'Sterling',
    email: 'd.sterling@zenithadvisory.co.uk',
    department: 'Strategy & Advisory',
    designation: 'Principal Partner',
    joinDate: '2021-11-01',
    baseSalary: 145000,
    currency: 'GBP',
    bankAccountMasked: '•••• •••• 8849',
    status: 'active',
    leaveBalanceDays: 12
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave_01',
    entityId: 'ent_mfg_01',
    employeeId: 'emp_01',
    employeeName: 'Marcus Vance',
    type: 'ANNUAL',
    startDate: '2026-10-05',
    endDate: '2026-10-09',
    days: 5,
    reason: 'Annual family autumn leave',
    status: 'pending',
    submittedAt: '2026-09-24T09:12:00Z'
  },
  {
    id: 'leave_02',
    entityId: 'ent_srv_03',
    employeeId: 'emp_04',
    employeeName: 'David Sterling',
    type: 'ANNUAL',
    startDate: '2026-09-28',
    endDate: '2026-10-02',
    days: 5,
    reason: 'Client engagement offsite rest period',
    status: 'approved',
    submittedAt: '2026-09-18T10:00:00Z',
    approvedBy: 'usr_fatima'
  }
];

// INTERCOMPANY TRANSACTIONS
export const INITIAL_INTERCOMPANY_TXS: IntercompanyTransaction[] = [
  {
    id: 'ic_tx_01',
    transactionNumber: 'IC-2026-0041',
    sourceEntityId: 'ent_mfg_01',
    sourceEntityName: 'Apex Heavy Industries Ltd',
    sourceDocType: 'INVOICE',
    sourceDocId: 'inv_mfg_ic_01',
    targetEntityId: 'ent_ret_02',
    targetEntityName: 'Nova Commerce & Retail Corp',
    targetDocType: 'BILL',
    targetDocId: 'bill_ret_ic_01',
    type: 'TRADE',
    amount: 145000,
    currency: 'USD',
    exchangeRate: 0.91, // 1 USD = 0.91 EUR
    status: 'POSTED_MIRRORED',
    createdAt: '2026-09-18T11:00:00Z',
    postedAt: '2026-09-18T11:05:00Z'
  },
  {
    id: 'ic_tx_02',
    transactionNumber: 'IC-2026-0042',
    sourceEntityId: 'ent_srv_03',
    sourceEntityName: 'Zenith Global Advisory Group',
    sourceDocType: 'INVOICE',
    sourceDocId: 'inv_srv_ic_02',
    targetEntityId: 'ent_mfg_01',
    targetEntityName: 'Apex Heavy Industries Ltd',
    targetDocType: 'BILL',
    targetDocId: 'bill_mfg_ic_02',
    type: 'MANAGEMENT_FEE',
    amount: 45000,
    currency: 'GBP',
    exchangeRate: 1.32, // 1 GBP = 1.32 USD
    status: 'PENDING_CONFIRMATION',
    createdAt: '2026-09-25T14:20:00Z'
  }
];

export const INITIAL_INTERCOMPANY_PAIRS: IntercompanyPairBalance[] = [
  {
    entityAId: 'ent_mfg_01',
    entityAName: 'Apex Heavy Industries (MFG-A)',
    entityBId: 'ent_ret_02',
    entityBName: 'Nova Commerce & Retail (RET-B)',
    balanceOwedByBToA: 145000,
    isReconciled: true,
    unreconciledDifference: 0
  },
  {
    entityAId: 'ent_srv_03',
    entityAName: 'Zenith Advisory (SRV-C)',
    entityBId: 'ent_mfg_01',
    entityBName: 'Apex Heavy Industries (MFG-A)',
    balanceOwedByBToA: 59400,
    isReconciled: false,
    unreconciledDifference: 14400 // Pending confirmation
  }
];

// APPROVAL ITEMS QUEUE
export const INITIAL_APPROVAL_ITEMS: ApprovalItem[] = [
  {
    id: 'appr_01',
    entityId: 'ent_mfg_01',
    entityName: 'Apex Heavy Industries Ltd',
    documentType: 'PURCHASE_ORDER',
    documentId: 'po_mfg_001',
    referenceNumber: 'PO-2026-0811',
    title: 'Purchase Order > $10,000: Titanium Spindles for Factory Batch',
    amount: 48500,
    currency: 'USD',
    requestedBy: 'usr_sara',
    requestedByName: 'Sara Lindqvist',
    submittedAt: '2026-09-22T08:30:00Z',
    slaDeadline: '2026-09-30T17:00:00Z',
    status: 'PENDING',
    requiredRole: 'group_cfo'
  },
  {
    id: 'appr_02',
    entityId: 'ent_srv_03',
    entityName: 'Zenith Global Advisory Group',
    documentType: 'ACCESS_REQUEST',
    documentId: 'req_access_01',
    referenceNumber: 'REQ-SEC-2026-09',
    title: 'Access Request: Ali Reza Khan requesting Sales Access to Zenith Advisory',
    requestedBy: 'usr_ali',
    requestedByName: 'Ali Reza Khan',
    submittedAt: '2026-09-26T12:00:00Z',
    slaDeadline: '2026-09-29T18:00:00Z',
    status: 'PENDING',
    requiredRole: 'business_admin'
  }
];

// ACCESS REQUESTS
export const INITIAL_ACCESS_REQUESTS: AccessRequest[] = [
  {
    id: 'req_access_01',
    userId: 'usr_ali',
    userName: 'Ali Reza Khan',
    userEmail: 'ali.khan@novaretail.eu',
    entityId: 'ent_srv_03',
    entityName: 'Zenith Global Advisory Group',
    requestedRole: 'sales_executive',
    durationDays: 60,
    justification: 'Coordinating cross-selling advisory retainers with enterprise European retail accounts.',
    status: 'pending',
    submittedAt: '2026-09-26T12:00:00Z'
  }
];

// INDUSTRY TEMPLATES FOR NEXORA STUDIO
export const INITIAL_TEMPLATES: IndustryTemplate[] = [
  {
    id: 'tmpl_mfg',
    name: 'Industrial & Discrete Manufacturing',
    businessType: 'manufacturing',
    description: 'Preconfigured multi-warehouse raw materials, WIP accounts, standard bill of materials, and production work orders.',
    defaultCurrency: 'USD',
    recommendedChartAccountsCount: 68,
    standardModules: ['General Ledger', 'Accounts Payable/Receivable', 'Inventory & Bins', 'Procurement & 3-Way Match', 'Production Floor'],
    tags: ['Discrete Mfg', 'Heavy Equipment', 'Automotive Supplies'],
    sampleRoles: ['Plant Manager', 'Quality Controller', 'Procurement Officer']
  },
  {
    id: 'tmpl_ret',
    name: 'Omnichannel Retail & Distribution',
    businessType: 'retail',
    description: 'Optimized for high-volume SKU management, multi-store replenishment, POS reconciliation, and supplier rebate tracking.',
    defaultCurrency: 'EUR',
    recommendedChartAccountsCount: 52,
    standardModules: ['POS Clearing', 'Warehouse Logistics', 'Sales & CRM', 'Procurement', 'Fast Inventory Valuation'],
    tags: ['E-Commerce', 'B2B Wholesale', 'Retail Outlets'],
    sampleRoles: ['Store Manager', 'Inventory Auditor', 'Merchandising Lead']
  },
  {
    id: 'tmpl_srv',
    name: 'Professional Services & Consulting',
    businessType: 'services',
    description: 'Lean project accounting, time & materials client billing, milestone retainers, and partner equity allocations.',
    defaultCurrency: 'GBP',
    recommendedChartAccountsCount: 38,
    standardModules: ['Client Invoicing', 'Time Tracking', 'Expense Reimbursables', 'Partner P&L', 'HR & Payroll'],
    tags: ['Consulting', 'Legal/Advisory', 'Software Services'],
    sampleRoles: ['Engagement Partner', 'Practice Lead', 'Billing Specialist']
  }
];

// GENESIS & INITIAL HASH-CHAINED AUDIT VAULT
// Pre-computed with real SHA-256 values chaining each block
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_blk_0',
    index: 0,
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '09794e5083cfc23a7bb7418beaf6ee08f02f8f7c9e99a8cb404c0bc6248c8bcf',
    timestamp: '2024-01-01T00:00:00Z',
    actorId: 'usr_ahmed',
    actorName: 'Ahmed Al-Mansoor',
    actorRole: 'Platform Owner',
    entityId: 'PLATFORM',
    entityCode: 'SYSTEM',
    action: 'CREATE',
    module: 'SYSTEM',
    description: 'NEXORA Platform Genesis: Group security root provisioned with multi-entity partition engine',
    beforeState: null,
    afterState: { system: 'NEXORA Platform v1.0', tenantModel: 'RLS-Partitioned' }
  },
  {
    id: 'aud_blk_1',
    index: 1,
    prevHash: '09794e5083cfc23a7bb7418beaf6ee08f02f8f7c9e99a8cb404c0bc6248c8bcf',
    hash: '3bc160867cf3957eb6a6eebf7bb25dfb4db1397eeae69a71a067e41ea87d1df1',
    timestamp: '2024-01-15T00:00:00Z',
    actorId: 'usr_ahmed',
    actorName: 'Ahmed Al-Mansoor',
    actorRole: 'Platform Owner',
    entityId: 'ent_mfg_01',
    entityCode: 'MFG-A',
    action: 'CREATE',
    module: 'SYSTEM',
    description: 'Onboarded Business A: Apex Heavy Industries Ltd with USD base ledger',
    beforeState: null,
    afterState: { entityId: 'ent_mfg_01', type: 'manufacturing', currency: 'USD' }
  },
  {
    id: 'aud_blk_2',
    index: 2,
    prevHash: '3bc160867cf3957eb6a6eebf7bb25dfb4db1397eeae69a71a067e41ea87d1df1',
    hash: '7c5e2d1d40a02efd3fcb6528ec1a7e4b9bbd92e5c8227b0c8053a4cbe6a86f78',
    timestamp: '2026-09-18T11:05:00Z',
    actorId: 'usr_ahmed',
    actorName: 'Ahmed Al-Mansoor',
    actorRole: 'Platform Owner',
    entityId: 'ent_mfg_01',
    entityCode: 'MFG-A',
    action: 'INTERCOMPANY_POST',
    module: 'INTERCOMPANY',
    description: 'Mirrored intercompany sale posted: Apex Mfg (MFG-A) -> Nova Retail (RET-B) $145,000',
    beforeState: null,
    afterState: { txNumber: 'IC-2026-0041', amount: 145000, targetEntity: 'ent_ret_02' }
  },
  {
    id: 'aud_blk_3',
    index: 3,
    prevHash: '7c5e2d1d40a02efd3fcb6528ec1a7e4b9bbd92e5c8227b0c8053a4cbe6a86f78',
    hash: '0fb6ff4579be5d985a1cf3cfce1a3b1ef846b9a8960fa236d8f8e02dcb69eb1d',
    timestamp: '2026-09-22T08:35:00Z',
    actorId: 'usr_sara',
    actorName: 'Sara Lindqvist',
    actorRole: 'Finance Manager',
    entityId: 'ent_mfg_01',
    entityCode: 'MFG-A',
    action: 'CREATE',
    module: 'PROCUREMENT',
    description: 'Created PO-2026-0811 ($48,500) routed to Smart Approval Engine for CFO approval',
    beforeState: null,
    afterState: { poNumber: 'PO-2026-0811', amount: 48500, status: 'pending_cfo_approval' }
  }
];
