import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Users,
  Building,
  Check,
  X
} from 'lucide-react';

export const SalesProcurementModule: React.FC = () => {
  const {
    currentEntityId,
    activeEntity,
    purchaseOrders,
    customers,
    vendors,
    currentUser,
    approvePurchaseOrder,
    rejectPurchaseOrder
  } = useApp();

  const [activeTab, setActiveTab] = useState<'procurement' | 'sales' | 'vendors'>('procurement');

  const scopedPOs = currentEntityId === 'GROUP'
    ? purchaseOrders
    : purchaseOrders.filter(p => p.entityId === currentEntityId);

  const scopedCustomers = currentEntityId === 'GROUP'
    ? customers
    : customers.filter(c => c.entityId === currentEntityId);

  const scopedVendors = currentEntityId === 'GROUP'
    ? vendors
    : vendors.filter(v => v.entityId === currentEntityId);

  const handleApprovePO = (poId: string) => {
    approvePurchaseOrder(poId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Buying & Selling (Sales & Procurement)
            </h1>
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded font-bold">
              {currentEntityId === 'GROUP' ? 'All Companies' : `${activeEntity?.code} Orders`}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            Create purchase orders for suppliers, approve orders with built-in fraud prevention rules, and manage customer credit limits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-emerald-50 dark:bg-slate-800 border border-emerald-300 dark:border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Honesty Rule: Creator cannot approve own order</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('procurement')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'procurement'
              ? 'bg-sky-50 dark:bg-sky-600/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Purchase Orders & Supplier Bills ({scopedPOs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'sales'
              ? 'bg-sky-50 dark:bg-sky-600/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Customers & Credit Limits ({scopedCustomers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'vendors'
              ? 'bg-sky-50 dark:bg-sky-600/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Approved Suppliers ({scopedVendors.length})</span>
        </button>
      </div>

      {/* TAB 1: Procurement & POs */}
      {activeTab === 'procurement' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Purchase Orders List</h2>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  Orders over $10,000 USD require approval from a CFO or Director before funds are released.
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Logged in as: <strong className="text-slate-900 dark:text-slate-100">{currentUser.name}</strong> ({currentUser.baseRole})
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {scopedPOs.map(po => {
                const isCreator = po.createdBy === currentUser.id;
                const isPending = po.status.includes('pending');

                return (
                  <div key={po.id} className="p-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-700 dark:text-sky-400 text-xs">{po.poNumber}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{po.vendorName}</span>
                        {po.grandTotal > 10000 && (
                          <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800 px-2 py-0.5 rounded uppercase font-bold">
                            High-Value Order (&gt;$10k)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
                            ${po.grandTotal.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 block font-medium">Order Date: {po.date}</span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                            po.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {po.status === 'approved' ? 'Approved' : 'Waiting for Review'}
                        </span>
                      </div>
                    </div>

                    {/* Line Items & 3-Way Match Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl text-xs border border-slate-200 dark:border-transparent">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">Items Ordered</span>
                        {po.items.map(item => (
                          <div key={item.id} className="text-slate-900 dark:text-slate-200 font-medium">
                            {item.quantity}x {item.itemName} (${item.unitPrice.toLocaleString()} each)
                          </div>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">Order Creator</span>
                        <div className="text-slate-900 dark:text-slate-200 font-bold">Created by: {po.createdByName}</div>
                        <div className="text-slate-600 dark:text-slate-300 text-[11px] font-medium">Expected delivery: {po.expectedDelivery}</div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-300">Delivery & Invoice Match</span>
                        <div className="flex items-center gap-1.5">
                          {po.threeWayMatchStatus === 'MATCHED' ? (
                            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Order, Delivery & Bill all Match
                            </span>
                          ) : (
                            <span className="text-amber-700 dark:text-amber-400 flex items-center gap-1 font-bold">
                              <AlertTriangle className="w-3.5 h-3.5" /> Waiting for delivery confirmation
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Approver Actions & SoD Enforcer */}
                    {isPending && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          {isCreator ? (
                            <span className="text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Honesty Rule: You created this purchase order. Another manager must review and approve it.
                            </span>
                          ) : (
                            <span>Please verify supplier prices and delivery items before giving final approval.</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => rejectPurchaseOrder(po.id, 'Procurement criteria mismatch')}
                            className="px-3 py-1.5 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-300 dark:border-rose-900 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" /> Decline
                          </button>

                          <button
                            onClick={() => handleApprovePO(po.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Approve Purchase Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Customers & Credit Limits */}
      {activeTab === 'sales' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Customer Credit Limits</h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">Ensure clients do not exceed maximum unpaid balances</p>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {scopedCustomers.length} Active Clients
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-2.5 px-4">Code</th>
                  <th className="py-2.5 px-4">Customer Name</th>
                  <th className="py-2.5 px-4">Contact Person</th>
                  <th className="py-2.5 px-4 text-right">Max Allowed Credit</th>
                  <th className="py-2.5 px-4 text-right">Unpaid Balance</th>
                  <th className="py-2.5 px-4 text-center">Credit Used</th>
                  <th className="py-2.5 px-4 text-center">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-300">
                {scopedCustomers.map(c => {
                  const exposurePercent = (c.currentBalance / c.creditLimit) * 100;
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-sky-700 dark:text-sky-400">{c.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{c.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {c.contactPerson} ({c.email})
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-200">
                        ${c.creditLimit.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        ${c.currentBalance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="w-24 mx-auto">
                          <div className="flex justify-between text-[10px] mb-0.5 font-bold">
                            <span>{exposurePercent.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div
                              className={`h-full rounded-full ${
                                exposurePercent > 80 ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, exposurePercent)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Vendors Master */}
      {activeTab === 'vendors' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Supplier Directory</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">Verified vendors authorized to supply equipment and raw materials</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="py-2.5 px-4">Code</th>
                  <th className="py-2.5 px-4">Supplier Name</th>
                  <th className="py-2.5 px-4">Contact</th>
                  <th className="py-2.5 px-4">Payment Terms</th>
                  <th className="py-2.5 px-4 text-right">Rating</th>
                  <th className="py-2.5 px-4 text-right">Total Purchased YTD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-300 font-sans">
                {scopedVendors.map(v => (
                  <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-700 dark:text-sky-400">{v.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{v.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{v.contactPerson} · {v.email}</td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-bold">{v.paymentTerms}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600 dark:text-amber-400 font-bold">★ {v.rating}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      ${v.totalBilled.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
