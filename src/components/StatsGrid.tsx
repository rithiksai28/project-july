import React from 'react';
import { useApp } from '../context/AppContext';

export default function StatsGrid() {
  const {
    derivedStats,
    selectedRiskFilter,
    setSelectedRiskFilter,
    modelAccuracy,
  } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-card-gap relative">
      <div className="data-flow-line top-1/2 left-0 pointer-events-none" />
      
      {/* Total Enrolled Card */}
      <div
        onClick={() => setSelectedRiskFilter('All')}
        className={`glass-card p-6 rounded-3xl relative z-10 transition-all hover:translate-y-[-4px] cursor-pointer ${
          selectedRiskFilter === 'All' ? 'border-primary border-2 shadow-xl bg-primary/5' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary dark:text-blue-400">
            <span className="material-symbols-outlined">group</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant/50 dark:text-white/40 uppercase">Total</span>
        </div>
        <p className="text-4xl font-bold text-on-surface dark:text-white">
          {derivedStats.total.toLocaleString()}
        </p>
        <p className="text-sm text-on-surface-variant dark:text-white/60 mt-1">Enrolled Students</p>
      </div>

      {/* Safe Zone Card */}
      <div
        onClick={() => setSelectedRiskFilter('Safe')}
        className={`glass-card p-6 rounded-3xl relative z-10 transition-all hover:translate-y-[-4px] cursor-pointer ${
          selectedRiskFilter === 'Safe' ? 'border-green-500 border-2 shadow-xl bg-green-500/5' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant/50 dark:text-white/40 uppercase">Safe Zone</span>
        </div>
        <p className="text-4xl font-bold text-on-surface dark:text-white">
          {derivedStats.safe.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm mt-1">
          <span className="material-symbols-outlined text-[16px]">trending_up</span>
          <span>+12%</span>
        </div>
      </div>

      {/* Warning Card */}
      <div
        onClick={() => setSelectedRiskFilter('Warning')}
        className={`glass-card p-6 rounded-3xl relative z-10 transition-all hover:translate-y-[-4px] cursor-pointer ${
          selectedRiskFilter === 'Warning' ? 'border-yellow-500 border-2 shadow-xl bg-yellow-500/5' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant/50 dark:text-white/40 uppercase">Warning</span>
        </div>
        <p className="text-4xl font-bold text-on-surface dark:text-white">
          {derivedStats.warning.toLocaleString()}
        </p>
        <p className="text-sm text-on-surface-variant dark:text-white/60 mt-1">Review Required</p>
      </div>

      {/* Critical Card */}
      <div
        onClick={() => setSelectedRiskFilter('Critical')}
        className={`glass-card p-6 rounded-3xl relative z-10 transition-all hover:translate-y-[-4px] cursor-pointer ${
          selectedRiskFilter === 'Critical' ? 'border-error border-2 shadow-xl bg-error/5' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-error/10 rounded-2xl flex items-center justify-center text-error">
            <span className="material-symbols-outlined">dangerous</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant/50 dark:text-white/40 uppercase">Critical</span>
        </div>
        <p className="text-4xl font-bold text-on-surface dark:text-white">
          {derivedStats.critical.toLocaleString()}
        </p>
        <div className="flex items-center gap-1 text-error font-bold text-sm mt-1">
          <span className="material-symbols-outlined text-[16px]">trending_up</span>
          <span>+3%</span>
        </div>
      </div>

      {/* Accuracy Card */}
      <div className="glass-card p-6 rounded-3xl relative z-10 border-primary/20 border-2 transition-all hover:translate-y-[-4px] bg-primary/5">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">precision_manufacturing</span>
          </div>
          <span className="text-xs font-bold text-on-surface-variant/50 dark:text-white/40 uppercase">Accuracy</span>
        </div>
        <p className="text-4xl font-bold text-primary dark:text-blue-400">{modelAccuracy}%</p>
        <p className="text-sm text-primary/70 dark:text-blue-300 mt-1">Model Reliability</p>
      </div>
    </div>
  );
}
