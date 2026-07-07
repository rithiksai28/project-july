import React from 'react';
import { useApp } from '../context/AppContext';
import StatsGrid from '../components/StatsGrid';
import StudentTable from '../components/StudentTable';
import AIEngineOverlay from '../components/AIEngineOverlay';

export default function Students() {
  const { triggerPrediction, isPredicting } = useApp();

  return (
    <div className="space-y-6">
      {/* Header & Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white font-bold">
            Student Directory
          </h2>
          <p className="text-on-surface-variant/70 dark:text-surface-variant/80 font-body-md text-sm">
            Manage student attendance curves, risk levels, and dispatch warning notifications.
          </p>
        </div>
        
        <button
          onClick={triggerPrediction}
          disabled={isPredicting}
          className="glow-pulse flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-lg shadow-xl shadow-secondary/20 hover:scale-105 transition-transform active:scale-95 group disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
          {isPredicting ? 'Running AI Engine...' : 'Predict Attendance'}
        </button>
      </div>

      {/* Stats Grid */}
      <StatsGrid />

      {/* AI Machine Learning Simulation Overlay */}
      <AIEngineOverlay />

      {/* Student Table */}
      <StudentTable />
    </div>
  );
}
