export type PlatformRole = 
  | 'platform_owner'
  | 'group_ceo'
  | 'group_cfo'
  | 'group_auditor'
  | 'group_controller'
  | 'business_admin'
  | 'finance_manager'
  | 'sales_executive'
  | 'hr_manager'
  | 'inventory_keeper'
  | 'custom_role';

export type PermissionKey =
  | 'platform.manage'
  | 'entity.manage'
  | 'user.manage.entity'
  | 'finance.ledger.view'
  | 'finance.ledger.create'
  | 'finance.ledger.approve'
  | 'finance.invoice.view'
  | 'finance.invoice.create'
  | 'finance.invoice.approve'
  | 'finance.period.lock'
  | 'sales.quote.create'
  | 'sales.order.create'
  | 'sales.invoice.create'
  | 'sales.customer.manage'
  | 'procurement.po.create'
  | 'procurement.po.approve'
  | 'inventory.item.view'
  | 'inventory.item.manage'
  | 'inventory.stock.transfer'
  | 'hr.employee.view'
  | 'hr.employee.manage'
  | 'hr.payroll.view'
  | 'hr.payroll.process'
  | 'report.entity'
  | 'report.consolidated'
  | 'intercompany.view'
  | 'intercompany.approve'
  | 'audit.vault.view'
  | 'audit.vault.verify'
  | 'breakglass.execute';

export interface EntityAccessGrant {
  entityId: string;
  role: PlatformRole;
  status: 'approved' | 'locked' | 'pending' | 'expired';
  grantedAt?: string;
  expiresAt?: string; // ISO string if time-boxed
  justification?: string;
  scope?: {
    branch?: string;
    hideCostPrice?: boolean;
    hideSalary?: boolean;
  };
}

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  baseRole: PlatformRole;
  isPlatformOwner: boolean;
  mfaEnabled: boolean;
  accessPassport: EntityAccessGrant[];
}

export interface BreakGlassSession {
  active: boolean;
  entityId: string;
  initiatedBy: string;
  reason: string;
  startedAt: string;
  expiresAt: string;
  alertBroadcastSent: boolean;
}

export interface AccessRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  entityId: string;
  entityName: string;
  requestedRole: PlatformRole;
  durationDays: number;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
}
