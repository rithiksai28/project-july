import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { isSidebarCollapsed, setIsSidebarCollapsed, setShowAddStudentModal, setToastMessage } = useApp();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Predictions', path: '/predictions', icon: 'auto_graph' },
    { name: 'Students', path: '/students', icon: 'group' },
    { name: 'Reports', path: '/reports', icon: 'assessment' },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];

  return (
    <motion.aside
      id="main-sidebar"
      initial={{ width: isSidebarCollapsed ? 80 : 280 }}
      animate={{ width: isSidebarCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full fixed left-0 top-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-r border-white/20 dark:border-white/10 shadow-[0_0_20px_rgba(0,105,203,0.1)] z-50 flex flex-col py-6 select-none overflow-hidden"
    >
      {/* Brand Header */}
      <div className="px-5 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="material-symbols-outlined text-primary text-3xl font-bold shrink-0">school</span>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col whitespace-nowrap"
            >
              <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">EduPulse AI</h1>
              <p className="text-[9px] font-label-sm text-on-surface-variant/60 uppercase tracking-widest mt-0.5">Attendance Intel</p>
            </motion.div>
          )}
        </div>

        {/* Collapsible Chevron Button */}
        {!isSidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-on-surface-variant transition-colors"
            title="Collapse Sidebar"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
        )}
      </div>

      {isSidebarCollapsed && (
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            title="Expand Sidebar"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scroll px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-left w-full rounded-xl transition-all duration-300 active:scale-95 relative ${
                isActive
                  ? 'bg-primary/10 dark:bg-primary-container/20 text-primary dark:text-secondary-fixed font-semibold border-l-4 border-secondary-fixed'
                  : 'text-on-surface-variant/70 dark:text-surface-variant hover:text-primary hover:bg-white/40 dark:hover:bg-white/10'
              } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`
            }
            title={isSidebarCollapsed ? item.name : undefined}
          >
            <span className="material-symbols-outlined shrink-0">{item.icon}</span>
            {!isSidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-body-md text-body-md whitespace-nowrap"
              >
                {item.name}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* New Student Action Button */}
      <div className="px-4 mt-6">
        <button
          onClick={() => setShowAddStudentModal(true)}
          className={`w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95 ${
            isSidebarCollapsed ? 'rounded-full w-10 h-10 p-0 mx-auto' : ''
          }`}
          title="New Student Analysis"
        >
          <span className="material-symbols-outlined shrink-0">add</span>
          {!isSidebarCollapsed && <span className="whitespace-nowrap">New Student</span>}
        </button>
      </div>

      {/* Footer Support/Logout actions */}
      <div className="mt-auto px-2 flex flex-col gap-1 border-t border-white/20 pt-6">
        <button
          onClick={() => setToastMessage('Help documentation is currently being generated.')}
          className={`flex items-center gap-3 px-4 py-3 w-full text-left text-on-surface-variant/70 hover:text-primary transition-colors hover:bg-white/10 rounded-lg ${
            isSidebarCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Help & FAQ"
        >
          <span className="material-symbols-outlined shrink-0">help</span>
          {!isSidebarCollapsed && <span className="font-body-md text-body-md whitespace-nowrap">Help</span>}
        </button>
        <button
          onClick={() => setToastMessage('Logged out of Academic Admin session safely.')}
          className={`flex items-center gap-3 px-4 py-3 w-full text-left text-on-surface-variant/70 hover:text-error transition-colors hover:bg-white/10 rounded-lg ${
            isSidebarCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Logout"
        >
          <span className="material-symbols-outlined shrink-0">logout</span>
          {!isSidebarCollapsed && <span className="font-body-md text-body-md whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
