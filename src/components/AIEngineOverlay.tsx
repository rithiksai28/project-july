import React from 'react';
import { useApp } from '../context/AppContext';

export default function AIEngineOverlay() {
  const { isPredicting, predictionProgressText, predictionStep } = useApp();

  if (!isPredicting) return null;

  return (
    <div className="glass-card rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden z-20 border-secondary border-2 shadow-2xl bg-white/95 dark:bg-zinc-950/95 transition-all">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary mb-6" />
      <h3 className="font-headline-md text-2xl font-bold text-on-surface dark:text-white">EduPulse Predictive Analytics Run</h3>
      <p className="text-secondary font-semibold font-mono text-sm tracking-wider mt-2">{predictionProgressText}</p>
      <div className="w-full max-w-xl bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mt-6">
        <div
          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
          style={{ width: `${(predictionStep / 5) * 100}%` }}
        />
      </div>
      <p className="text-xs text-on-surface-variant mt-4">Calculated from historical variables, class attendance curves, and individual risk weights.</p>
    </div>
  );
}
