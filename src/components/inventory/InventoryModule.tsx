import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Boxes,
  AlertTriangle,
  ArrowRightLeft,
  Warehouse,
  CheckCircle2,
  Lock,
  Layers,
  Info
} from 'lucide-react';
import { maskSensitiveValue } from '../../lib/security';

export const InventoryModule: React.FC = () => {
  const {
    currentEntityId,
    activeEntity,
    inventory,
    warehouses,
    currentUser,
    transferStock,
    entities,
    showToast
  } = useApp();

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [targetEntityId, setTargetEntityId] = useState('');
  const [transferQty, setTransferQty] = useState(1);

  const scopedInventory = currentEntityId === 'GROUP'
    ? inventory
    : inventory.filter(item => item.entityId === currentEntityId);

  const scopedWarehouses = currentEntityId === 'GROUP'
    ? warehouses
    : warehouses.filter(w => w.entityId === currentEntityId);

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !targetEntityId) return;

    const item = inventory.find(i => i.id === selectedItemId);
    if (!item) return;

    if (transferQty > item.totalStock) {
      showToast('Cannot transfer: requested quantity is greater than current stock in warehouse!');
      return;
    }

    transferStock(item.entityId, targetEntityId, selectedItemId, transferQty);
    setShowTransferModal(false);
    setSelectedItemId('');
    setTargetEntityId('');
    setTransferQty(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Products, Warehouses & Stock
            </h1>
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-0.5 rounded font-bold">
              {currentEntityId === 'GROUP' ? 'All Warehouses' : `${activeEntity?.code} Stock`}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            Track product quantities across all warehouse locations. Low stock triggers alerts automatically, and confidential supplier costs are kept secret from sales representatives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Move Stock Between Companies</span>
          </button>
        </div>
      </div>

      {/* Field-level masking notification banner */}
      {currentUser.baseRole === 'sales_executive' && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900 dark:text-amber-300 shadow-xs">
          <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <span className="font-bold">Cost Protection Active:</span> You are viewing the screen as{' '}
            <strong>Ali Reza Khan (Sales Rep)</strong>. Supplier cost prices are hidden (••••) so only customer selling prices are visible to sales personnel.
          </div>
        </div>
      )}

      {/* Warehouse Utilization Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scopedWarehouses.map(wh => (
          <div
            key={wh.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-2 shadow-xs transition-colors hover:border-sky-300 dark:hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-sky-700 dark:text-sky-400 font-bold">{wh.code}</span>
              <Warehouse className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{wh.name}</div>
            <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{wh.location}</div>
            <div className="pt-2">
              <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-300 mb-1 font-semibold">
                <span>Storage Filled</span>
                <span className="font-bold text-slate-900 dark:text-slate-200">{wh.capacityUsedPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-slate-700">
                <div
                  className={`h-full rounded-full ${
                    wh.capacityUsedPercentage > 80 ? 'bg-amber-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${wh.capacityUsedPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Product Catalog & Current Stock</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">All products available for production, wholesale, or retail sales</p>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {scopedInventory.length} Products Cataloged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-2.5 px-4">Item Code (SKU)</th>
                <th className="py-2.5 px-4">Product Name</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Cost Method</th>
                <th className="py-2.5 px-4 text-right">Supplier Cost</th>
                <th className="py-2.5 px-4 text-right">Selling Price</th>
                <th className="py-2.5 px-4 text-right">In Stock</th>
                <th className="py-2.5 px-4 text-center">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-300">
              {scopedInventory.map(item => {
                const isBelowReorder = item.totalStock <= item.reorderPoint;
                const formattedCost = maskSensitiveValue(
                  item.costPrice,
                  currentUser,
                  item.entityId,
                  'cost_price'
                );

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-700 dark:text-sky-400">{item.sku}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{item.name}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">{item.category}</td>
                    <td className="py-3 px-4 font-mono text-[10px]">
                      <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-800 dark:text-slate-300 font-bold">
                        {item.valuationMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-200">
                      {formattedCost}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      ${item.sellingPrice.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      {item.totalStock} {item.uom}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isBelowReorder ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Low Stock ({item.totalStock} left / min {item.reorderPoint})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Move Goods Between Companies</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">Transfer inventory from one business warehouse to another</p>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Select Product to Move
                </label>
                <select
                  required
                  value={selectedItemId}
                  onChange={e => setSelectedItemId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="">Choose a product SKU...</option>
                  {inventory.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.sku} - {item.name} ({item.totalStock} in stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Receiving Company & Warehouse
                </label>
                <select
                  required
                  value={targetEntityId}
                  onChange={e => setTargetEntityId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                >
                  <option value="">Choose receiving company...</option>
                  {entities.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.code} - {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Number of Units to Move
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferQty}
                  onChange={e => setTransferQty(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
