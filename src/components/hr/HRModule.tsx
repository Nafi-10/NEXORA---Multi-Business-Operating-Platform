import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle2,
  Calendar,
  Lock,
  DollarSign,
  ShieldCheck,
  Check
} from 'lucide-react';
import { maskSensitiveValue } from '../../lib/security';

export const HRModule: React.FC = () => {
  const {
    currentEntityId,
    activeEntity,
    employees,
    leaveRequests,
    approveLeaveRequest,
    currentUser
  } = useApp();

  const scopedEmployees = currentEntityId === 'GROUP'
    ? employees
    : employees.filter(e => e.entityId === currentEntityId);

  const scopedLeaves = currentEntityId === 'GROUP'
    ? leaveRequests
    : leaveRequests.filter(l => l.entityId === currentEntityId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Team Directory, Payroll & Staff Leaves
            </h1>
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded font-bold">
              {currentEntityId === 'GROUP' ? 'All Staff Members' : `${activeEntity?.code} Team`}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            View employee profiles, approve holiday & medical leave requests, and protect compensation privacy with role-based salary masking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-emerald-50 dark:bg-slate-800 border border-emerald-300 dark:border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Salary Privacy Guard Active</span>
          </span>
        </div>
      </div>

      {/* Salary Masking Indicator if current user has restricted view */}
      {['sales_executive', 'inventory_keeper'].includes(currentUser.baseRole) && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-300 shadow-xs">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Privacy Guard Active:</span> You are logged in as{' '}
            <strong>{currentUser.name} ({currentUser.baseRole})</strong>. Staff salaries are hidden (••••) to protect employee privacy. Only HR Managers and Company Admins can see salary amounts.
          </div>
        </div>
      )}

      {/* Employee Directory */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Staff Member Directory</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">Team members working across your company locations</p>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {scopedEmployees.length} Staff on Record
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-2.5 px-4">Staff ID</th>
                <th className="py-2.5 px-4">Employee Name</th>
                <th className="py-2.5 px-4">Department & Job Title</th>
                <th className="py-2.5 px-4">Date Joined</th>
                <th className="py-2.5 px-4 text-right">Annual Salary</th>
                <th className="py-2.5 px-4 text-right">Bank Account</th>
                <th className="py-2.5 px-4 text-center">Work Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-300">
              {scopedEmployees.map(emp => {
                const formattedSalary = maskSensitiveValue(
                  emp.baseSalary,
                  currentUser,
                  emp.entityId,
                  'salary'
                );

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-700 dark:text-sky-400">{emp.employeeCode}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{emp.firstName} {emp.lastName}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300">{emp.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-900 dark:text-slate-100 font-bold">{emp.designation}</div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{emp.department}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{emp.joinDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      {formattedSalary}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300 font-medium">
                      {emp.bankAccountMasked}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded">
                        Active Full-Time
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Requests & Approvals */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Holiday & Leave Requests</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">Approve or review staff time-off requests</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{scopedLeaves.length} Requests</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {scopedLeaves.map(leave => (
            <div key={leave.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{leave.employeeName}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                    {leave.type} LEAVE ({leave.days} days)
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{leave.startDate} to {leave.endDate}</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">
                  Reason given: "{leave.reason}"
                </div>
              </div>

              <div className="flex items-center gap-3">
                {leave.status === 'approved' ? (
                  <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Approved
                  </span>
                ) : (
                  <button
                    onClick={() => approveLeaveRequest(leave.id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve Leave
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
