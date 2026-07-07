import React from 'react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const {
    isDarkMode,
    setIsDarkMode,
    modelAccuracy,
    setModelAccuracy,
    setToastMessage,
  } = useApp();

  const handleAccuracyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setModelAccuracy(value);
  };

  const saveSettings = () => {
    setToastMessage('System configurations and accuracy bounds stored successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white font-bold">
            System Settings
          </h2>
          <p className="text-on-surface-variant/70 dark:text-surface-variant/80 font-body-md text-sm">
            Configure system configurations, predictive accuracy ceilings, and workspace presets.
          </p>
        </div>
        
        <button
          onClick={saveSettings}
          className="px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg hover:bg-primary/90 transition-all cursor-pointer"
        >
          Save Configurations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core preferences */}
        <div className="glass-card p-8 rounded-[32px] space-y-6">
          <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white border-b border-white/10 pb-4">
            Interface Preferences
          </h3>

          <div className="flex justify-between items-center py-2">
            <div>
              <h4 className="font-bold text-sm text-on-surface dark:text-white">Dark Visual Mode</h4>
              <p className="text-xs text-zinc-500">Toggle dark visual parameters across all components.</p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-14 h-8 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
                isDarkMode ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-700'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex justify-between items-center py-2 border-t border-white/10 pt-4">
            <div>
              <h4 className="font-bold text-sm text-on-surface dark:text-white">Visual Fluidity</h4>
              <p className="text-xs text-zinc-500">Enable advanced geometric and shader floating matrices.</p>
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase">Always Active</span>
          </div>
        </div>

        {/* Prediction preferences */}
        <div className="glass-card p-8 rounded-[32px] space-y-6">
          <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white border-b border-white/10 pb-4">
            Predictive Model Settings
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <h4 className="font-bold text-on-surface dark:text-white">Regression Confidence Floor</h4>
              <span className="font-mono text-primary dark:text-secondary-fixed font-bold">{modelAccuracy}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="100"
              step="0.1"
              value={modelAccuracy}
              onChange={handleAccuracyChange}
              className="w-full accent-primary bg-zinc-200 dark:bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-zinc-500">Set the target accuracy ceiling to calibrate predictive analytics.</p>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-4">
            <h4 className="font-bold text-sm text-on-surface dark:text-white">Algorithm Matrix</h4>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <label className="flex items-center gap-2 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-white/10 cursor-pointer">
                <input type="radio" name="algo" defaultChecked className="accent-primary" />
                <span className="font-semibold text-on-surface dark:text-white">Gradient Boosted</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-white/10 cursor-pointer">
                <input type="radio" name="algo" className="accent-primary" />
                <span className="font-semibold text-on-surface dark:text-white">Linear Decay</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
