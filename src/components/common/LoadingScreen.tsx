import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Database, Layers, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const initSteps = [
    { title: 'Setting up company privacy walls & database security', icon: ShieldCheck },
    { title: 'Loading 3 operating companies (Apex Factory · Nova Stores · Zenith Advisory)', icon: Database },
    { title: 'Activating tamper-proof digital seals for all transactions', icon: Layers },
    { title: 'Configuring team permissions and company access badges', icon: ShieldCheck },
    { title: 'NEXORA Platform is Ready. Welcome!', icon: CheckCircle2 }
  ];

  useEffect(() => {
    // Progress increment timer
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Smooth progressive acceleration
        const increment = prev < 30 ? 6 : prev < 75 ? 4 : 8;
        const next = Math.min(100, prev + increment);

        // Update step index based on progress
        if (next < 25) setStepIndex(0);
        else if (next < 50) setStepIndex(1);
        else if (next < 75) setStepIndex(2);
        else if (next < 95) setStepIndex(3);
        else setStepIndex(4);

        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  // When progress hits 100, wait briefly then trigger exit
  useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        handleEnter();
      }, 650);
      return () => clearTimeout(exitTimer);
    }
  }, [progress]);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  const CurrentIcon = initSteps[stepIndex].icon;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none transition-all duration-500 overflow-hidden bg-slate-950 ${
        isExiting ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 max-w-2xl w-full px-6 flex flex-col items-center text-center">
        {/* Animated Brand Emblem */}
        <div className="relative mb-6">
          <div className="absolute -inset-2.5 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 opacity-30 blur-md animate-pulse" />

          {/* Central Logo Box */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl flex items-center justify-center transform transition-transform hover:scale-105">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-sky-400 flex items-center justify-center shadow-lg">
              <span className="font-black text-2xl tracking-wider text-white">NX</span>
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-400 rounded-xs" />
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-emerald-400 rounded-xs" />
          </div>
        </div>

        {/* Animated Typography as explicitly requested:
            "Welcome to Nexora. A Multi-Business Operating Platform. Developed by Kazi Jawad" */}
        <div className="space-y-3 mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight animate-in fade-in slide-in-from-bottom-3 duration-700">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Nexora
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-medium tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            A Multi-Business Operating Platform.
          </p>

          <div className="pt-2 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 shadow-lg shadow-amber-500/10 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-slate-400 font-medium">Developed by</span>
              <span className="font-bold text-amber-300 tracking-wide">
                Kazi Jawad
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
        </div>

        {/* System Initialization Loading Meter */}
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-sm space-y-3">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <CurrentIcon className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-slate-400 font-mono text-[11px]">System Launch</span>
            </div>
            <span className="font-mono font-bold text-sky-400 text-xs">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 p-0.5 border border-slate-800 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 transition-all duration-150 ease-out shadow-xs shadow-sky-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Status Text */}
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between min-h-[20px]">
            <span className="truncate max-w-[340px] text-slate-300">
              {initSteps[stepIndex].title}
            </span>
            {progress === 100 && (
              <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1 text-[10px]">
                <CheckCircle2 className="w-3 h-3" /> READY
              </span>
            )}
          </div>
        </div>

        {/* Instant Skip / Enter Action */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleEnter}
            className="group flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all shadow-md hover:border-sky-500/50 cursor-pointer"
          >
            <span>{progress === 100 ? 'Enter Dashboard' : 'Skip & Enter Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Tech Specs Footer Tag */}
        <div className="mt-8 flex items-center gap-2 text-[10px] text-slate-400 font-mono font-medium">
          <span>DATA PRIVACY PROTECTED</span>
          <span>·</span>
          <span>TAMPER-PROOF AUDIT LOG</span>
          <span>·</span>
          <span>COMPANY ACCESS PASS v1.0</span>
        </div>
      </div>
    </div>
  );
};
