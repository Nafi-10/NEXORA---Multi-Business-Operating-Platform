import { UserPersona, PermissionKey, PlatformRole } from '../types/auth';

/**
 * Standard permissions mapping by role
 */
export const ROLE_PERMISSIONS: Record<PlatformRole, PermissionKey[]> = {
  platform_owner: [
    'platform.manage',
    'audit.vault.view',
    'audit.vault.verify',
    'breakglass.execute',
    'report.consolidated'
  ],
  group_ceo: [
    'report.consolidated',
    'report.entity',
    'finance.ledger.view',
    'finance.invoice.view',
    'intercompany.view',
    'audit.vault.view'
  ],
  group_cfo: [
    'report.consolidated',
    'report.entity',
    'finance.ledger.view',
    'finance.ledger.approve',
    'finance.invoice.view',
    'finance.invoice.approve',
    'procurement.po.approve',
    'intercompany.view',
    'intercompany.approve',
    'audit.vault.view'
  ],
  group_auditor: [
    'report.consolidated',
    'report.entity',
    'finance.ledger.view',
    'finance.invoice.view',
    'audit.vault.view',
    'audit.vault.verify',
    'intercompany.view'
  ],
  group_controller: [
    'report.consolidated',
    'finance.ledger.view',
    'finance.invoice.view',
    'finance.period.lock',
    'intercompany.view',
    'intercompany.approve'
  ],
  business_admin: [
    'entity.manage',
    'user.manage.entity',
    'finance.ledger.view',
    'finance.ledger.create',
    'finance.ledger.approve',
    'finance.invoice.view',
    'finance.invoice.create',
    'finance.invoice.approve',
    'finance.period.lock',
    'sales.quote.create',
    'sales.order.create',
    'sales.invoice.create',
    'sales.customer.manage',
    'procurement.po.create',
    'procurement.po.approve',
    'inventory.item.view',
    'inventory.item.manage',
    'inventory.stock.transfer',
    'hr.employee.view',
    'hr.employee.manage',
    'hr.payroll.view',
    'hr.payroll.process',
    'report.entity',
    'intercompany.view',
    'audit.vault.view'
  ],
  finance_manager: [
    'finance.ledger.view',
    'finance.ledger.create',
    'finance.ledger.approve',
    'finance.invoice.view',
    'finance.invoice.create',
    'finance.invoice.approve',
    'finance.period.lock',
    'procurement.po.approve',
    'report.entity',
    'intercompany.view',
    'intercompany.approve',
    'audit.vault.view'
  ],
  sales_executive: [
    'sales.quote.create',
    'sales.order.create',
    'sales.invoice.create',
    'sales.customer.manage',
    'inventory.item.view',
    'report.entity'
  ],
  hr_manager: [
    'hr.employee.view',
    'hr.employee.manage',
    'hr.payroll.view',
    'hr.payroll.process',
    'report.entity'
  ],
  inventory_keeper: [
    'inventory.item.view',
    'inventory.item.manage',
    'inventory.stock.transfer',
    'report.entity'
  ],
  custom_role: []
};

/**
 * 3-Dimensional Authorization check:
 * Dimension 1: Role / Permissions
 * Dimension 2: Business Entity (Approved passport status + unexpired)
 * Dimension 3: Data Scope & Field Level limitations
 */
export function check3DAuthorization(
  user: UserPersona,
  entityId: string,
  permission: PermissionKey,
  isBreakGlassActive = false
): { authorized: boolean; reason?: string } {
  // If global consolidated report requested
  if (permission === 'report.consolidated') {
    if (['platform_owner', 'group_ceo', 'group_cfo', 'group_auditor', 'group_controller'].includes(user.baseRole)) {
      return { authorized: true };
    }
    return { authorized: false, reason: 'Requires Group-level role for consolidated views' };
  }

  // Break-glass override bypasses entity boundary if initiated for this entity
  if (isBreakGlassActive) {
    return { authorized: true, reason: 'Break-glass temporary emergency override' };
  }

  // Dimension 2: Check Access Passport for target entity
  const grant = user.accessPassport.find(g => g.entityId === entityId);
  if (!grant) {
    return { authorized: false, reason: 'No passport entry for this entity (LOCKED)' };
  }

  if (grant.status === 'locked') {
    return { authorized: false, reason: 'Entity access is LOCKED. Must request access via Access Passport.' };
  }

  if (grant.status === 'pending') {
    return { authorized: false, reason: 'Access request is currently pending Business Admin review.' };
  }

  if (grant.status === 'expired') {
    return { authorized: false, reason: 'Time-boxed access has expired.' };
  }

  // Check time-boxed expiry date if set
  if (grant.expiresAt) {
    const expiry = new Date(grant.expiresAt).getTime();
    if (Date.now() > expiry) {
      return { authorized: false, reason: `Time-boxed access expired at ${grant.expiresAt}.` };
    }
  }

  // Dimension 1: Check permissions for the active role inside this entity
  const effectiveRole = grant.role || user.baseRole;
  const permissions = ROLE_PERMISSIONS[effectiveRole] || [];

  if (!permissions.includes(permission)) {
    return {
      authorized: false,
      reason: `Role '${effectiveRole}' lacks permission '${permission}' in entity '${entityId}'.`
    };
  }

  return { authorized: true };
}

/**
 * Segregation of Duties (SoD) Enforcer:
 * The creator of a payment, PO, or invoice cannot approve their own document!
 */
export function validateSegregationOfDuties(
  creatorId: string,
  approverId: string,
  actionName = 'Approval'
): { valid: boolean; violationReason?: string } {
  if (creatorId === approverId) {
    return {
      valid: false,
      violationReason: `Segregation of Duties Violation: Document creator (${creatorId}) is strictly prohibited from executing ${actionName}. An independent reviewer must approve.`
    };
  }
  return { valid: true };
}

/**
 * Field-level privacy and cost price masking:
 * Ali (Sales Executive) or unauthorized users should see masked salary & cost price
 */
export function maskSensitiveValue(
  value: number | string,
  user: UserPersona,
  entityId: string,
  field: 'salary' | 'cost_price' | 'bank_account'
): string {
  // Determine if user can see raw value
  const grant = user.accessPassport.find(g => g.entityId === entityId);
  const effectiveRole = grant?.role || user.baseRole;

  if (field === 'salary') {
    // Only HR Manager, Group CFO, or Business Admin can see salary
    const canSee = ['hr_manager', 'business_admin', 'group_cfo'].includes(effectiveRole);
    if (!canSee) {
      return '•••••• (Protected)';
    }
    return typeof value === 'number' ? `$${value.toLocaleString()}` : String(value);
  }

  if (field === 'cost_price') {
    // Sales Executive should NOT see cost price
    const hideCost = grant?.scope?.hideCostPrice ?? (effectiveRole === 'sales_executive');
    if (hideCost) {
      return '•••• (Restricted)';
    }
    return typeof value === 'number' ? `$${value.toLocaleString()}` : String(value);
  }

  if (field === 'bank_account') {
    const str = String(value);
    return str.length > 4 ? `•••• •••• ${str.slice(-4)}` : '••••';
  }

  return String(value);
}
