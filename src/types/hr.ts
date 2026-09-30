export interface Employee {
  id: string;
  entityId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  joinDate: string;
  baseSalary: number; // Masked for unauthorized roles (e.g. Sales Exec Ali)
  currency: string;
  bankAccountMasked: string;
  status: 'active' | 'on_leave' | 'terminated';
  leaveBalanceDays: number;
}

export interface LeaveRequest {
  id: string;
  entityId: string;
  employeeId: string;
  employeeName: string;
  type: 'ANNUAL' | 'SICK' | 'UNPAID' | 'EMERGENCY';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedBy?: string;
}

export interface PayrollRun {
  id: string;
  entityId: string;
  period: string; // e.g. "September 2026"
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  employeeCount: number;
  status: 'draft' | 'processed' | 'disbursed';
  processedAt?: string;
  processedBy?: string;
}
