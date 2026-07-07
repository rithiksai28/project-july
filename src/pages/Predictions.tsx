import React from 'react';
import { useApp } from '../context/AppContext';
import StatsGrid from '../components/StatsGrid';
import TrendChart from '../components/TrendChart';
import AIEngineOverlay from '../components/AIEngineOverlay';

export default function Predictions() {
  const { triggerPrediction, isPredicting, modelAccuracy } = useApp();

  return (
    <div className="space-y-6">
      {/* Header & Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white font-bold">
            Predictive Analysis
          </h2>
          <p className="text-on-surface-variant/70 dark:text-surface-variant/80 font-body-md text-sm">
            Forecast cohort dropout risk vectors, attendance trend metrics, and calibration scores.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* AI Machine Learning Simulation Overlay */}
      <AIEngineOverlay />

      {/* Detailed Prediction Interactive Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-[32px] flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
              <span className="material-symbols-outlined text-3xl">psychology</span>
            </div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white mb-2">Predictive Engine</h3>
            <p className="text-sm text-on-surface-variant dark:text-white/60 mb-6">
              Recalibrate coefficients using attendance curves, structural cohort margins, and neural engagement indices.
            </p>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                <span className="text-on-surface-variant/70 dark:text-white/50">Model Name:</span>
                <span className="font-bold text-on-surface dark:text-white font-mono">EduPulse Gradient Regressor v2.1</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                <span className="text-on-surface-variant/70 dark:text-white/50">Last Prediction Run:</span>
                <span className="font-bold text-on-surface dark:text-white font-mono">Just Now (Local Node)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant/70 dark:text-white/50">Confidence Interval:</span>
                <span className="font-bold text-secondary dark:text-secondary-fixed font-mono">{modelAccuracy}% Reliability</span>
              </div>
            </div>
          </div>

          <button
            onClick={triggerPrediction}
            disabled={isPredicting}
            className="glow-pulse w-full py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold shadow-xl hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPredicting ? 'Recalibrating Models...' : 'Run Analysis Calibration'}
          </button>
        </div>

        {/* Attendance Trends */}
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
      </div>
    </div>
  );
}
