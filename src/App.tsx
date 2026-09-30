/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { GroupCommandCenter } from './components/command-center/GroupCommandCenter';
import { FinanceModule } from './components/finance/FinanceModule';
import { InventoryModule } from './components/inventory/InventoryModule';
import { SalesProcurementModule } from './components/sales-procurement/SalesProcurementModule';
import { HRModule } from './components/hr/HRModule';
import { InterCompanyModule } from './components/intercompany/InterCompanyModule';
import { NexoraStudioModule } from './components/studio/NexoraStudioModule';
import { ApprovalEngineModule } from './components/approvals/ApprovalEngineModule';
import { AuditVaultView } from './components/audit/AuditVaultView';
import { TenantIsolationTester } from './components/security/TenantIsolationTester';
import { HelpModule } from './components/help/HelpModule';
import { AccessPassportModal } from './components/passport/AccessPassportModal';
import { BreakGlassModal } from './components/security/BreakGlassModal';
import { CustomContextMenu } from './components/common/CustomContextMenu';
import { QuickStartGuide } from './components/common/QuickStartGuide';
import { LoadingScreen } from './components/common/LoadingScreen';
import { CheckCircle2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab, toastMessage, theme, isLoadingScreenActive, setIsLoadingScreenActive } = useApp();
  const [passportOpen, setPassportOpen] = useState(false);
  const [breakGlassOpen, setBreakGlassOpen] = useState(false);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-white transition-colors duration-200 ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Animated Loading Screen displayed before dashboard */}
      {isLoadingScreenActive && (
        <LoadingScreen onComplete={() => setIsLoadingScreenActive(false)} />
      )}

      {/* Global Header */}
      <Header
        onOpenPassport={() => setPassportOpen(true)}
        onOpenBreakGlass={() => setBreakGlassOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Main Workspace */}
        <main
          className={`flex-1 overflow-y-auto pb-12 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-slate-950/95' : 'bg-slate-50/90'
          }`}
        >
          {/* User-friendly Quick-Start Guide Banner */}
          <QuickStartGuide />

          {activeTab === 'command_center' && <GroupCommandCenter />}
          {activeTab === 'finance' && <FinanceModule />}
          {activeTab === 'inventory' && <InventoryModule />}
          {activeTab === 'sales_procurement' && <SalesProcurementModule />}
          {activeTab === 'hr' && <HRModule />}
          {activeTab === 'intercompany' && <InterCompanyModule />}
          {activeTab === 'studio' && <NexoraStudioModule />}
          {activeTab === 'approvals' && <ApprovalEngineModule />}
          {activeTab === 'audit' && <AuditVaultView />}
          {activeTab === 'tenant_tests' && <TenantIsolationTester />}
          {activeTab === 'help' && <HelpModule />}
          {activeTab === 'passport' && (
            <div className="p-6">
              <AccessPassportModal isOpen={true} onClose={() => {}} />
            </div>
          )}
        </main>
      </div>

      {/* Global Footer with Copyright Act & Developer credit */}
      <Footer />

      {/* Custom Right-Click Tab Menu (No Inspect option) */}
      <CustomContextMenu
        onOpenPassport={() => setPassportOpen(true)}
        onOpenBreakGlass={() => setBreakGlassOpen(true)}
      />

      {/* Modals */}
      <AccessPassportModal isOpen={passportOpen} onClose={() => setPassportOpen(false)} />
      <BreakGlassModal isOpen={breakGlassOpen} onClose={() => setBreakGlassOpen(false)} />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-14 right-5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div
            className={`border px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs font-semibold ${
              theme === 'dark'
                ? 'bg-slate-900 border-sky-500/50 text-slate-100'
                : 'bg-white border-sky-500 text-slate-900 shadow-xl shadow-slate-200/80'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
