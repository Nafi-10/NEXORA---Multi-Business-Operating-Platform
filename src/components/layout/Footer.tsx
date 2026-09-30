import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { theme } = useApp();

  return (
    <footer
      className={`w-full border-t text-xs py-4 px-4 lg:px-6 select-none transition-colors duration-200 text-center ${
        theme === 'dark'
          ? 'bg-slate-950 border-slate-800 text-slate-200 shadow-inner'
          : 'bg-white border-slate-200 text-slate-700 shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <p className="text-xs sm:text-sm font-medium leading-relaxed tracking-wide text-slate-700 dark:text-slate-200">
          <span className="font-bold text-sky-600 dark:text-sky-400">NEXORA</span>
          <span> - Multi-Business Operating Platform. </span>
          <span className="font-semibold text-slate-900 dark:text-white">NEXORA. </span>
          <span>Protected under the International Copyright Act. All rights reserved. Developed by </span>
          <span className="font-bold text-amber-600 dark:text-amber-300">Kazi Jawad.</span>
        </p>
      </div>
    </footer>
  );
};
