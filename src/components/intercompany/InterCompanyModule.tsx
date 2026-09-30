import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitCompareArrows,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Building,
  Plus
} from 'lucide-react';

export const InterCompanyModule: React.FC = () => {
  const {
    entities,
    intercompanyTxs,
    pairBalances,
    postIntercompanyTrade
  } = useApp();

  const [showNewTradeModal, setShowNewTradeModal] = useState(false);
  const [sourceEntityId, setSourceEntityId] = useState('ent_mfg_01');
  const [targetEntityId, setTargetEntityId] = useState('ent_ret_02');
  const [amount, setAmount] = useState(25000);
  const [memo, setMemo] = useState('Components supply from factory to retail store');

  const handlePostTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceEntityId === targetEntityId) return;
    postIntercompanyTrade(sourceEntityId, targetEntityId, amount, memo);
    setShowNewTradeModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <GitCompareArrows className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Internal Sales Between Your Companies
            </h1>
            <span className="text-[11px] font-mono text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-800 px-2 py-0.5 rounded font-bold">
              Automatic Mirrored Entries
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            When one of your companies sells parts or charges management fees to a sister company, NEXORA automatically writes both sides of the transaction with zero duplicate work.
          </p>
        </div>

        <button
          onClick={() => setShowNewTradeModal(true)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record New Internal Sale</span>
        </button>
      </div>

      {/* Bilateral Pair Reconciliation Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pairBalances.map((pair, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-4 shadow-xs hover:border-sky-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{pair.entityAName}</span>
              </div>
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{pair.entityBName}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-600 dark:text-slate-300 uppercase font-bold block">
                  Net Balance Owed Between Both
                </span>
                <span className="text-base font-mono font-bold text-slate-900 dark:text-white">
                  ${pair.balanceOwedByBToA.toLocaleString()}
                </span>
              </div>

              <div>
                {pair.isReconciled ? (
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Perfectly Balanced ($0 diff)
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 px-2.5 py-1 rounded flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Unconfirmed (${pair.unreconciledDifference.toLocaleString()})
                  </span>
                )}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-transparent rounded-lg text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between font-medium">
              <span>Clearing Account Used:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-200">2150 / 1350 Intercompany Clearing</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mirrored Transaction Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Internal Sales History Log</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Each row represents a sale in Company A that simultaneously created a bill in Company B.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {intercompanyTxs.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-2.5 px-4">Transaction #</th>
                <th className="py-2.5 px-4">Selling Company (Sale Invoice)</th>
                <th className="py-2.5 px-4">Buying Company (Purchase Bill)</th>
                <th className="py-2.5 px-4">Transfer Type</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-300">
              {intercompanyTxs.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-sky-700 dark:text-sky-400">{tx.transactionNumber}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{tx.sourceEntityName}</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-mono">Invoice #{tx.sourceDocId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{tx.targetEntityName}</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-mono">Bill #{tx.targetDocId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-800 dark:text-slate-300">
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                    {tx.currency} {tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                        tx.status === 'POSTED_MIRRORED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                      }`}
                    >
                      {tx.status === 'POSTED_MIRRORED' ? 'Mirrored & Posted' : 'Pending Confirmation'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Mirrored Trade Modal */}
      {showNewTradeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Record Internal Company Sale</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">Posts an invoice to the seller and a bill to the buyer</p>
              </div>
              <button
                onClick={() => setShowNewTradeModal(false)}
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostTrade} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Selling Company (Seller)
                </label>
                <select
                  value={sourceEntityId}
                  onChange={e => setSourceEntityId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  {entities.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.code} - {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Buying Company (Buyer)
                </label>
                <select
                  value={targetEntityId}
                  onChange={e => setTargetEntityId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  {entities.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.code} - {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Transfer Amount ($)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Description of Goods or Services
                </label>
                <input
                  type="text"
                  required
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTradeModal(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sourceEntityId === targetEntityId}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Confirm & Post Both Sides
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
