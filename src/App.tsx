import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ShaderBackground from './components/ShaderBackground';
import ThreeJSBackground from './components/ThreeJSBackground';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AddStudentModal from './components/AddStudentModal';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import Students from './pages/Students';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function AppContent() {
  const { isSidebarCollapsed, toastMessage, setToastMessage } = useApp();

  return (
    <div className="text-on-background min-h-screen relative font-sans transition-colors duration-300">
      {/* Premium Shader Background and ThreeJS Geometric floaters */}
      <ShaderBackground />
      <ThreeJSBackground />

      {/* SideNavBar */}
      <Sidebar />

      {/* TopNavBar */}
      <Header />

      {/* Main Content Canvas */}
      <main
        className={`transition-all duration-300 pt-28 pb-12 px-6 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-[280px]'
        }`}
      >
        <div className="max-w-[1600px] mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/students" element={<Students />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>

      {/* Add Student Modal Form */}
      <AddStudentModal />

      {/* Global Interactive Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-zinc-700/30 animate-slide-in">
          <span className="material-symbols-outlined text-secondary">info</span>
          <p className="text-sm font-semibold">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-4 text-zinc-400 hover:text-white dark:hover:text-black cursor-pointer"
            title="Dismiss Toast"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}
