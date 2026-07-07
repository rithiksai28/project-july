import React from 'react';
import { useApp } from '../context/AppContext';

export default function RiskPieChart() {
  const { students, derivedStats } = useApp();

  const total = students.length || 1;
  const safeCount = students.filter(s => s.riskLevel === 'Safe').length;
  const warningCount = students.filter(s => s.riskLevel === 'Warning').length;
  const criticalCount = students.filter(s => s.riskLevel === 'Critical').length;

  const safePercent = Math.round((safeCount / total) * 100);
  const warningPercent = Math.round((warningCount / total) * 100);
  const criticalPercent = Math.round((criticalCount / total) * 100);

  return (
    <div className="glass-card p-8 rounded-[32px] flex flex-col w-full h-full">
      <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white mb-6">Risk Distribution</h3>
      <div className="flex-1 flex items-center justify-around flex-wrap gap-6">
        <div className="relative w-48 h-48 shrink-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" fill="none" r="40" stroke="#f2f4f6" strokeWidth="12" className="opacity-10 dark:opacity-5" />
            {/* Safe curve */}
            <circle cx="50" cy="50" fill="none" r="40" stroke="#00dbe7" strokeDasharray="180 251" strokeDashoffset="0" strokeWidth="12" transform="rotate(-90 50 50)" />
            {/* Warning curve */}
            <circle cx="50" cy="50" fill="none" r="40" stroke="#0066FF" strokeDasharray="70 251" strokeDashoffset="-180" strokeWidth="12" transform="rotate(-90 50 50)" />
            {/* Critical curve */}
            <circle cx="50" cy="50" fill="none" r="40" stroke="#ba1a1a" strokeDasharray="25 251" strokeDashoffset="-250" strokeWidth="12" transform="rotate(-90 50 50)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span className="text-3xl font-bold text-on-surface dark:text-white">
              {(derivedStats.safe + derivedStats.warning + derivedStats.critical).toLocaleString()}
            </span>
            <span className="text-[10px] text-on-surface-variant dark:text-white/60 font-bold uppercase tracking-tighter">Total Students</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#00dbe7]" />
            <span className="text-sm font-bold text-on-surface-variant dark:text-white/80">
              Safe ({safePercent || 75}%)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm font-bold text-on-surface-variant dark:text-white/80">
              Warning ({warningPercent || 17}%)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-error" />
            <span className="text-sm font-bold text-on-surface-variant dark:text-white/80">
              Critical ({criticalPercent || 8}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
