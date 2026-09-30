import React, { useEffect, useState, useRef } from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Coins,
  Boxes,
  ShoppingCart,
  Users,
  GitCompareArrows,
  Wand2,
  KeyRound,
  ShieldCheck,
  FileCheck2,
  HelpCircle,
  Sun,
  Moon,
  Flame,
  RotateCcw,
  Copy,
  Building2,
  Check,
  Sparkles
} from 'lucide-react';

interface CustomContextMenuProps {
  onOpenPassport: () => void;
  onOpenBreakGlass: () => void;
}

export const CustomContextMenu: React.FC<CustomContextMenuProps> = ({
  onOpenPassport,
  onOpenBreakGlass
}) => {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    currentEntityId,
    activeEntity,
    currentUser,
    replayLoadingScreen,
    resetToSeedData,
    showToast
  } = useApp();

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();

      // Estimate menu dimensions
      const menuWidth = 280;
      const menuHeight = 460;

      // Ensure menu doesn't go off-screen
      const x = Math.min(e.clientX, window.innerWidth - menuWidth - 10);
      const y = Math.min(e.clientY, window.innerHeight - menuHeight - 10);

      setPosition({ x: Math.max(10, x), y: Math.max(10, y) });
      setVisible(true);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVisible(false);
      }
    };

    const handleScroll = () => {
      setVisible(false);
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  if (!visible) return null;

  const navigateTo = (tab: ActiveTab) => {
    setActiveTab(tab);
    setVisible(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Platform link copied to your clipboard!');
    setVisible(false);
  };

  return (
    <div
      ref={menuRef}
      style={{ top: `${position.y}px`, left: `${position.x}px` }}
      className={`fixed z-50 w-72 rounded-xl shadow-2xl border text-xs select-none py-1.5 animate-in fade-in zoom-in-95 duration-100 backdrop-blur-md ${
        theme === 'dark'
          ? 'bg-slate-900/95 border-slate-700/80 text-slate-200 divide-slate-800 shadow-black/60'
          : 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/60 divide-slate-100'
      }`}
    >
      {/* Menu Header with Current Context Badge */}
      <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
            NX
          </div>
          <span className="font-bold tracking-tight text-slate-900 dark:text-white">NEXORA Fast Actions</span>
        </div>
        <span
          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
            theme === 'dark'
              ? 'bg-slate-800 text-sky-400 border border-slate-700'
              : 'bg-sky-50 text-sky-700 border border-sky-200'
          }`}
        >
          {currentEntityId === 'GROUP' ? 'ALL FIRMS' : activeEntity?.code}
        </span>
      </div>

      <div className="px-3.5 py-1.5 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
        Current User: <span className="font-bold text-slate-900 dark:text-slate-100">{currentUser.name}</span> ({currentUser.title})
      </div>

      {/* Navigation Quick Jump */}
      <div className="py-1">
        <div className="px-3.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-300">
          Jump to Module
        </div>

        <button
          onClick={() => navigateTo('command_center')}
          className={`w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
            activeTab === 'command_center'
              ? (theme === 'dark' ? 'bg-slate-800 font-bold text-sky-400' : 'bg-sky-50 font-bold text-sky-700')
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>All Companies Overview</span>
        </button>

        <button
          onClick={() => navigateTo('finance')}
          className={`w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
            activeTab === 'finance'
              ? (theme === 'dark' ? 'bg-slate-800 font-bold text-sky-400' : 'bg-sky-50 font-bold text-sky-700')
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-amber-500" />
          <span>Accounting & Financial Books</span>
        </button>

        <button
          onClick={() => navigateTo('inventory')}
          className={`w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
            activeTab === 'inventory'
              ? (theme === 'dark' ? 'bg-slate-800 font-bold text-sky-400' : 'bg-sky-50 font-bold text-sky-700')
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
        >
          <Boxes className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Products & Warehouse Stock</span>
        </button>

        <button
          onClick={() => navigateTo('sales_procurement')}
          className={`w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
            activeTab === 'sales_procurement'
              ? (theme === 'dark' ? 'bg-slate-800 font-bold text-sky-400' : 'bg-sky-50 font-bold text-sky-700')
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Buying & Selling (Orders & Bills)</span>
        </button>

        <button
          onClick={() => navigateTo('hr')}
          className={`w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
            activeTab === 'hr'
              ? (theme === 'dark' ? 'bg-slate-800 font-bold text-sky-400' : 'bg-sky-50 font-bold text-sky-700')
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Team Directory & Staff Leaves</span>
        </button>

        <button
          onClick={() => navigateTo('intercompany')}
          className={`w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
            activeTab === 'intercompany'
              ? (theme === 'dark' ? 'bg-slate-800 font-bold text-sky-400' : 'bg-sky-50 font-bold text-sky-700')
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
        >
          <GitCompareArrows className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Internal Company Sales</span>
        </button>
      </div>

      <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

      {/* Security & System Actions */}
      <div className="py-1">
        <div className="px-3.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Security & Access
        </div>

        <button
          onClick={() => {
            onOpenPassport();
            setVisible(false);
          }}
          className="w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-500" />
          <span>Company Access Badges</span>
        </button>

        <button
          onClick={() => navigateTo('audit')}
          className="w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Tamper-Proof Audit Log</span>
        </button>

        <button
          onClick={() => navigateTo('tenant_tests')}
          className="w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          <FileCheck2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Run Security Lock Tests</span>
        </button>

        <button
          onClick={() => navigateTo('help')}
          className="w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sky-700 dark:text-sky-300 font-bold cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>HELP & User Guide</span>
        </button>

        <button
          onClick={() => {
            onOpenBreakGlass();
            setVisible(false);
          }}
          className="w-full px-3.5 py-1.5 text-left flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-semibold cursor-pointer"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Emergency 4-Hour Access Pass</span>
        </button>
      </div>

      <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

      {/* Theme & Platform Controls */}
      <div className="py-1">
        <button
          onClick={() => {
            toggleTheme();
            setVisible(false);
          }}
          className="w-full px-3.5 py-1.5 text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <span className="font-bold">Switch to {theme === 'dark' ? 'White Theme' : 'Dark Theme'}</span>
          </div>
          <span className="text-[10px] font-mono opacity-60">
            {theme === 'dark' ? 'White' : 'Dark'}
          </span>
        </button>

        <button
          onClick={() => {
            replayLoadingScreen();
            setVisible(false);
          }}
          className="w-full px-3.5 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-amber-600 dark:text-amber-400 font-semibold cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Replay Intro Animation</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="w-full px-3.5 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy System URL</span>
        </button>

        <button
          onClick={() => {
            resetToSeedData();
            setVisible(false);
          }}
          className="w-full px-3.5 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Initial State</span>
        </button>
      </div>

      {/* Footer Info Notice (Inspect element explicitly excluded) */}
      <div className="px-3.5 pt-2 pb-1 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>NEXORA Secure UI</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">Verified Active</span>
      </div>
    </div>
  );
};
