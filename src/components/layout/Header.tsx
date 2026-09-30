import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ChevronDown,
  ShieldAlert,
  Flame,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Lock,
  Clock,
  Search,
  Bell,
  Check,
  Sun,
  Moon,
  HelpCircle
} from 'lucide-react';

interface HeaderProps {
  onOpenBreakGlass: () => void;
  onOpenPassport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBreakGlass, onOpenPassport }) => {
  const {
    currentEntityId,
    setCurrentEntityId,
    activeEntity,
    entities,
    currentUser,
    switchUserPersona,
    users,
    breakGlassSession,
    terminateBreakGlass,
    approvalItems,
    searchQuery,
    setSearchQuery,
    resetToSeedData,
    setActiveTab,
    theme,
    toggleTheme,
    setShowQuickTour
  } = useApp();

  const [entityDropdownOpen, setEntityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const pendingApprovalsCount = approvalItems.filter(a => a.status === 'PENDING').length;

  return (
    <header
      className={`h-16 border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 select-none transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Left: Brand & Company Switcher */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => setActiveTab('command_center')}
          title="Return to Group Dashboard"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-sky-500 flex items-center justify-center font-black text-white tracking-wider text-sm shadow-sm group-hover:scale-105 transition-transform">
            NX
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-black text-base tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                NEXORA
              </span>
              <span className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 border border-sky-300 dark:border-sky-700 px-1.5 py-0.2 rounded">
                Multi-Business
              </span>
            </div>
            <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium leading-tight">
              Operating Platform
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* COMPANY SWITCHER */}
        <div className="relative">
          <button
            onClick={() => {
              setEntityDropdownOpen(!entityDropdownOpen);
              setUserDropdownOpen(false);
            }}
            className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 text-xs text-left transition-all ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-100'
                : 'bg-slate-100/80 hover:bg-slate-200/80 border-slate-300 shadow-xs'
            }`}
          >
            <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-300 font-bold">
                Viewing Company
              </span>
              <span className="font-bold max-w-[140px] sm:max-w-[200px] truncate text-slate-900 dark:text-white">
                {currentEntityId === 'GROUP' ? 'All 3 Companies Combined' : `${activeEntity?.code} · ${activeEntity?.name}`}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1" />
          </button>

          {entityDropdownOpen && (
            <div
              className={`absolute left-0 mt-2 w-84 border rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="px-3.5 py-1.5 border-b border-slate-200 dark:border-slate-800 mb-1 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Choose Company to Manage</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">Each business has its own independent books</p>
                </div>
                <span
                  className="text-[10px] text-sky-600 dark:text-sky-400 cursor-pointer hover:underline font-bold"
                  onClick={onOpenPassport}
                >
                  Badges →
                </span>
              </div>

              {/* Group Consolidated Option */}
              <button
                onClick={() => {
                  setCurrentEntityId('GROUP');
                  setEntityDropdownOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 text-left flex items-start justify-between transition-colors ${
                  currentEntityId === 'GROUP'
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-l-3 border-sky-600 dark:border-sky-500'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                    <span>All 3 Companies Combined</span>
                    <span className="text-[9px] bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 px-1 py-0.2 rounded font-bold">
                      Group Overview
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
                    See total bank cash, group profit, and consolidated reports
                  </div>
                </div>
                {currentEntityId === 'GROUP' && <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />}
              </button>

              <div className="my-1.5 border-t border-slate-200 dark:border-slate-800" />

              {/* Individual Entities */}
              {entities.map(ent => {
                const grant = currentUser.accessPassport.find(g => g.entityId === ent.id);
                const isApproved = grant?.status === 'approved' || currentUser.isPlatformOwner;
                const isLocked = !isApproved;

                return (
                  <button
                    key={ent.id}
                    disabled={isLocked && !breakGlassSession?.active}
                    onClick={() => {
                      if (isApproved || breakGlassSession?.active) {
                        setCurrentEntityId(ent.id);
                        setEntityDropdownOpen(false);
                      }
                    }}
                    className={`w-full px-3.5 py-2 text-left flex items-start justify-between transition-colors ${
                      currentEntityId === ent.id
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-l-3 border-sky-600 dark:border-sky-500'
                        : isLocked
                        ? 'opacity-60 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 cursor-not-allowed'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: ent.color }} />
                        <span className="font-bold">{ent.code}</span>
                        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[140px] font-medium">{ent.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 flex items-center gap-1.5 font-medium">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{ent.currency}</span>
                        <span>·</span>
                        <span className="capitalize">{ent.type}</span>
                        <span>·</span>
                        {isApproved ? (
                          <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5 font-bold">
                            <CheckCircle2 className="w-3 h-3 inline" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-amber-700 dark:text-amber-400 flex items-center gap-0.5 font-bold">
                            <Lock className="w-3 h-3 inline" /> Locked
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1">
                      {isLocked ? (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setEntityDropdownOpen(false);
                            onOpenPassport();
                          }}
                          className="text-[10px] bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-700 hover:bg-amber-100 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
                        >
                          Request
                        </button>
                      ) : currentEntityId === ent.id ? (
                        <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts, invoices, products, orders..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full border rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-sky-500 transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800/90 border-slate-700 text-slate-100 placeholder-slate-400'
                : 'bg-slate-100/90 border-slate-300 text-slate-900 placeholder-slate-500 shadow-2xs'
            }`}
          />
        </div>
      </div>

      {/* Right: Quick Guide, Theme Switcher, Passports, Approvals, Persona Switcher */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Help / Easy Start Guide Button */}
        <button
          onClick={() => setShowQuickTour(true)}
          title="Show Easy Start Guide"
          className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
        </button>

        {/* THEME SWITCHER BUTTON */}
        <button
          onClick={toggleTheme}
          title={`Click to switch to ${theme === 'dark' ? 'White Theme' : 'Dark Theme'}`}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-xs cursor-pointer ${
            theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
          }`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">White Theme</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Dark Theme</span>
            </>
          )}
        </button>

        {/* Reset State Button */}
        <button
          onClick={resetToSeedData}
          title="Reset back to pristine start state"
          className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Access Badges Trigger */}
        <button
          onClick={onOpenPassport}
          className={`flex items-center gap-1.5 border px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            theme === 'dark'
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
          }`}
          title="View company access badges and permissions"
        >
          <KeyRound className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">Company Badges</span>
        </button>

        {/* Break Glass Emergency Button */}
        {breakGlassSession?.active ? (
          <div className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-600 px-2.5 py-1 rounded-lg text-xs text-rose-800 dark:text-rose-200 animate-pulse">
            <Flame className="w-4 h-4 text-rose-600 dark:text-rose-500 shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold text-[10px] uppercase text-rose-700 dark:text-rose-300">EMERGENCY OVERRIDE</span>
              <span className="text-[9px] text-rose-600 dark:text-rose-200">Active (4hr Pass)</span>
            </div>
            <button
              onClick={terminateBreakGlass}
              className="ml-1 text-[10px] bg-rose-700 hover:bg-rose-600 px-2 py-0.5 rounded font-bold text-white transition-colors cursor-pointer"
            >
              End
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenBreakGlass}
            title="Emergency access pass for statutory audits or crisis recovery"
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 dark:text-rose-300 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-500" />
            <span className="hidden lg:inline">Emergency Pass</span>
          </button>
        )}

        {/* Approvals Bell */}
        <button
          onClick={() => setActiveTab('approvals')}
          className="relative p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title={`${pendingApprovalsCount} orders or requests waiting for review`}
        >
          <Bell className="w-4 h-4" />
          {pendingApprovalsCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        {/* Vertical Divider */}
        <div className="h-7 w-px bg-slate-200 dark:bg-slate-800" />

        {/* USER PERSONA SWITCHER */}
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setEntityDropdownOpen(false);
            }}
            className={`flex items-center gap-2 border rounded-lg px-2.5 py-1 text-left transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300'
            }`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-600"
            />
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium leading-tight">
                {currentUser.title}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-76 border rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 mb-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Switch Test Roles
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  Select a persona to test how permissions and confidentiality rules change
                </div>
              </div>

              {users.map(u => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUserPersona(u.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-l-3 border-sky-600 dark:border-sky-500'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-600 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold flex items-center justify-between text-slate-900 dark:text-white">
                        <span className="truncate">{u.name}</span>
                        {u.id === 'usr_khalid' && (
                          <span className="text-[9px] bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-1 py-0.2 rounded flex items-center gap-0.5 font-bold">
                            <Clock className="w-2.5 h-2.5 inline" /> 30d Pass
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 truncate font-medium">{u.title}</div>
                      <div className="text-[10px] text-sky-600 dark:text-sky-400 font-mono mt-0.5 font-bold">{u.baseRole}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
