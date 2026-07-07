/// <reference types="react" />
import React, { useState, useEffect, useMemo, useRef } from 'react';
import ShaderBackground from './components/ShaderBackground';
import ThreeJSBackground from './components/ThreeJSBackground';

interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  attendance: number;
  predicted: number;
  riskLevel: 'Safe' | 'Warning' | 'Critical';
  className: string;
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: '#88291',
    name: 'Alex Rivera',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcuKNedc31jIdPH5mq3g38FzpCErw-OgnwnEcIRRj4_7u_uIFwODgsdja-p_hqnKzEydlQmkRalTxCIJzI6RrEtqweIppzLiy8HqfL71RmageGqQ8GIn0PTKxhaAYlaL8ZacJZNe59xU9uT9P3iLASZ2hajnN6CXD8M2Uzh-Hd4FvPk_B2yUBvKHKgR5lCQ8k9IuZ7Sk2t1FS6Kkq9Je1dDb-hKtahdRNdZbd5wErxaqKWXckz0fPF4sID5gk0Pzv7ZZiuy2K6tyk',
    attendance: 94.5,
    predicted: 92.0,
    riskLevel: 'Safe',
    className: 'CS101',
  },
  {
    id: '#88432',
    name: 'Jordan Smith',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChBVbkyVy0ezarK5p_zTpcORAjuUZF6cwYRxVR63OfeBB0oPolMZqS5MI9wJUhNIMolPH3GhhKH4RMEAPN3C3QLul9LN_J0hArhsot1RWL_T8img6i4yAv75_0jvuV-A6KTP3eUNH7Jw4lx6sWfQ5Tuxe3ID8xvfiNPUqRXtUrBCykA0tyhF0QTv1d0ZJcf6wjOmIUz__2zDzG09DhxrinNeBxq9SL8lzRQiLV6FmbAaRdBuyA2fF9hfpFGwEN6Et3xCwA8E8lPoo',
    attendance: 76.2,
    predicted: 68.5,
    riskLevel: 'Warning',
    className: 'MAT202',
  },
  {
    id: '#88511',
    name: "Liam O'Connor",
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsGhihlxTgS87n6jUxXR9dGeITzYQE3gYEMPAgFJ4BvmwTHavH52wIguwVwoivwu3w3bK4ue4bVqA028AtI0SSDwmXh81G2547EUGhjVDCheySkKkV_VC-o3u8xTnUiMTSQdr-YDmJsfuxIK4OfV87lMamoxASlEwaxl9sMUxOXfWj82g3iWW68oqaRYmXLE_O0m2B2sRB7BpvGyY_Z_ObIo5qFsRPBWKqTN0gVxIWh6jA4U5wBXzcoCIiq4NGAP0VnHpyooVrX3U',
    attendance: 62.8,
    predicted: 48.2,
    riskLevel: 'Critical',
    className: 'BIO301',
  },
  {
    id: '#88624',
    name: 'Elena Rostova',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    attendance: 92.1,
    predicted: 91.5,
    riskLevel: 'Safe',
    className: 'CS101',
  },
  {
    id: '#88102',
    name: 'Marcus Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    attendance: 81.5,
    predicted: 79.0,
    riskLevel: 'Warning',
    className: 'MAT202',
  },
  {
    id: '#88390',
    name: 'Chloe Dubois',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    attendance: 55.4,
    predicted: 41.0,
    riskLevel: 'Critical',
    className: 'BIO301',
  },
  {
    id: '#88741',
    name: 'Raj Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    attendance: 97.2,
    predicted: 96.8,
    riskLevel: 'Safe',
    className: 'ECO105',
  },
  {
    id: '#88582',
    name: 'Sophia Martinez',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    attendance: 73.6,
    predicted: 71.2,
    riskLevel: 'Warning',
    className: 'LIT110',
  },
];

export default function App() {
  // Navigation & Theme States
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Predictions' | 'Students' | 'Reports' | 'Settings'>('Dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Student Data States
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'Safe' | 'Warning' | 'Critical'>('All');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(3);

  // Interaction Modals & Triggers
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [selectedStudentMenu, setSelectedStudentMenu] = useState<string | null>(null);
  
  // Predict ML Simulation States
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionStep, setPredictionStep] = useState<number>(0);
  const [modelAccuracy, setModelAccuracy] = useState<number>(98.4);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // File upload state simulation
  const [uploadState, setUploadState] = useState<'idle' | 'dragging' | 'uploading' | 'completed'>('idle');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New Student Form States
  const [newStudentForm, setNewStudentForm] = useState({
    name: '',
    id: '',
    attendance: '85',
    predicted: '80',
    className: 'CS101',
    riskLevel: 'Safe' as 'Safe' | 'Warning' | 'Critical',
  });

  // Dark Mode Sync Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDarkMode]);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Drag and drop setup simulation handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('dragging');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('idle');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState('idle');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const processSelectedFile = (file: File) => {
    setUploadState('uploading');
    setUploadedFile({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    });

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadState('completed');
        setToastMessage(`Successfully uploaded and parsed ${file.name}`);
        // Optionally update mock student list slightly to simulate parsing
        setStudents((prev) => [
          ...prev,
          {
            id: `#${Math.floor(10000 + Math.random() * 90000)}`,
            name: 'Uploaded Record Student',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
            attendance: 87.5,
            predicted: 82.0,
            riskLevel: 'Safe',
            className: 'CS101',
          }
        ]);
      }
    }, 150);
  };

  // ML Prediction Simulation Handler
  const triggerPrediction = () => {
    if (isPredicting) return;
    setIsPredicting(true);
    setPredictionStep(0);

    const steps = [
      'Verifying attendance data stream integrity...',
      'Running gradient boosted risk regression...',
      'Synthesizing cohort behaviors and historical vectors...',
      'Computing neural engagement index coefficients...',
      'Syncing predictive margins across 1,248 student nodes...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setPredictionStep(currentStep);
      if (currentStep >= steps.length) {
        clearInterval(interval);
        setIsPredicting(false);
        setModelAccuracy(98.9);
        setToastMessage('Predictive model successfully re-calibrated. Accuracy increased to 98.9%!');
        
        // Slightly update predicted values in state to show dynamic change!
        setStudents((prev) =>
          prev.map((s) => ({
            ...s,
            predicted: Math.min(100, Math.round((s.predicted + (Math.random() * 4 - 2)) * 10) / 10),
          }))
        );
      }
    }, 1200);
  };

  const predictionProgressText = useMemo(() => {
    const steps = [
      'Initializing predictor engine...',
      'Verifying data stream integrity...',
      'Running gradient boosted risk regression...',
      'Synthesizing cohort behaviors and historical vectors...',
      'Computing engagement index coefficients...',
      'Syncing predictive margins across 1,248 student nodes...',
      'Prediction run complete!'
    ];
    return steps[predictionStep] || steps[0];
  }, [predictionStep]);

  // Stats Derived Calculations
  const baseTotal = 1248;
  const derivedStats = useMemo(() => {
    const totalCount = students.length;
    const safeCount = students.filter((s) => s.riskLevel === 'Safe').length;
    const warningCount = students.filter((s) => s.riskLevel === 'Warning').length;
    const criticalCount = students.filter((s) => s.riskLevel === 'Critical').length;

    return {
      total: baseTotal + (students.length - INITIAL_STUDENTS.length),
      safe: Math.round(baseTotal * (safeCount / totalCount)),
      warning: Math.round(baseTotal * (warningCount / totalCount)),
      critical: Math.round(baseTotal * (criticalCount / totalCount)),
    };
  }, [students]);

  // Custom Student Form Handler
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.name || !newStudentForm.id) {
      alert('Please fill out Name and ID fields.');
      return;
    }

    const currentAttendance = parseFloat(newStudentForm.attendance) || 85;
    const predictedAttendance = parseFloat(newStudentForm.predicted) || 80;

    let autoRisk: 'Safe' | 'Warning' | 'Critical' = 'Safe';
    if (predictedAttendance < 65) autoRisk = 'Critical';
    else if (predictedAttendance < 80) autoRisk = 'Warning';

    const newS: Student = {
      id: newStudentForm.id.startsWith('#') ? newStudentForm.id : `#${newStudentForm.id}`,
      name: newStudentForm.name,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      attendance: currentAttendance,
      predicted: predictedAttendance,
      riskLevel: autoRisk,
      className: newStudentForm.className,
    };

    setStudents((prev) => [newS, ...prev]);
    setShowAddStudentModal(false);
    setToastMessage(`Student ${newStudentForm.name} added and analyzed successfully.`);
    
    // Reset form
    setNewStudentForm({
      name: '',
      id: '',
      attendance: '85',
      predicted: '80',
      className: 'CS101',
      riskLevel: 'Safe',
    });
  };

  // Student list search, filter and pagination memo
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search text matches name or ID or class
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.className.toLowerCase().includes(searchTerm.toLowerCase());

      // Risk filters
      const matchesRisk = selectedRiskFilter === 'All' || student.riskLevel === selectedRiskFilter;

      // Class Engagement filters
      const matchesClass = selectedClassFilter === 'All' || student.className === selectedClassFilter;

      return matchesSearch && matchesRisk && matchesClass;
    });
  }, [students, searchTerm, selectedRiskFilter, selectedClassFilter]);

  // Pagination bounds
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredStudents.slice(startIndex, startIndex + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;

  // Reset currentPage if filtered list size drops
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRiskFilter, selectedClassFilter]);

  // Export CSV generator function
  const handleExportCSV = () => {
    const headers = 'ID,Student Name,Attendance %,Predicted %,Risk Level,Class\n';
    const rows = filteredStudents
      .map((s) => `"${s.id}","${s.name}",${s.attendance}%,${s.predicted}%,"${s.riskLevel}","${s.className}"`)
      .join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'EduPulse_Predictive_Risk_Report.csv');
    a.click();
    setToastMessage('Exported active analysis records to CSV successfully.');
  };

  const removeStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setSelectedStudentMenu(null);
    setToastMessage('Student record removed from tracking session.');
  };

  return (
    <div className="text-on-background min-h-screen relative font-sans transition-colors duration-300">
      {/* Premium Shader Background and ThreeJS Geometric floaters */}
      <ShaderBackground />
      <ThreeJSBackground />

      {/* SideNavBar */}
      <aside className="h-full w-sidebar-width fixed left-0 top-0 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-r border-white/20 dark:border-white/10 shadow-[0_0_20px_rgba(0,105,203,0.1)] z-50 transition-all duration-300 flex flex-col py-6">
        <div className="px-6 mb-10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">school</span>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">EduPulse AI</h1>
          </div>
          <p className="text-label-sm font-label-sm text-on-surface-variant/60 uppercase tracking-widest mt-1">Attendance Intelligence</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scroll">
          {/* Tabs */}
          {(['Dashboard', 'Predictions', 'Students', 'Reports', 'Settings'] as const).map((tab) => {
            const isActive = activeTab === tab;
            let icon = 'dashboard';
            if (tab === 'Predictions') icon = 'auto_graph';
            if (tab === 'Students') icon = 'group';
            if (tab === 'Reports') icon = 'assessment';
            if (tab === 'Settings') icon = 'settings';

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-3 px-4 py-3 text-left w-full transition-all duration-300 active:scale-95 relative ${
                  isActive
                    ? 'bg-primary/10 dark:bg-primary-container/20 text-primary dark:text-secondary-fixed font-semibold border-l-4 border-secondary-fixed'
                    : 'text-on-surface-variant/70 dark:text-surface-variant hover:text-primary hover:bg-white/40 dark:hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined">{icon}</span>
                <span className="font-body-md text-body-md">{tab}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-6 mt-6">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            New Student Analysis
          </button>
        </div>

        <div className="mt-auto px-4 flex flex-col gap-1 border-t border-white/20 pt-6">
          <button
            onClick={() => setToastMessage('Help documentation is currently being generated.')}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-on-surface-variant/70 hover:text-primary transition-colors hover:bg-white/10 rounded-lg"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-body-md text-body-md">Help</span>
          </button>
          <button
            onClick={() => setToastMessage('Logged out of Academic Admin session safely.')}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-on-surface-variant/70 hover:text-error transition-colors hover:bg-white/10 rounded-lg"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md text-body-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="h-20 w-[calc(100%-var(--spacing-sidebar-width))] fixed top-0 right-0 z-40 bg-white/40 dark:bg-black/40 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm flex justify-between items-center px-gutter">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative w-full max-w-md group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/60 group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e: { target: { value: any; }; }) => setSearchTerm(e.target.value)}
              className="w-full bg-white/50 dark:bg-black/40 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-secondary/50 focus:bg-white dark:focus:bg-black/70 transition-all text-body-md placeholder:text-on-surface-variant/40 dark:text-white"
              placeholder="Search student or class data..."
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-white/20 pr-6">
            {/* Notification triggers */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/40 dark:hover:bg-white/10 transition-colors relative"
              >
                <span className="material-symbols-outlined text-on-surface-variant dark:text-white">
                  notifications
                </span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-4 z-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-on-surface dark:text-white">Recent Alerts</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-primary font-bold">Close</button>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs">
                      <p className="font-semibold text-error">Critical Warning Rate Increase</p>
                      <p className="text-zinc-500 mt-1">Engagement drop detected in LIT110 course segment.</p>
                    </div>
                    <div className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs">
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

          <div className="flex items-center gap-3 pl-2">
            <div className="text-right">
              <p className="font-semibold text-body-md text-primary dark:text-secondary-fixed">Dr. Sarah Chen</p>
              <p className="text-xs text-on-surface-variant/70 dark:text-white/60 uppercase font-bold tracking-tighter">Academic Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5">
              <img
                className="w-full h-full object-cover rounded-full"
                alt="Dr. Sarah Chen Portrait"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCB_luzqfOyQQddYMAhd8mFuEo0QVwHxu-3tJtgazwhjT-685ifNzv0OdCg1MH80Nap5d7I4HpUT-Md5YXLsAjvmotDDcT1q6p75UKaVtRcd1MT7a6IoL4BX5L0a71JbxDDlYc9wmUto8WSPAWlEQLgkuynGh4mvV1L-B4jhJXTCEQDX-GKg3ADkCGLn7Mx8_nQM7IObSFUz3Hbdv1oQfhr9kOw6pgYoEcj-UbMzYiLDaqiWE4cNczkNam6ID9Nb48q8OpS3i4YbuQ"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="ml-sidebar-width pt-20 p-gutter">
        <div className="max-w-[1600px] mx-auto space-y-gutter">
          
          {/* Header & Action Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface dark:text-white font-bold">
                {activeTab} Analytics Dashboard
              </h2>
              <p className="text-on-surface-variant/70 dark:text-surface-variant/80 font-body-md">
                Real-time attendance intelligence powered by EduPulse prediction engines.
              </p>
            </div>
            
            <button
              onClick={triggerPrediction}
              disabled={isPredicting}
              className="glow-pulse flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-lg shadow-xl shadow-secondary/20 hover:scale-105 transition-transform active:scale-95 group disabled:opacity-55 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              {isPredicting ? 'Running AI Engine...' : 'Predict Attendance'}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-card-gap relative">
            <div className="data-flow-line top-1/2 left-0" />
            
            {/* Total Enrolled Card */}
            <div
              onClick={() => setSelectedRiskFilter('All')}
              className={`glass-card p-6 rounded-3xl relative z-10 transition-all hover:translate-y-[-4px] cursor-pointer ${
                selectedRiskFilter === 'All' ? 'border-primary border-2 shadow-xl bg-primary/5' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined">group</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant/50 dark:text-white/40 uppercase">Total</span>
              </div>
              <p className="text-4xl font-bold text-on-surface dark:text-white">
                {derivedStats.total.toLocaleString()}
              </p>
              <p className="text-sm text-on-surface-variant dark:text-white/60 mt-1">Enrolled Students</p>
            </div>

            {/* Safe Zone Card */}
            <div
              onClick={() => setSelectedRiskFilter('Safe')}
              className={`glass-card p-6 rounded-3xl relative z-10 transition-all hover:translate-y-[-4px] cursor-pointer ${
                selectedRiskFilter === 'Safe' ? 'border-green-500 border-2 shadow-xl bg-green-500/5' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant/50 dark:text-white/40 uppercase">Safe Zone</span>
              </div>
              <p className="text-4xl font-bold text-on-surface dark:text-white">
                {derivedStats.safe.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold text-sm mt-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+12%</span>
              </div>
            </div>

            {/* Warning Card */}
            <div
              onClick={() => setSelectedRiskFilter('Warning')}
              className={`glass-card p-6 rounded-3xl relative z-10 transition-all hover:translate-y-[-4px] cursor-pointer ${
                selectedRiskFilter === 'Warning' ? 'border-yellow-500 border-2 shadow-xl bg-yellow-500/5' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant/50 dark:text-white/40 uppercase">Warning</span>
              </div>
              <p className="text-4xl font-bold text-on-surface dark:text-white">
                {derivedStats.warning.toLocaleString()}
              </p>
              <p className="text-sm text-on-surface-variant dark:text-white/60 mt-1">Review Required</p>
            </div>

            {/* Critical Card */}
            <div
              onClick={() => setSelectedRiskFilter('Critical')}
              className={`glass-card p-6 rounded-3xl relative z-10 transition-all hover:translate-y-[-4px] cursor-pointer ${
                selectedRiskFilter === 'Critical' ? 'border-error border-2 shadow-xl bg-error/5' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-error/10 rounded-2xl flex items-center justify-center text-error">
                  <span className="material-symbols-outlined">dangerous</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant/50 dark:text-white/40 uppercase">Critical</span>
              </div>
              <p className="text-4xl font-bold text-on-surface dark:text-white">
                {derivedStats.critical.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 text-error font-bold text-sm mt-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+3%</span>
              </div>
            </div>

            {/* Accuracy Card */}
            <div className="glass-card p-6 rounded-3xl relative z-10 border-primary/20 border-2 transition-all hover:translate-y-[-4px] bg-primary/5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">precision_manufacturing</span>
                </div>
                <span className="text-xs font-bold text-on-surface-variant/50 dark:text-white/40 uppercase">Accuracy</span>
              </div>
              <p className="text-4xl font-bold text-primary dark:text-blue-400">{modelAccuracy}%</p>
              <p className="text-sm text-primary/70 dark:text-blue-300 mt-1">Model Reliability</p>
            </div>
          </div>

          {/* AI Machine Learning Simulation Overlay */}
          {isPredicting && (
            <div className="glass-card rounded-[32px] p-container-padding flex flex-col items-center justify-center text-center relative overflow-hidden z-20 border-secondary border-2 shadow-2xl bg-white/95 dark:bg-zinc-950/95 transition-all">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary mb-6" />
              <h3 className="font-headline-md text-2xl font-bold text-on-surface dark:text-white">EduPulse Predictive Analytics Run</h3>
              <p className="text-secondary font-semibold font-mono text-sm tracking-wider mt-2">{predictionProgressText}</p>
              <div className="w-full max-w-xl bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mt-6">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
                  style={{ width: `${(predictionStep / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs text-on-surface-variant mt-4">Calculated from historical variables, class attendance curves, and individual risk weights.</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-card-gap">
            {/* Upload CSV Card */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileBrowser}
              className={`glass-card p-container-padding rounded-[32px] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/80 dark:hover:bg-zinc-900/60 transition-all ${
                uploadState === 'dragging' ? 'bg-primary/5 ring-4 ring-[#00Dbe7]/50' : ''
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".csv,.xlsx,.xls,.json"
                className="hidden"
              />

              <div className="w-full h-full upload-dashed p-8 flex flex-col items-center justify-center border-2 border-transparent transition-all group-hover:border-primary/40">
                {uploadState === 'uploading' ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
                    <p className="font-bold text-on-surface dark:text-white">Uploading {uploadedFile?.name}...</p>
                    <p className="text-xs text-zinc-500 mt-1">{uploadProgress}% Complete</p>
                  </div>
                ) : uploadState === 'completed' ? (
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-green-500 text-5xl mb-4">check_circle</span>
                    <p className="font-bold text-on-surface dark:text-white">{uploadedFile?.name}</p>
                    <p className="text-xs text-green-600 font-semibold mt-1">Processed {uploadedFile?.size} successfully</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadState('idle');
                        setUploadedFile(null);
                      }}
                      className="mt-4 text-xs font-bold text-primary underline"
                    >
                      Upload Another
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-primary-container/10 rounded-full flex items-center justify-center text-primary-container mb-6 group-hover:scale-110 transition-transform duration-500">
                      <span className="material-symbols-outlined text-4xl text-primary">cloud_upload</span>
                    </div>
                    <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white">Upload Semester Data</h3>
                    <p className="text-on-surface-variant/70 dark:text-white/60 mt-2 max-w-[240px]">
                      Drag and drop your attendance CSV or Excel files here for AI processing.
                    </p>
                    <div className="mt-8 flex gap-3">
                      <span className="text-xs font-bold bg-surface-container dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-on-surface-variant dark:text-white/80">.CSV</span>
                      <span className="text-xs font-bold bg-surface-container dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-on-surface-variant dark:text-white/80">.XLSX</span>
                      <span className="text-xs font-bold bg-surface-container dark:bg-zinc-800 px-3 py-1.5 rounded-lg text-on-surface-variant dark:text-white/80">.JSON</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Charts Section: Line Chart */}
            <div className="lg:col-span-2 glass-card p-container-padding rounded-[32px] min-h-[400px] flex flex-col">
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
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 400">
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
          </div>

          {/* Bento Charts Sub-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-card-gap">
            
            {/* Pie Chart: Risk Distribution */}
            <div className="glass-card p-container-padding rounded-[32px] flex flex-col">
              <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white mb-6">Risk Distribution</h3>
              <div className="flex-1 flex items-center justify-around flex-wrap gap-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#f2f4f6" strokeWidth="12" />
                    {/* Safe curve (75%) */}
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#00dbe7" strokeDasharray="180 251" strokeDashoffset="0" strokeWidth="12" transform="rotate(-90 50 50)" />
                    {/* Warning curve (17%) */}
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#0066FF" strokeDasharray="70 251" strokeDashoffset="-180" strokeWidth="12" transform="rotate(-90 50 50)" />
                    {/* Critical curve (8%) */}
                    <circle cx="50" cy="50" fill="none" r="40" stroke="#ba1a1a" strokeDasharray="25 251" strokeDashoffset="-250" strokeWidth="12" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-on-surface dark:text-white">
                      {(derivedStats.safe + derivedStats.warning + derivedStats.critical).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-on-surface-variant dark:text-white/60 font-bold uppercase tracking-tighter">Total Students</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#00dbe7]" />
                    <span className="text-sm font-bold text-on-surface-variant dark:text-white/80">
                      Safe ({Math.round(100 * (students.filter(s => s.riskLevel === 'Safe').length / students.length)) || 75}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm font-bold text-on-surface-variant dark:text-white/80">
                      Warning ({Math.round(100 * (students.filter(s => s.riskLevel === 'Warning').length / students.length)) || 17}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-error" />
                    <span className="text-sm font-bold text-on-surface-variant dark:text-white/80">
                      Critical ({Math.round(100 * (students.filter(s => s.riskLevel === 'Critical').length / students.length)) || 8}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart: Class Performance */}
            <div className="glass-card p-container-padding rounded-[32px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white">Class-wise Engagement</h3>
                <div className="flex items-center gap-1.5 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-full p-1 text-xs">
                  <button
                    onClick={() => setSelectedClassFilter('All')}
                    className={`px-3 py-1 rounded-full font-bold transition-all ${
                      selectedClassFilter === 'All' ? 'bg-primary text-white' : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    All
                  </button>
                  {['CS101', 'MAT202', 'BIO301', 'ECO105', 'LIT110'].map((className) => (
                    <button
                      key={className}
                      onClick={() => setSelectedClassFilter(className)}
                      className={`px-3 py-1 rounded-full font-bold transition-all ${
                        selectedClassFilter === className ? 'bg-primary text-white' : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {className}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex items-end justify-between gap-4 h-[200px]">
                {/* CS101 Bar */}
                <div className="flex flex-col items-center gap-3 w-full cursor-pointer" onClick={() => setSelectedClassFilter('CS101')}>
                  <div className="w-full bg-primary/10 rounded-t-xl relative group h-[180px]">
                    <div className="absolute bottom-0 left-0 w-full bg-primary rounded-t-xl group-hover:bg-secondary transition-all" style={{ height: '85%' }} />
                  </div>
                  <span className={`text-xs font-bold ${selectedClassFilter === 'CS101' ? 'text-primary' : 'text-on-surface-variant'}`}>CS101</span>
                </div>
                
                {/* MAT202 Bar */}
                <div className="flex flex-col items-center gap-3 w-full cursor-pointer" onClick={() => setSelectedClassFilter('MAT202')}>
                  <div className="w-full bg-primary/10 rounded-t-xl relative group h-[180px]">
                    <div className="absolute bottom-0 left-0 w-full bg-primary rounded-t-xl group-hover:bg-secondary transition-all" style={{ height: '60%' }} />
                  </div>
                  <span className={`text-xs font-bold ${selectedClassFilter === 'MAT202' ? 'text-primary' : 'text-on-surface-variant'}`}>MAT202</span>
                </div>
                
                {/* BIO301 Bar */}
                <div className="flex flex-col items-center gap-3 w-full cursor-pointer" onClick={() => setSelectedClassFilter('BIO301')}>
                  <div className="w-full bg-primary/10 rounded-t-xl relative group h-[180px]">
                    <div className="absolute bottom-0 left-0 w-full bg-primary rounded-t-xl group-hover:bg-secondary transition-all" style={{ height: '92%' }} />
                  </div>
                  <span className={`text-xs font-bold ${selectedClassFilter === 'BIO301' ? 'text-primary' : 'text-on-surface-variant'}`}>BIO301</span>
                </div>
                
                {/* ECO105 Bar */}
                <div className="flex flex-col items-center gap-3 w-full cursor-pointer" onClick={() => setSelectedClassFilter('ECO105')}>
                  <div className="w-full bg-primary/10 rounded-t-xl relative group h-[180px]">
                    <div className="absolute bottom-0 left-0 w-full bg-primary rounded-t-xl group-hover:bg-secondary transition-all" style={{ height: '45%' }} />
                  </div>
                  <span className={`text-xs font-bold ${selectedClassFilter === 'ECO105' ? 'text-primary' : 'text-on-surface-variant'}`}>ECO105</span>
                </div>
                
                {/* LIT110 Bar */}
                <div className="flex flex-col items-center gap-3 w-full cursor-pointer" onClick={() => setSelectedClassFilter('LIT110')}>
                  <div className="w-full bg-primary/10 rounded-t-xl relative group h-[180px]">
                    <div className="absolute bottom-0 left-0 w-full bg-primary rounded-t-xl group-hover:bg-secondary transition-all" style={{ height: '78%' }} />
                  </div>
                  <span className={`text-xs font-bold ${selectedClassFilter === 'LIT110' ? 'text-primary' : 'text-on-surface-variant'}`}>LIT110</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Table Section */}
          <div className="glass-card rounded-[32px] overflow-hidden">
            <div className="px-gutter py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/20">
              <div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface dark:text-white">
                  Predictive Risk Table {selectedRiskFilter !== 'All' ? `(${selectedRiskFilter} Only)` : ''} {selectedClassFilter !== 'All' ? `(${selectedClassFilter} Class)` : ''}
                </h3>
                <p className="text-xs text-on-surface-variant/80 mt-1">
                  Showing {filteredStudents.length} active matching students in scope
                </p>
              </div>
              
              <div className="flex gap-4 w-full sm:w-auto">
                {/* Filter resets */}
                {(selectedRiskFilter !== 'All' || selectedClassFilter !== 'All' || searchTerm !== '') && (
                  <button
                    onClick={() => {
                      setSelectedRiskFilter('All');
                      setSelectedClassFilter('All');
                      setSearchTerm('');
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-primary transition-colors bg-white/20 dark:bg-black/30 px-3 py-2 rounded-xl border border-white/20"
                  >
                    Clear Filters
                  </button>
                )}

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl transition-all hover:bg-primary/20"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-primary/5">
                  <tr>
                    <th className="px-gutter py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Student Name</th>
                    <th className="px-gutter py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Current Class</th>
                    <th className="px-gutter py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Attendance %</th>
                    <th className="px-gutter py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Predicted %</th>
                    <th className="px-gutter py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Risk Level</th>
                    <th className="px-gutter py-4 text-left text-xs font-bold text-on-surface-variant dark:text-white/60 uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student) => {
                      let riskBadgeClass = 'risk-safe';
                      if (student.riskLevel === 'Warning') riskBadgeClass = 'risk-warning';
                      if (student.riskLevel === 'Critical') riskBadgeClass = 'risk-critical';

                      let riskDotColor = 'bg-green-500';
                      if (student.riskLevel === 'Warning') riskDotColor = 'bg-yellow-500';
                      if (student.riskLevel === 'Critical') riskDotColor = 'bg-error';

                      return (
                        <tr key={student.id} className="hover:bg-primary/5 dark:hover:bg-white/5 transition-colors group">
                          <td className="px-gutter py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container relative">
                                <img className="w-full h-full object-cover" alt={student.name} src={student.avatarUrl} />
                              </div>
                              <div>
                                <p className="font-bold text-on-surface dark:text-white">{student.name}</p>
                                <p className="text-xs text-on-surface-variant/60 dark:text-white/40">ID: {student.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-gutter py-4">
                            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-200/50 dark:bg-zinc-800 px-2 py-1 rounded">
                              {student.className}
                            </span>
                          </td>
                          <td className="px-gutter py-4 font-bold text-on-surface dark:text-white">{student.attendance}%</td>
                          <td className="px-gutter py-4 font-bold text-secondary dark:text-secondary-fixed">{student.predicted}%</td>
                          <td className="px-gutter py-4">
                            <span className={`risk-badge ${riskBadgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${riskDotColor} animate-pulse`} />
                              {student.riskLevel}
                            </span>
                          </td>
                          <td className="px-gutter py-4 relative">
                            <button
                              onClick={() => setSelectedStudentMenu(selectedStudentMenu === student.id ? null : student.id)}
                              className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-zinc-800 flex items-center justify-center text-on-surface-variant dark:text-white/80"
                            >
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>

                            {/* Dropdown Action Popover */}
                            {selectedStudentMenu === student.id && (
                              <div className="absolute right-gutter mt-1 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-2 z-50">
                                <button
                                  onClick={() => {
                                    setToastMessage(`Details report loaded for student ${student.name}`);
                                    setSelectedStudentMenu(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-on-surface dark:text-white"
                                >
                                  View Cohort Report
                                </button>
                                <button
                                  onClick={() => {
                                    setToastMessage(`Email notification dispatched to ${student.name} regarding attendance of ${student.attendance}%`);
                                    setSelectedStudentMenu(null);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-on-surface dark:text-white"
                                >
                                  Send Email Alert
                                </button>
                                <button
                                  onClick={() => removeStudent(student.id)}
                                  className="w-full text-left px-3 py-2 text-xs rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-error font-semibold"
                                >
                                  Delete Record
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-gutter py-12 text-center text-on-surface-variant dark:text-white/60">
                        No students found matching current filters. Try searching for other values or clearing active filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-gutter py-6 bg-surface-container/50 dark:bg-zinc-950/40 flex justify-between items-center text-sm font-bold text-on-surface-variant/70 dark:text-white/60">
              <span>
                Showing {Math.min(filteredStudents.length, (currentPage - 1) * pageSize + 1)}-
                {Math.min(filteredStudents.length, currentPage * pageSize)} of {filteredStudents.length} students
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((c) => c - 1)}
                  className="w-10 h-10 rounded-xl border border-white/20 bg-white/40 dark:bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center transition-all ${
                        currentPage === page
                          ? 'bg-primary text-white font-bold'
                          : 'bg-white/40 dark:bg-zinc-800 hover:bg-primary hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((c) => c + 1)}
                  className="w-10 h-10 rounded-xl border border-white/20 bg-white/40 dark:bg-zinc-800 flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] max-w-md w-full p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative">
            <button
              onClick={() => setShowAddStudentModal(false)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="font-headline-md text-2xl font-bold text-on-surface dark:text-white mb-2">New Student Analysis</h3>
            <p className="text-sm text-zinc-500 mb-6">Create a predictive tracking record for a new semester attendee.</p>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  placeholder="e.g. Liam Patterson"
                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Student ID</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.id}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, id: e.target.value })}
                    placeholder="e.g. 88612"
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Class</label>
                  <select
                    value={newStudentForm.className}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, className: e.target.value })}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white"
                  >
                    <option value="CS101">CS101</option>
                    <option value="MAT202">MAT202</option>
                    <option value="BIO301">BIO301</option>
                    <option value="ECO105">ECO105</option>
                    <option value="LIT110">LIT110</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Attendance %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStudentForm.attendance}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, attendance: e.target.value })}
                    placeholder="85"
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Predicted %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStudentForm.predicted}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, predicted: e.target.value })}
                    placeholder="80"
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary/90 transition-all"
                >
                  Analyze & Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Interactive Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-zinc-700/30 animate-slide-in">
          <span className="material-symbols-outlined text-secondary">info</span>
          <p className="text-sm font-semibold">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="ml-4 text-zinc-400 hover:text-white dark:hover:text-black">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
