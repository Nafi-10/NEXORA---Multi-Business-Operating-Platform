import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  MousePointerClick,
  Sun,
  Moon,
  Sparkles,
  X,
  ArrowRight
} from 'lucide-react';

export const QuickStartGuide: React.FC = () => {
  const {
    showQuickTour,
    setShowQuickTour,
    theme,
    toggleTheme,
    setCurrentEntityId,
    switchUserPersona
  } = useApp();

  if (!showQuickTour) return null;

  return (
    <div className="mx-6 mt-4 p-4 rounded-xl border transition-all animate-in fade-in duration-200 bg-white dark:bg-slate-900 border-sky-300 dark:border-sky-800 shadow-xs">
      <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Welcome to NEXORA — Easy Start Guide
              <span className="text-[10px] bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-300 dark:border-sky-700 px-2 py-0.5 rounded font-bold">
                Quick Tips
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              NEXORA helps you run multiple companies easily from a single screen. Here is how to test all features:
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowQuickTour(false);
            localStorage.setItem('nexora_quick_tour_seen', 'true');
          }}
          className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white p-1 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer font-bold"
          title="Dismiss guide"
        >
          <span className="text-[11px]">Close</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
        {/* Step 1: Switch Businesses */}
        <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-2 shadow-2xs">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-300">
              <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>1. Switch Between Companies</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
              Use the top dropdown to view <strong>Apex Factory (USA)</strong>, <strong>Nova Stores (Europe)</strong>, or <strong>Zenith Consulting (UK)</strong>.
            </p>
          </div>
          <button
            onClick={() => setCurrentEntityId('ent_ret_02')}
            className="text-[11px] font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 flex items-center gap-1 mt-1 cursor-pointer"
          >
            <span>Open Nova Stores (€)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Step 2: Try Different Roles */}
        <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-2 shadow-2xs">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>2. Test Team Roles</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
              Click the top-right profile. Switch to <strong>Sara (Finance)</strong>, <strong>Ali (Sales)</strong>, or <strong>Fatima (HR)</strong> to see how permissions adapt.
            </p>
          </div>
          <button
            onClick={() => switchUserPersona('usr_ali')}
            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 mt-1 cursor-pointer"
          >
            <span>Test as Ali (Sales Rep)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Step 3: Right-Click Custom Menu */}
        <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-2 shadow-2xs">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
              <MousePointerClick className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>3. Right-Click Fast Actions</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
              Right-click your mouse anywhere on the page to open your custom fast-action menu (browser inspect is disabled).
            </p>
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1">
            <span>🖱️ Right-click mouse to test</span>
          </div>
        </div>

        {/* Step 4: Dark & White Theme */}
        <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between space-y-2 shadow-2xs">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span>4. White & Dark Theme</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
              Toggle between crisp daylight White Theme and sleek night Dark Theme anytime.
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 mt-1 cursor-pointer"
          >
            <span>Switch to {theme === 'dark' ? 'White Theme' : 'Dark Theme'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
