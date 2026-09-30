import React from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Coins,
  Boxes,
  ShoppingCart,
  Users,
  GitCompareArrows,
  CheckSquare,
  Wand2,
  KeyRound,
  ShieldCheck,
  FileCheck2,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, currentEntityId, activeEntity, approvalItems, theme } = useApp();

  const pendingApprovalsCount = approvalItems.filter(a => a.status === 'PENDING').length;

  const navGroups: {
    title: string;
    items: {
      id: ActiveTab;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: number | string;
      badgeColor?: string;
    }[];
  }[] = [
    {
      title: 'Group Overview',
      items: [
        { id: 'command_center', label: 'All Companies Overview', icon: LayoutDashboard },
        { id: 'intercompany', label: 'Internal Company Sales', icon: GitCompareArrows },
        { id: 'studio', label: 'Launch New Business', icon: Wand2 }
      ]
    },
    {
      title: 'Daily Business Operations',
      items: [
        { id: 'finance', label: 'Accounting & Books', icon: Coins },
        { id: 'inventory', label: 'Products & Stock', icon: Boxes },
        { id: 'sales_procurement', label: 'Buying & Selling', icon: ShoppingCart },
        { id: 'hr', label: 'Team & Payroll', icon: Users }
      ]
    },
    {
      title: 'Security & Approvals',
      items: [
        {
          id: 'approvals',
          label: 'Approvals & Signoffs',
          icon: CheckSquare,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeColor: 'bg-amber-500 text-slate-950 font-bold'
        },
        { id: 'passport', label: 'Company Access Badges', icon: KeyRound },
        { id: 'audit', label: 'Tamper-Proof Audit Log', icon: ShieldCheck },
        { id: 'tenant_tests', label: 'Security Locks Test Lab', icon: FileCheck2 }
      ]
    },
    {
      title: 'HELP',
      items: [
        {
          id: 'help',
          label: 'HELP & Feature Manual',
          icon: HelpCircle,
          badge: '26 Guides',
          badgeColor: 'bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold border border-sky-300 dark:border-sky-500/30'
        }
      ]
    }
  ];

  return (
    <aside
      className={`w-64 border-r flex flex-col shrink-0 select-none transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-slate-950 border-slate-800 text-slate-300'
          : 'bg-white border-slate-200 text-slate-700 shadow-xs'
      }`}
    >
      {/* Active Business Scope Indicator */}
      <div
        className={`p-3.5 border-b transition-colors ${
          theme === 'dark' ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50/80'
        }`}
      >
        <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-300 tracking-wider">
          Currently Managing
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {currentEntityId === 'GROUP' ? (
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
            ) : (
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: activeEntity?.color || '#0284c7' }}
              />
            )}
            <span className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {currentEntityId === 'GROUP' ? 'All Companies' : activeEntity?.code}
            </span>
          </div>
          <span
            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
              theme === 'dark'
                ? 'text-slate-200 bg-slate-800 border-slate-700'
                : 'text-slate-700 bg-white border-slate-300 shadow-2xs'
            }`}
          >
            {currentEntityId === 'GROUP' ? 'MULTI' : activeEntity?.currency}
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map(group => (
          <div key={group.title}>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/30'
                        : theme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-300'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            item.badgeColor || (theme === 'dark' ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-slate-200 text-slate-700')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div
        className={`p-3 border-t text-[11px] transition-colors ${
          theme === 'dark'
            ? 'border-slate-800 bg-slate-900/60 text-slate-300'
            : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-700 dark:text-slate-200">Company Privacy Walls</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Protected
          </span>
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-300 mt-0.5">
          Data between companies is strictly isolated
        </div>
      </div>
    </aside>
  );
};
