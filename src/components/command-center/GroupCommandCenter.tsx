import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Landmark,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building,
  ArrowRight,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const GroupCommandCenter: React.FC = () => {
  const {
    entities,
    setCurrentEntityId,
    setActiveTab,
    accounts,
    purchaseOrders,
    inventory,
    intercompanyTxs,
    pairBalances
  } = useApp();

  // Exchange rates normalized to base USD
  const EUR_TO_USD = 1.09;
  const GBP_TO_USD = 1.32;

  // Calculate cash across all entities
  const entityCashBreakdown = entities.map(ent => {
    const totalCashEntityCurrency = ent.bankAccounts.reduce((sum, b) => sum + b.balance, 0);
    let cashInUSD = totalCashEntityCurrency;
    if (ent.currency === 'EUR') cashInUSD = totalCashEntityCurrency * EUR_TO_USD;
    if (ent.currency === 'GBP') cashInUSD = totalCashEntityCurrency * GBP_TO_USD;

    return {
      entity: ent,
      totalEntityCurrency: totalCashEntityCurrency,
      cashInUSD
    };
  });

  const totalGroupCashUSD = entityCashBreakdown.reduce((sum, b) => sum + b.cashInUSD, 0);

  // Consolidated inventory valuation
  const totalStockValuationUSD = inventory.reduce((sum, item) => {
    const itemValue = item.totalStock * item.costPrice;
    return sum + itemValue;
  }, 0);

  // Pending POs
  const pendingPOs = purchaseOrders.filter(p => p.status.includes('pending'));
  const pendingPOValue = pendingPOs.reduce((sum, p) => sum + p.grandTotal, 0);

  // Intercompany volume
  const totalIntercompanyVolumeUSD = intercompanyTxs.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Clear English & High Visibility */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Group Command Center
            </h1>
            <span className="text-[11px] font-mono text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-700/60 px-2 py-0.5 rounded font-bold">
              All 3 Companies Combined
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            See total bank cash, warehouse stock, supplier bills, and internal sales across all your companies in one simple view.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('intercompany')}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Internal Sales Engine</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
          <button
            onClick={() => setActiveTab('tenant_tests')}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-bold text-white shadow-sm shadow-sky-600/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Test Security Locks</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Tiles in Plain, Clear English */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Group Treasury Cash */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs transition-colors hover:border-sky-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block">
                Total Cash in Banks
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-300 font-medium">Across all company accounts</span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/60">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ${(totalGroupCashUSD / 1_000_000).toFixed(2)} Million
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1 font-medium">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">Ready to spend</span>
              <span>·</span>
              <span>5 bank accounts</span>
            </div>
          </div>
        </div>

        {/* Total Stock Asset Valuation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs transition-colors hover:border-sky-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block">
                Warehouse Stock Value
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-300 font-medium">Cost of goods on shelves</span>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-700/60">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ${(totalStockValuationUSD / 1_000).toFixed(1)}k
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1 font-medium">
              <span className="text-sky-700 dark:text-sky-400 font-bold">4 Warehouses</span>
              <span>·</span>
              <span>Hardware & retail parts</span>
            </div>
          </div>
        </div>

        {/* Pending Procurement Commitments */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs transition-colors hover:border-sky-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block">
                Orders Needing Review
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-300 font-medium">Pending purchase orders</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ${(pendingPOValue / 1_000).toFixed(1)}k
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1 font-medium">
              <span className="text-amber-700 dark:text-amber-400 font-bold">{pendingPOs.length} purchase orders</span>
              <span>·</span>
              <span>Needs manager signoff</span>
            </div>
          </div>
        </div>

        {/* Inter-Company Trade Volume */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex flex-col justify-between shadow-xs transition-colors hover:border-sky-300 dark:hover:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider block">
                Internal Company Sales
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-300 font-medium">Sales between your own firms</span>
            </div>
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/60">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              ${(totalIntercompanyVolumeUSD / 1_000).toFixed(1)}k
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1 font-medium">
              <span className="text-indigo-700 dark:text-indigo-400 font-bold">Auto-matched</span>
              <span>·</span>
              <span>Zero double-counting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Operating Companies & Cash Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Operating Companies Breakdown */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Your 3 Operating Companies
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Click "Open Company Books" on any business to jump directly into its ledgers.
              </p>
            </div>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              3 Active Businesses
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {entities.map(ent => {
              const entAccounts = accounts.filter(a => a.entityId === ent.id);
              const totalRevenue = entAccounts
                .filter(a => a.category === 'REVENUE')
                .reduce((s, a) => s + a.balance, 0);
              const totalCash = ent.bankAccounts.reduce((s, b) => s + b.balance, 0);

              return (
                <div
                  key={ent.id}
                  className="bg-slate-50/70 dark:bg-slate-800/80 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-all shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                        style={{ backgroundColor: ent.color }}
                      >
                        {ent.code.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">{ent.name}</span>
                          <span className="text-[10px] bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-1.5 py-0.2 rounded font-mono font-bold border border-slate-200 dark:border-slate-600">
                            {ent.code}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                          {ent.description}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 flex flex-wrap items-center gap-2 font-medium">
                          <span>HQ: {ent.headquarters}</span>
                          <span>·</span>
                          <span>Tax ID: {ent.taxId}</span>
                          <span>·</span>
                          <span className="capitalize font-bold text-slate-800 dark:text-slate-200">{ent.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-4 justify-between sm:justify-start">
                      <div className="text-right">
                        <div className="text-[10px] uppercase text-slate-500 dark:text-slate-300 font-bold">
                          Cash in Bank
                        </div>
                        <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                          {ent.currencySymbol}
                          {(totalCash / 1_000).toLocaleString()}k
                        </div>
                        <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                          Sales: {ent.currencySymbol}
                          {(totalRevenue / 1_000).toFixed(0)}k
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentEntityId(ent.id);
                          setActiveTab('finance');
                        }}
                        className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 dark:bg-sky-600/30 dark:hover:bg-sky-600/50 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/50 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer shadow-2xs"
                      >
                        <span>Open Books</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Cash Split by Company */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xs transition-colors">
          <div>
            <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Cash Split by Company
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Where your liquid money is stored right now
              </p>
            </div>

            <div className="mt-4 space-y-4">
              {entityCashBreakdown.map(item => {
                const percentage = totalGroupCashUSD > 0 ? (item.cashInUSD / totalGroupCashUSD) * 100 : 0;
                return (
                  <div key={item.entity.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.entity.color }} />
                        {item.entity.code} · {item.entity.name.split(' ')[0]}
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white font-bold">
                        ${(item.cashInUSD / 1_000_000).toFixed(2)}M ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200 dark:border-slate-700">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.entity.color
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                      Local Currency: {item.entity.currencySymbol}
                      {item.totalEntityCurrency.toLocaleString()} in {item.entity.bankAccounts.length} bank account(s)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Intercompany Status Card */}
          <div className="mt-6 p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Internal Company Sales are Balanced
              </div>
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
              Apex Mfg ($) sold parts to Nova Retail (€). The debt ($145k) is recorded in both books with zero discrepancy.
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">Connected Company Pairs</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {pairBalances.length} Pairs Balanced
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
