import React from 'react';
import { useApp } from '../context/AppContext';
import UploadCard from '../components/UploadCard';
import RiskPieChart from '../components/RiskPieChart';
import ClassBarChart from '../components/ClassBarChart';
import AIEngineOverlay from '../components/AIEngineOverlay';

export default function Reports() {
  const { handleExportCSV, filteredStudents, setToastMessage } = useApp();

  return (
    <div className="space-y-6">
      {/* Header & Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white font-bold">
            Analysis Reports
          </h2>
          <p className="text-on-surface-variant/70 dark:text-surface-variant/80 font-body-md text-sm">
            Export raw CSV logs, view aggregated cohort data, and sync student metrics.
          </p>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 border border-primary/20 px-6 py-3.5 rounded-2xl transition-all hover:bg-primary/20 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export Full Report (CSV)
        </button>
      </div>

      {/* AI Machine Learning Simulation Overlay */}
      <AIEngineOverlay />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Card for parsed data */}
        <UploadCard />

        {/* Custom PDF/CSV Report Generation Cards */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[32px] flex flex-col justify-between">
          <div>
            <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white mb-2">Available Reports</h3>
            <p className="text-sm text-on-surface-variant/70 dark:text-white/60 mb-6">Select from standard templates compiled from currently filtered cohorts ({filteredStudents.length} records).</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl border border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500">dangerous</span>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface dark:text-white">Critical Risk Assessment</h4>
                    <p className="text-xs text-zinc-500">Cohort data focusing on high-risk, low-predicted attendance students.</p>
                  </div>
                </div>
                <button
                  onClick={() => setToastMessage('Critical risk assessment PDF generating...')}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Get PDF
                </button>
              </div>

              <div className="flex justify-between items-center p-4 hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl border border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-500">stacked_line_chart</span>
                  <div>
                    <h4 className="font-bold text-sm text-on-surface dark:text-white">Weekly Performance Summary</h4>
                    <p className="text-xs text-zinc-500">A visual outline tracing weekly course-segment attendance vectors.</p>
                  </div>
                </div>
                <button
                  onClick={() => setToastMessage('Performance summary spreadsheet generating...')}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Get XLS
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-zinc-500 mt-6">Generated on demand from live active local node memory.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RiskPieChart />
        <ClassBarChart />
      </div>
    </div>
  );
}
