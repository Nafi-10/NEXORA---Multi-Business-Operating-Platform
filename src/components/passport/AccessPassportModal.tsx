import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  KeyRound,
  CheckCircle2,
  Lock,
  Clock,
  Send,
  Building,
  Check,
  X,
  ShieldCheck
} from 'lucide-react';
import { PlatformRole } from '../../types/auth';

interface AccessPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessPassportModal: React.FC<AccessPassportModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    entities,
    submitAccessRequest,
    accessRequests,
    approveAccessRequest,
    rejectAccessRequest,
    setCurrentEntityId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'request' | 'reviews'>('matrix');
  const [selectedEntityId, setSelectedEntityId] = useState(entities[0]?.id || '');
  const [requestedRole, setRequestedRole] = useState<PlatformRole>('finance_manager');
  const [durationDays, setDurationDays] = useState(30);
  const [justification, setJustification] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAccessRequest(selectedEntityId, requestedRole, durationDays, justification);
    setJustification('');
    setActiveTab('matrix');
  };

  const pendingRequests = accessRequests.filter(r => r.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg">
              <KeyRound className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Company Access Badges & Permissions
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Current User: <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> ({currentUser.title})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs p-1.5 rounded-lg cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-colors cursor-pointer ${
              activeTab === 'matrix' ? 'border-sky-600 text-sky-700 dark:text-sky-400' : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            My Company Access Badges
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-colors cursor-pointer ${
              activeTab === 'request' ? 'border-sky-600 text-sky-700 dark:text-sky-400' : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            Ask for Access to a Locked Company
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reviews' ? 'border-sky-600 text-sky-700 dark:text-sky-400' : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <span>Admin Review Queue</span>
            {pendingRequests.length > 0 && (
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: Entity Passport Matrix */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Your Access Badges keep company data safely separate. If an entity is <strong>Locked</strong>, you can submit a quick request with a reason to obtain access.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {entities.map(ent => {
                  const grant = currentUser.accessPassport.find(g => g.entityId === ent.id);
                  const isApproved = grant?.status === 'approved' || currentUser.isPlatformOwner;
                  const isLocked = !isApproved;

                  return (
                    <div
                      key={ent.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                        isApproved
                          ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 shadow-2xs'
                          : 'bg-slate-100/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-75'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400">{ent.code}</span>
                          {isApproved ? (
                            <span className="text-[10px] text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                              <Lock className="w-3.5 h-3.5" /> Locked
                            </span>
                          )}
                        </div>

                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-2">{ent.name}</div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 capitalize font-medium">{ent.type} · {ent.currency}</div>

                        {grant?.expiresAt && (
                          <div className="mt-2 text-[10px] bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60 px-2 py-1 rounded flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>Valid until: {new Date(grant.expiresAt).toLocaleDateString()}</span>
                          </div>
                        )}

                        {grant?.justification && (
                          <div className="mt-2 text-[10px] text-slate-600 dark:text-slate-300 italic">
                            "{grant.justification}"
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                        {isApproved ? (
                          <button
                            onClick={() => {
                              setCurrentEntityId(ent.id);
                              onClose();
                            }}
                            className="w-full py-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-600/30 dark:hover:bg-sky-600/50 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Open This Company
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedEntityId(ent.id);
                              setActiveTab('request');
                            }}
                            className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Request Access →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Request Access Form */}
          {activeTab === 'request' && (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ask for Company Access</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Choose the company and role you need. A company administrator will review your request.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Which Company Do You Need to Access?
                </label>
                <select
                  value={selectedEntityId}
                  onChange={e => setSelectedEntityId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-medium"
                >
                  {entities.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.code} - {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    What Role Do You Need?
                  </label>
                  <select
                    value={requestedRole}
                    onChange={e => setRequestedRole(e.target.value as PlatformRole)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-medium"
                  >
                    <option value="business_admin">Company Admin (Full)</option>
                    <option value="finance_manager">Finance Manager</option>
                    <option value="sales_executive">Sales Representative</option>
                    <option value="hr_manager">HR Manager</option>
                    <option value="group_auditor">Auditor (View Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    How Many Days?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    required
                    value={durationDays}
                    onChange={e => setDurationDays(parseInt(e.target.value) || 30)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Reason for Access Request
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why you need access (e.g. Cross-selling retail goods, financial audit review)..."
                  value={justification}
                  onChange={e => setJustification(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Request to Administrator</span>
              </button>
            </form>
          )}

          {/* TAB 3: Business Admin Review Queue */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Pending access requests submitted across your companies. Admins can grant or reject requests with one click.
              </div>

              {accessRequests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-300 font-medium">No pending access requests.</div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                  {accessRequests.map(req => (
                    <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">{req.userName}</span>
                          <span className="text-slate-400">wants access to</span>
                          <span className="text-sky-700 dark:text-sky-400 font-bold">{req.entityName}</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-800 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                            Role: {req.requestedRole} ({req.durationDays} days)
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic font-medium">
                          Reason: "{req.justification}"
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-300 mt-1">Submitted: {new Date(req.submittedAt).toLocaleString()}</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {req.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => rejectAccessRequest(req.id, 'Insufficient justification')}
                              className="px-3 py-1.5 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-300 dark:border-rose-900 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3 h-3" /> Decline
                            </button>
                            <button
                              onClick={() => approveAccessRequest(req.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <Check className="w-3 h-3" /> Grant Access
                            </button>
                          </>
                        ) : (
                          <span
                            className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded border ${
                              req.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                            }`}
                          >
                            {req.status === 'approved' ? 'Access Granted' : 'Declined'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
