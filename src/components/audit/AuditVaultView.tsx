import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Fingerprint
} from 'lucide-react';
import { HashVerificationResult } from '../../types/audit';

export const AuditVaultView: React.FC = () => {
  const {
    auditLogs,
    verifyVaultChain,
    injectTamperAudit,
    resetToSeedData,
    showToast
  } = useApp();

  const [verificationResult, setVerificationResult] = useState<HashVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [filterModule, setFilterModule] = useState('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    try {
      const res = await verifyVaultChain();
      setVerificationResult(res);
      if (res.valid) {
        showToast('Cryptographic Verification: All digital seals are 100% untampered and valid.');
      } else {
        showToast(`TAMPER DETECTED: Chain compromised at block #${res.compromisedIndex}!`);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filterModule !== 'ALL' && log.module !== filterModule) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        log.description.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.entityCode.toLowerCase().includes(q) ||
        log.hash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tamper-Proof Audit Vault
            </h1>
            <span className="text-[11px] font-mono text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded font-bold">
              SHA-256 Digital Seals
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            A permanent digital seal is attached to every transaction, invoice, and admin action. You can click 'Verify Digital Seals' anytime to mathematically prove that no past records have been altered.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => injectTamperAudit(1)}
            title="Simulate an unauthorized change to test our tamper detection"
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Simulate Tamper Attack</span>
          </button>

          <button
            onClick={handleVerifyChain}
            disabled={isVerifying}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isVerifying ? 'Checking Digital Seals...' : 'Verify All Digital Seals'}</span>
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationResult && (
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-4 animate-in fade-in ${
            verificationResult.valid
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-600/50 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-600 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {verificationResult.valid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold text-sm">
                {verificationResult.valid
                  ? `Integrity Confirmed: All ${verificationResult.totalBlocks} Transaction Seals are Valid & Authentic`
                  : `SECURITY ALERT: Tampering Detected at Entry #${verificationResult.compromisedIndex}!`}
              </div>
              <div className="text-xs opacity-90 mt-0.5 font-medium">
                {verificationResult.reason ||
                  'Every record’s digital signature precisely matches its stored data and chains unbroken back to the very first transaction.'}
              </div>
              <div className="text-[10px] font-mono mt-1 opacity-70">
                Verified at: {new Date(verificationResult.verifiedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {!verificationResult.valid && (
            <button
              onClick={resetToSeedData}
              className="px-3.5 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer"
            >
              Restore Authentic Data
            </button>
          )}
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search actors, digital seals, actions..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={filterModule}
            onChange={e => setFilterModule(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTH">USER ACCESS</option>
            <option value="FINANCE">ACCOUNTING</option>
            <option value="INVENTORY">WAREHOUSE</option>
            <option value="PROCUREMENT">PURCHASING</option>
            <option value="INTERCOMPANY">INTERNAL SALES</option>
            <option value="SYSTEM">SECURITY</option>
          </select>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 font-mono font-bold">
          Showing {filteredLogs.length} of {auditLogs.length} digital records
        </div>
      </div>

      {/* Audit Blocks Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-2.5 px-4"># Record</th>
                <th className="py-2.5 px-4">Timestamp (UTC)</th>
                <th className="py-2.5 px-4 font-sans">User</th>
                <th className="py-2.5 px-4">Company</th>
                <th className="py-2.5 px-4">Action Type</th>
                <th className="py-2.5 px-4 font-sans">Description</th>
                <th className="py-2.5 px-4 text-right">Digital Seal (SHA-256)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-300">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-sky-700 dark:text-sky-400">#{log.index}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-slate-100">
                    {log.actorName}
                    <span className="block text-[10px] text-slate-500 dark:text-slate-300 font-mono font-medium">{log.actorRole}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-200">{log.entityCode}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                        log.action === 'CREATE'
                          ? 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800'
                          : log.action === 'APPROVE' || log.action === 'ACCESS_GRANT'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                          : log.action === 'BREAK_GLASS'
                          ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800 animate-pulse'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-900 dark:text-slate-200 max-w-xs truncate font-medium">
                    {log.description}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold" title={log.hash}>
                        {log.hash.slice(0, 10)}...{log.hash.slice(-6)}
                      </span>
                      <span className="text-[9px] text-slate-500 dark:text-slate-300 font-mono" title={log.prevHash}>
                        linked to: {log.prevHash.slice(0, 6)}...
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
