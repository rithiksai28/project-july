import React from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const {
    isSidebarCollapsed,
    searchTerm,
    setSearchTerm,
    showNotifications,
    setShowNotifications,
    isDarkMode,
    setIsDarkMode,
  } = useApp();

  return (
    <header
      id="top-navbar"
      className={`h-20 fixed top-0 right-0 z-40 bg-white/40 dark:bg-black/40 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm flex justify-between items-center px-6 transition-all duration-300 ${
        isSidebarCollapsed ? 'left-20 w-[calc(100%-80px)]' : 'left-[280px] w-[calc(100%-280px)]'
      }`}
    >
      {/* Search Input Box */}
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/40 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-secondary/50 focus:bg-white dark:focus:bg-black/70 transition-all text-body-md placeholder:text-on-surface-variant/40 dark:text-white outline-none"
            placeholder="Search student or class data..."
          />
        </div>
      </div>

      {/* User Actions & Toggle controls */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-white/20 pr-6">
          {/* Notification Alert Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors relative"
              title="Alert Notifications"
            >
              <span className="material-symbols-outlined text-on-surface-variant dark:text-white">
                notifications
              </span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-4 z-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-on-surface dark:text-white text-sm">Recent Alerts</h4>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs cursor-pointer">
                    <p className="font-semibold text-error">Critical Warning Rate Increase</p>
                    <p className="text-zinc-500 mt-1">Engagement drop detected in LIT110 course segment.</p>
                  </div>
                  <div className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs cursor-pointer">
                    <p className="font-semibold text-secondary">Analysis Report Ready</p>
                    <p className="text-zinc-500 mt-1">Midterm predictive cohort analysis is now ready to download.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors"
            title="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined text-on-surface-variant dark:text-white">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-body-md text-primary dark:text-secondary-fixed">Dr. Sarah Chen</p>
            <p className="text-[10px] text-on-surface-variant/70 dark:text-white/60 uppercase font-bold tracking-wider">Academic Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 shrink-0 overflow-hidden">
            <img
              className="w-full h-full object-cover rounded-full"
              alt="Dr. Sarah Chen Portrait"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB_luzqfOyQQddYMAhd8mFuEo0QVwHxu-3tJtgazwhjT-685ifNzv0OdCg1MH80Nap5d7I4HpUT-Md5YXLsAjvmotDDcT1q6p75UKaVtRcd1MT7a6IoL4BX5L0a71JbxDDlYc9wmUto8WSPAWlEQLgkuynGh4mvV1L-B4jhJXTCEQDX-GKg3ADkCGLn7Mx8_nQM7IObSFUz3Hbdv1oQfhr9kOw6pgYoEcj-UbMzYiLDaqiWE4cNczkNam6ID9Nb48q8OpS3i4YbuQ"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
