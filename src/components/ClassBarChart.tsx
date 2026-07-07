import React from 'react';
import { useApp } from '../context/AppContext';

export default function ClassBarChart() {
  const { selectedClassFilter, setSelectedClassFilter } = useApp();

  const classes = [
    { name: 'CS101', height: '85%' },
    { name: 'MAT202', height: '60%' },
    { name: 'BIO301', height: '92%' },
    { name: 'ECO105', height: '45%' },
    { name: 'LIT110', height: '78%' },
  ];

  return (
    <div className="glass-card p-8 rounded-[32px] flex flex-col w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white">Class-wise Engagement</h3>
        <div className="flex items-center gap-1.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full p-1 text-xs select-none">
          <button
            onClick={() => setSelectedClassFilter('All')}
            className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
              selectedClassFilter === 'All' ? 'bg-primary text-white' : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            All
          </button>
          {classes.map((cls) => (
            <button
              key={cls.name}
              onClick={() => setSelectedClassFilter(cls.name)}
              className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                selectedClassFilter === cls.name ? 'bg-primary text-white' : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-4 h-[200px]">
        {classes.map((cls) => (
          <div
            key={cls.name}
            className="flex flex-col items-center gap-3 w-full cursor-pointer group"
            onClick={() => setSelectedClassFilter(cls.name)}
          >
            <div className={`w-full rounded-t-xl relative h-[180px] transition-all duration-300 ${
              selectedClassFilter === cls.name ? 'bg-primary/20 ring-2 ring-primary/40' : 'bg-primary/10'
            }`}>
              <div
                className={`absolute bottom-0 left-0 w-full rounded-t-xl transition-all duration-500 ${
                  selectedClassFilter === cls.name ? 'bg-secondary shadow-lg shadow-secondary/20' : 'bg-primary group-hover:bg-secondary'
                }`}
                style={{ height: cls.height }}
              />
            </div>
            <span className={`text-xs font-bold transition-colors ${
              selectedClassFilter === cls.name ? 'text-primary font-extrabold' : 'text-on-surface-variant'
            }`}>
              {cls.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
