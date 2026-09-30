import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  AlertTriangle
} from 'lucide-react';

interface BreakGlassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BreakGlassModal: React.FC<BreakGlassModalProps> = ({ isOpen, onClose }) => {
  const {
    entities,
    startBreakGlass,
    currentUser
  } = useApp();

  const [targetEntityId, setTargetEntityId] = useState(entities[0]?.id || '');
  const [reason, setReason] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  const handleTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || !acknowledged) return;
    startBreakGlass(targetEntityId, reason);
    onClose();
    setReason('');
    setAcknowledged(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white transition-colors">
        <div className="flex items-center justify-between border-b border-rose-200 dark:border-rose-950 pb-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Flame className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Emergency Break-Glass Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs p-1 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/60 rounded-xl text-xs text-rose-900 dark:text-rose-200 space-y-1.5 shadow-2xs">
          <div className="font-bold flex items-center gap-1.5 text-rose-800 dark:text-rose-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
            Temporary High-Privilege Security Override
          </div>
          <p className="leading-relaxed font-medium">
            Break-glass access grants an instant, temporary <strong>4-hour emergency pass</strong> to view or edit a locked company for urgent crisis recovery or official audits. This action is permanently recorded in the digital audit log.
          </p>
        </div>

        <form onSubmit={handleTrigger} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Target Company</label>
            <select
              value={targetEntityId}
              onChange={e => setTargetEntityId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-medium"
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
              Required Explanation for Override
            </label>
            <textarea
              rows={3}
              required
              placeholder="State the exact crisis, statutory audit, or emergency payroll recovery reason..."
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 font-medium"
            />
          </div>

          <label className="flex items-start gap-2 pt-1 text-xs text-slate-700 dark:text-slate-300 cursor-pointer font-medium">
            <input
              type="checkbox"
              required
              checked={acknowledged}
              onChange={e => setAcknowledged(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-0"
            />
            <span>
              I certify that this emergency override is strictly required and acknowledge that my identity ({currentUser.name}) and all actions will be permanently stamped in the audit vault.
            </span>
          </label>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!acknowledged || !reason}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Activate 4-Hour Emergency Pass</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
