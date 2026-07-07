import React from 'react';
import { useApp } from '../context/AppContext';
import StatsGrid from '../components/StatsGrid';
import UploadCard from '../components/UploadCard';
import TrendChart from '../components/TrendChart';
import RiskPieChart from '../components/RiskPieChart';
import ClassBarChart from '../components/ClassBarChart';
import AIEngineOverlay from '../components/AIEngineOverlay';

export default function Dashboard() {
  const { triggerPrediction, isPredicting } = useApp();

  return (
    <div className="space-y-6">
      {/* Header & Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white font-bold">
            Dashboard Analytics
          </h2>
          <p className="text-on-surface-variant/70 dark:text-surface-variant/80 font-body-md text-sm">
            Real-time attendance intelligence powered by EduPulse prediction engines.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload CSV Card */}
        <UploadCard />

        {/* Charts Section: Line Chart */}
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
      </div>

      {/* Bento Charts Sub-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RiskPieChart />
        <ClassBarChart />
      </div>
    </div>
  );
}
