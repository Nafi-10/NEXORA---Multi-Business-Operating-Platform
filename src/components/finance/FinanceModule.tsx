import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coins,
  BookOpen,
  FileSpreadsheet,
  Lock,
  Unlock,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { JournalLine } from '../../types/finance';

export const FinanceModule: React.FC = () => {
  const {
    currentEntityId,
    activeEntity,
    accounts,
    journals,
    invoices,
    periodLocked,
    togglePeriodLock,
    createJournalEntry,
    showToast
  } = useApp();

  const [activeFinanceTab, setActiveFinanceTab] = useState<'coa' | 'journals' | 'invoices'>('coa');
  const [showNewVoucherModal, setShowNewVoucherModal] = useState(false);

  // Form state for new journal voucher
  const [memo, setMemo] = useState('');
  const [lines, setLines] = useState<{ accountId: string; debit: number; credit: number; description: string }[]>([
    { accountId: '', debit: 0, credit: 0, description: '' },
    { accountId: '', debit: 0, credit: 0, description: '' }
  ]);

  const isCurrentLocked = currentEntityId !== 'GROUP' ? periodLocked[currentEntityId] : false;

  // Filter accounts and journals for current scope
  const scopedAccounts = currentEntityId === 'GROUP'
    ? accounts
    : accounts.filter(a => a.entityId === currentEntityId);

  const scopedJournals = currentEntityId === 'GROUP'
    ? journals
    : journals.filter(j => j.entityId === currentEntityId);

  const scopedInvoices = currentEntityId === 'GROUP'
    ? invoices
    : invoices.filter(i => i.entityId === currentEntityId);

  const totalDebitSum = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCreditSum = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const isBalanced = totalDebitSum > 0 && totalDebitSum === totalCreditSum;

  const handlePostJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced) {
      showToast('Accounting Rule: Total Money In (Debits) must equal Total Money Out (Credits).');
      return;
    }
    if (isCurrentLocked) {
      showToast('This company’s financial books are locked. No edits are allowed.');
      return;
    }

    const journalLines: JournalLine[] = lines.map((l, idx) => {
      const acc = accounts.find(a => a.id === l.accountId);
      return {
        id: `line_${idx}_${Date.now()}`,
        accountId: l.accountId,
        accountCode: acc?.code || '0000',
        accountName: acc?.name || 'Unknown',
        description: l.description || memo,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0
      };
    });

    createJournalEntry({
      entityId: currentEntityId === 'GROUP' ? 'ent_mfg_01' : currentEntityId,
      date: new Date().toISOString().split('T')[0],
      memo,
      lines: journalLines,
      totalDebit: totalDebitSum,
      totalCredit: totalCreditSum
    });

    setShowNewVoucherModal(false);
    setMemo('');
    setLines([
      { accountId: '', debit: 0, credit: 0, description: '' },
      { accountId: '', debit: 0, credit: 0, description: '' }
    ]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Accounting & Financial Books
            </h1>
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded font-bold">
              {currentEntityId === 'GROUP' ? 'All Companies Combined' : `${activeEntity?.code} (${activeEntity?.currency})`}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-medium">
            Track all incoming and outgoing money with double-entry accounting. Lock past periods to prevent changes, and manage customer invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentEntityId !== 'GROUP' && (
            <button
              onClick={() => togglePeriodLock(currentEntityId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isCurrentLocked
                  ? 'bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              {isCurrentLocked ? <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />}
              <span>{isCurrentLocked ? 'Books are Locked' : 'Lock Books from Edits'}</span>
            </button>
          )}

          <button
            onClick={() => setShowNewVoucherModal(true)}
            disabled={isCurrentLocked}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-lg shadow-sm shadow-sky-600/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record New Entry</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveFinanceTab('coa')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeFinanceTab === 'coa'
              ? 'bg-sky-50 dark:bg-sky-600/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Accounts List ({scopedAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveFinanceTab('journals')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeFinanceTab === 'journals'
              ? 'bg-sky-50 dark:bg-sky-600/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Journal Records ({scopedJournals.length})</span>
        </button>

        <button
          onClick={() => setActiveFinanceTab('invoices')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeFinanceTab === 'invoices'
              ? 'bg-sky-50 dark:bg-sky-600/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Customer Invoices ({scopedInvoices.length})</span>
        </button>
      </div>

      {/* TAB 1: Chart of Accounts */}
      {activeFinanceTab === 'coa' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Chart of Accounts Directory</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Categories where money flows: Assets (What you own) · Liabilities (What you owe) · Revenue (Sales) · Expenses (Costs)
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {scopedAccounts.length} Total Accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-2.5 px-4">Account Code</th>
                  <th className="py-2.5 px-4">Account Name</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Company</th>
                  <th className="py-2.5 px-4 text-right">Current Balance</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-300 font-mono">
                {scopedAccounts.map(acc => (
                  <tr key={acc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 text-sky-700 dark:text-sky-400 font-bold">{acc.code}</td>
                    <td className="py-3 px-4 font-sans font-bold text-slate-900 dark:text-slate-100">{acc.name}</td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          acc.category === 'ASSET'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                            : acc.category === 'LIABILITY'
                            ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
                            : acc.category === 'EQUITY'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                            : acc.category === 'REVENUE'
                            ? 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800'
                            : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {acc.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-600 dark:text-slate-300">{acc.entityId}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      {acc.currency} {acc.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Journal Entries */}
      {activeFinanceTab === 'journals' && (
        <div className="space-y-4">
          {scopedJournals.map(je => (
            <div key={je.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sky-700 dark:text-sky-400 text-xs">{je.entryNumber}</span>
                  <span className="text-slate-400 text-xs">·</span>
                  <span className="text-xs text-slate-900 dark:text-slate-100 font-bold">{je.memo}</span>
                  {je.isIntercompany && (
                    <span className="text-[9px] bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.2 rounded uppercase font-bold">
                      Mirrored Internal Entry
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2 font-medium">
                  <span>Date: {je.date}</span>
                  <span>·</span>
                  <span>Posted by: {je.createdByName}</span>
                </div>
              </div>

              {/* Journal Lines */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[10px] text-slate-600 dark:text-slate-300 uppercase border-b border-slate-200 dark:border-slate-800 font-bold">
                    <tr>
                      <th className="py-1.5 px-2">Account</th>
                      <th className="py-1.5 px-2">Description</th>
                      <th className="py-1.5 px-2 text-right">Debit (Money In)</th>
                      <th className="py-1.5 px-2 text-right">Credit (Money Out)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {je.lines.map(line => (
                      <tr key={line.id}>
                        <td className="py-2 px-2 font-bold text-slate-900 dark:text-slate-200">
                          {line.accountCode} - {line.accountName}
                        </td>
                        <td className="py-2 px-2 text-slate-600 dark:text-slate-300 font-sans">{line.description}</td>
                        <td className="py-2 px-2 text-right text-emerald-700 dark:text-emerald-400 font-bold">
                          {line.debit > 0 ? `$${line.debit.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-2 px-2 text-right text-sky-700 dark:text-sky-400 font-bold">
                          {line.credit > 0 ? `$${line.credit.toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/40">
                      <td colSpan={2} className="py-2 px-2 text-right text-slate-700 dark:text-slate-200 font-sans uppercase text-[10px]">
                        Total (Balanced)
                      </td>
                      <td className="py-2 px-2 text-right text-emerald-700 dark:text-emerald-400 font-bold">
                        ${je.totalDebit.toLocaleString()}
                      </td>
                      <td className="py-2 px-2 text-right text-sky-700 dark:text-sky-400 font-bold">
                        ${je.totalCredit.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Invoices */}
      {activeFinanceTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Customer Invoices & Billing</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">Bills sent to clients for products or services delivered</p>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
              Total Invoiced: ${scopedInvoices.reduce((s, i) => s + i.grandTotal, 0).toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-2.5 px-4">Invoice #</th>
                  <th className="py-2.5 px-4">Customer Name</th>
                  <th className="py-2.5 px-4">Invoice Date</th>
                  <th className="py-2.5 px-4">Payment Due</th>
                  <th className="py-2.5 px-4 text-right">Total Amount</th>
                  <th className="py-2.5 px-4 text-center">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-300">
                {scopedInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-700 dark:text-sky-400">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{inv.customerName}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{inv.issueDate}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{inv.dueDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      ${inv.grandTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                          inv.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Journal Voucher Modal */}
      {showNewVoucherModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl w-full max-w-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Record New Accounting Entry</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Rule: Total Debits (Money In) must exactly match Total Credits (Money Out) so the books stay balanced.
                </p>
              </div>
              <button
                onClick={() => setShowNewVoucherModal(false)}
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostJournal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Reason / Description for Entry
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly factory utility bill payment"
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              {/* Journal Line Items */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Transaction Lines</div>
                {lines.map((l, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg items-center border border-slate-200 dark:border-transparent"
                  >
                    <div className="col-span-5">
                      <select
                        required
                        value={l.accountId}
                        onChange={e => {
                          const val = e.target.value;
                          setLines(prev => prev.map((item, i) => (i === idx ? { ...item, accountId: val } : item)));
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
                      >
                        <option value="">Select Account...</option>
                        {scopedAccounts.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.code} - {a.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Line note"
                        value={l.description}
                        onChange={e => {
                          const val = e.target.value;
                          setLines(prev => prev.map((item, i) => (i === idx ? { ...item, description: val } : item)));
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
                      />
                    </div>

                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Debit $"
                        value={l.debit || ''}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setLines(prev => prev.map((item, i) => (i === idx ? { ...item, debit: val, credit: 0 } : item)));
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-mono font-bold text-right"
                      />
                    </div>

                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        placeholder="Credit $"
                        value={l.credit || ''}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setLines(prev => prev.map((item, i) => (i === idx ? { ...item, credit: val, debit: 0 } : item)));
                        }}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1.5 text-xs text-sky-700 dark:text-sky-400 font-mono font-bold text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Balance Verification Bar */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                    Total In: ${totalDebitSum.toLocaleString()}
                  </span>
                  <span className="text-sky-700 dark:text-sky-400 font-bold">
                    Total Out: ${totalCreditSum.toLocaleString()}
                  </span>
                </div>

                <div>
                  {isBalanced ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 font-sans">
                      <CheckCircle2 className="w-4 h-4" /> Perfect Balance ($0 difference)
                    </span>
                  ) : (
                    <span className="text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1 font-sans">
                      <AlertCircle className="w-4 h-4" /> Difference: ${Math.abs(totalDebitSum - totalCreditSum).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewVoucherModal(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Save & Post Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
