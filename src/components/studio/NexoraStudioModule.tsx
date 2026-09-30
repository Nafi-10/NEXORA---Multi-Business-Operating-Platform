import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wand2,
  Building,
  CheckCircle2,
  Copy,
  Plus,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { BusinessOnboardingInput } from '../../types/templates';

export const NexoraStudioModule: React.FC = () => {
  const {
    templates,
    entities,
    onboardNewBusiness,
    showToast
  } = useApp();

  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Form input state
  const [formData, setFormData] = useState<BusinessOnboardingInput>({
    name: 'Helios Renewable Energy Ltd',
    code: 'ENG-D',
    type: 'manufacturing',
    currency: 'USD',
    country: 'United States',
    taxId: 'US-8849102-E',
    fiscalYearStart: '01-01',
    templateId: 'tmpl_mfg',
    adminEmail: 'admin@helios-energy.com',
    initialCashUSD: 1500000
  });

  const handleFinishWizard = (e: React.FormEvent) => {
    e.preventDefault();
    onboardNewBusiness(formData);
    setShowWizardModal(false);
    setWizardStep(1);
  };

  const handleCloneConfig = (sourceEntityName: string) => {
    showToast(`Configuration cloned from ${sourceEntityName}: Chart of Accounts and approval rules duplicated.`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Launch New Business & Templates
            </h1>
            <span className="text-[11px] font-mono text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700/60 px-2 py-0.5 rounded font-bold">
              Company Blueprints
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium">
            Instantly spin up a new subsidiary, branch, or operating company from pre-configured blueprints, or clone an existing business model.
          </p>
        </div>

        <button
          onClick={() => setShowWizardModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Launch Business Setup Wizard</span>
        </button>
      </div>

      {/* Industry Templates Library */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pre-Configured Industry Blueprints</h2>
          <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Includes Accounts, Team Roles, and Approval Rules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map(tmpl => (
            <div
              key={tmpl.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-slate-700 p-5 rounded-xl flex flex-col justify-between transition-all shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                    {tmpl.businessType}
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded font-mono font-bold border border-slate-200 dark:border-slate-700">
                    {tmpl.defaultCurrency} Currency
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">{tmpl.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">{tmpl.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between font-medium">
                    <span>Standard Accounts:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{tmpl.recommendedChartAccountsCount} Accounts</span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    <span className="block mb-1 font-semibold text-slate-700 dark:text-slate-200">Included Modules:</span>
                    <div className="flex flex-wrap gap-1">
                      {tmpl.standardModules.map(m => (
                        <span key={m} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-semibold">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, templateId: tmpl.id, type: tmpl.businessType, currency: tmpl.defaultCurrency }));
                    setShowWizardModal(true);
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-sky-700 dark:text-sky-300 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Use This Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Existing Entities & Clone Configuration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Business Models</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">Clone existing charts of accounts and settings directly to a new sister company</p>
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{entities.length} Companies Running</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {entities.map(ent => (
            <div
              key={ent.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs"
                  style={{ backgroundColor: ent.color }}
                >
                  {ent.code.slice(0, 3)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{ent.name}</div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 font-mono font-semibold">
                    {ent.code} · {ent.currency} · {ent.headquarters}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCloneConfig(ent.name)}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-[10px] font-bold text-slate-800 dark:text-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                title="Clone this business structure"
              >
                <Copy className="w-3 h-3" />
                <span>Clone</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding Wizard Modal */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">New Business Setup Wizard</h3>
              </div>
              <button
                onClick={() => setShowWizardModal(false)}
                className="text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFinishWizard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Company Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Operating Currency</label>
                  <select
                    value={formData.currency}
                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                    <option value="SGD">SGD (S$) - Singapore Dollar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Country of Registration</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Initial Bank Balance ($)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.initialCashUSD}
                    onChange={e => setFormData({ ...formData, initialCashUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Primary Admin Email</label>
                <input
                  type="email"
                  required
                  value={formData.adminEmail}
                  onChange={e => setFormData({ ...formData, adminEmail: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowWizardModal(false)}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Launch & Create Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
