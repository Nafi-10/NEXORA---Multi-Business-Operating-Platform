import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  ShieldAlert,
  Clock,
  Check,
  X
} from 'lucide-react';
import { validateSegregationOfDuties } from '../../lib/security';

export const ApprovalEngineModule: React.FC = () => {
  const {
    approvalItems,
    resolveApproval,
    currentUser,
    currentEntityId
  } = useApp();

  const scopedItems = currentEntityId === 'GROUP'
    ? approvalItems
    : approvalItems.filter(item => item.entityId === currentEntityId);

  const pendingItems = scopedItems.filter(i => i.status === 'PENDING');
  const resolvedItems = scopedItems.filter(i => i.status !== 'PENDING');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Smart Approvals & Signoffs
            </h1>
            <span className="text-[11px] font-mono text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 px-2 py-0.5 rounded font-bold">
              {pendingItems.length} Waiting for Review
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            Quickly approve or decline purchase orders and employee access requests. Automated rules prevent self-approval and require higher managers for large expenses.
          </p>
        </div>

        <div className="text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-bold">
          Reviewing as: <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> ({currentUser.baseRole})
        </div>
      </div>

      {/* Visual Workflow Rules Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Business Approval Rules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-400">1. High-Value Orders</span>
              <span className="text-[10px] bg-sky-50 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300 dark:border-sky-700/60 px-1.5 py-0.2 rounded font-mono font-bold">
                Orders &gt; $10k
              </span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
              Any purchase over $10,000 USD automatically requires a CFO or Group Director to review and sign off.
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">2. Honesty Rule (SoD)</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 px-1.5 py-0.2 rounded font-mono font-bold">
                Strict Rule
              </span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
              The person who writes an order cannot approve it. An independent second person must always verify the bill.
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">3. Urgency Timer</span>
              <span className="text-[10px] bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 px-1.5 py-0.2 rounded font-mono font-bold">
                48 Hours
              </span>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
              Orders left waiting for more than 48 hours send urgent reminder notifications to top administrators.
            </div>
          </div>
        </div>
      </div>

      {/* Pending Items Queue */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Items Waiting for Your Decision</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">Click Approve or Decline after reviewing the details</p>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{pendingItems.length} awaiting action</span>
        </div>

        {pendingItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-300 font-medium">
            Great job! You have cleared all pending approval requests.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingItems.map(item => {
              const sodCheck = validateSegregationOfDuties(item.requestedBy, currentUser.id, 'Approval Execution');
              const isViolatingSoD = !sodCheck.valid;

              return (
                <div key={item.id} className="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-700 dark:text-sky-400 text-xs">{item.referenceNumber}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-2 font-medium">
                        <span>Company: {item.entityName}</span>
                        <span>·</span>
                        <span>Requested by: {item.requestedByName}</span>
                        <span>·</span>
                        <span className="text-amber-700 dark:text-amber-400 flex items-center gap-0.5 font-bold">
                          <Clock className="w-3.5 h-3.5 inline" /> Deadline: {new Date(item.slaDeadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.amount !== undefined && (
                        <div className="text-right mr-3">
                          <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                            ${item.amount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() => resolveApproval(item.id, 'REJECTED', 'Declined by reviewer')}
                        className="px-3.5 py-1.5 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>

                      <button
                        onClick={() => resolveApproval(item.id, 'APPROVED')}
                        disabled={isViolatingSoD}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    </div>
                  </div>

                  {isViolatingSoD && (
                    <div className="p-3 bg-amber-50 dark:bg-rose-950/60 border border-amber-300 dark:border-rose-800/80 rounded-xl text-xs text-amber-900 dark:text-rose-200 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-rose-400 shrink-0" />
                      <div>
                        <span className="font-bold">Honesty Rule Enforced:</span> You ({currentUser.name}) created this item. To prevent conflicts of interest, an independent team member must approve it.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resolved History */}
      {resolvedItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Previously Resolved Items</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">History of approved and declined requests</p>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {resolvedItems.map(item => (
              <div key={item.id} className="p-3.5 flex items-center justify-between text-slate-800 dark:text-slate-200">
                <div>
                  <span className="font-mono text-sky-700 dark:text-sky-400 font-bold">{item.referenceNumber}</span> - {item.title}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Approved/Declined by {item.resolvedBy} at {item.resolvedAt}</div>
                </div>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                    item.status === 'APPROVED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700/60'
                      : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-700/60'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
