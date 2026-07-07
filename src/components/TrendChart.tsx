import React from 'react';

export default function TrendChart() {
  return (
    <div className="glass-card p-8 rounded-[32px] min-h-[400px] flex flex-col w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white">Attendance Trends</h3>
          <p className="text-sm text-on-surface-variant/70 dark:text-white/60">Historical vs Predicted Attendance (%)</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-white">Weekly</button>
          <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/50 dark:bg-zinc-800 text-on-surface-variant dark:text-white/80">Monthly</button>
        </div>
      </div>
      
      <div className="flex-1 w-full flex items-end justify-between gap-4 relative">
        {/* Mock Chart Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
          <div className="border-t border-on-surface w-full" />
          <div className="border-t border-on-surface w-full" />
          <div className="border-t border-on-surface w-full" />
          <div className="border-t border-on-surface w-full" />
        </div>
        
        {/* Chart SVG */}
        <div className="w-full h-full relative flex items-end">
          <svg className="w-full h-full overflow-visible animate-pulse-slow" preserveAspectRatio="none" viewBox="0 0 1000 400">
            <defs>
              <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0066FF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,400 L0,300 C150,280 250,350 400,250 C550,150 700,200 850,120 L1000,80 L1000,400 Z" fill="url(#areaGradient)" />
            {/* Main Trend Line */}
            <path className="drop-shadow-[0_0_8px_#0066FF]" d="M0,300 C150,280 250,350 400,250 C550,150 700,200 850,120 L1000,80" fill="none" stroke="#0066FF" strokeLinecap="round" strokeWidth="4" />
            {/* Prediction Dotted Line */}
            <path d="M400,250 L1000,50" fill="none" stroke="#00dbe7" strokeDasharray="8 8" strokeLinecap="round" strokeWidth="3" />
            {/* Data Point */}
            <circle cx="400" cy="250" fill="#0066FF" r="6" stroke="white" strokeWidth="2" />
          </svg>
        </div>
      </div>
      
      <div className="flex justify-between mt-4 text-xs font-bold text-on-surface-variant/40 dark:text-white/40">
        <span>WK 1</span><span>WK 2</span><span>WK 3</span><span>WK 4</span><span>WK 5</span><span>WK 6 (CURRENT)</span><span>PROJECTION</span>
      </div>
    </div>
  );
}
